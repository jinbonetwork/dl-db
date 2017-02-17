import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import View from '../accessories/docManager/View';
import ViewElem from '../accessories/docManager/ViewElem';
import {checkIfParsing, doAfterReceiveParseState} from '../fieldData/docFieldData';
import LinkIf from '../accessories/LinkIf';
import {SCREEN} from '../constants';
import {_isCommon, _mapAO, _mapOO, _wrap, _isEmpty, _interpolate} from '../accessories/functions';

class Document extends Component {
	constructor(){
		super();
		this.intvOfRqstParseState = undefined;
	}
	componentDidMount(){
		if(!_isCommon([this.props.role], ['administrator', 'view'])){
			this.props.showMessage('권한이 없습니다.', this.props.router.goBack); return null;
		}
		if(!this.props.openDocs[this.props.params.id]){
			this.props.fetchDoc(this.props.params.id);
		}
	}
	componentDidUpdate(prevProps){
		if(!this.intvOfRqstParseState){
			if(checkIfParsing(this.getDoc(), this.props.fData)) this.rqstParseState();
		}
	}
	componentWillUnmount(){
		clearInterval(this.intvOfRqstParseState);
	}
	handleClick(which){
		const document = this.getDoc();
		const docId = this.props.params.id;
		switch(which){
			case 'bookmark':
				if(document.bookmark >= 0) this.props.bookmark({docId, bmId: document.bookmark}); break;
			case 'delete':
			case 'delete-no':
				this.props.toggleDelDocButton(); break;
			case 'delete-yes':
				this.props.delelteDoc({docId, afterDelete: this.props.router.goBack}); break;
			default:
		}
	}
	rqstParseState(){
		this.intvOfRqstParseState = setInterval(() => {
			this.props.fetchParseState({
				docId: this.props.params.id,
				afterReceive: (state) => {
					let {isInProgress, filesWithNewStatus} = doAfterReceiveParseState(state, this.props.parseState, this.props.doc, this.props.fData);
					this.props.setParseState(state);
					if(!isInProgress){
						clearInterval(this.intvOfRqstParseState);
						this.intvOfRqstParseState = undefined;
					}
					if(filesWithNewStatus) this.props.renewFileStatus({docId: this.props.params.id, filesWithNewStatus});
				}
			});
		}, 3000);
	}
	propsForResponsivity(){ //prsRsp
		const wWidth = this.props.window.width;
		return {
			style: {
				h1: {
					fontSize: _interpolate(wWidth, 1.3, 2.5, SCREEN.smallest, SCREEN.medium, 'em')
				}
			}
		}
	}
	getDoc(){
		return (this.props.openDocs[this.props.params.id] ?
			this.props.openDocs[this.props.params.id] : this.props.fData.empty
		);
	}
	render(){
		const document = this.getDoc();
		const fProps = this.props.fData.fProps;
		const prsRsp = this.propsForResponsivity();
		const coverImage = (
			<ViewElem key="cover-image" className="document__image" value={[document.image]} type={fProps.image.type} />
		);
		const title = (
			<div key="title" className={(!_isEmpty(document.image) ? 'document__column' : null)}>
				<h1 style={prsRsp.style.h1}>{document.title}</h1>
			</div>
		);
		const inContent = _mapOO(document,
			(fs, value) => value, (fs, value) => !_isCommon([fs], ['title', 'date', 'image', 'file']) && fs
		);
		const dateOfCreation = (
			<div className="document__date">
				<span>{fProps.date.dispName}</span>
				<ViewElem value={[document.date]} type={fProps.date.type} />
			</div>
		);
		const listOfFiles = (
			<div className="document__files">
				<div>
					<i className="pe-7s-download pe-va"></i>
					<span>{fProps.file.dispName}</span>
				</div>
				<ViewElem value={document.file} type={fProps.file.type} owner={document.owner} role={this.props.role}
					fileTextUri={'/document/'+document.id+'/text/'} parseState={this.props.parseState}
				/>
			</div>
		);
		const bookmarkButton = (document.bookmark === 0 ?
			<div className="document__bookmark">
				<button type="button" onClick={this.handleClick.bind(this, 'bookmark')}>
					<i className="pe-7s-bookmarks pe-va"></i>
					{this.props.window.width > SCREEN.medium && <span>북마크 등록</span>}
				</button>
			</div> :
			<div className="document__bookmark document__remove-bookmark">
				<button type="button" onClick={this.handleClick.bind(this, 'bookmark')}>
					<i className="pe-7f-bookmarks pe-va"></i>
					{this.props.window.width > SCREEN.medium &&  <span>북마크 해제</span>}
				</button>
			</div>
		);
		const editButton = (
			<LinkIf to={'/document/'+document.id+'/edit'} if={document.owner}>
				<i className="pe-7s-note pe-va"></i>
				{this.props.window.width > SCREEN.medium && <span>수정하기</span>}
			</LinkIf>
		);
		const DelDocButton = ( document.owner && ( !this.props.dispBtnOfYesOrNo ?
			<div className="document__delete">
				<button type="button" onClick={this.handleClick.bind(this, 'delete')}>
					<i className="pe-7s-close-circle pe-va"></i>
					{this.props.window.width > SCREEN.medium && <span>삭제하기</span>}
				</button>
			</div> :
			<div className="document__delete document__delete--yes-or-no">
				<button type="button" onClick={this.handleClick.bind(this, 'delete-yes')}>예</button>
				<button type="button" onClick={this.handleClick.bind(this, 'delete-no')}>아니오</button>
			</div>
		));
		return (
			<div className="document">
				<div className="document__back" onClick={this.props.router.goBack}>
					<i className="pe-7f-back pe-va"></i> <span>이전 페이지로</span>
				</div>
				<div className="document__wrap">
					<div className="document__header">
						{this.props.window.width > SCREEN.sMedium ? [coverImage, title] : [title, coverImage]}
						<div className="document__buttons">
							{bookmarkButton}
							{editButton}
							{DelDocButton}
						</div>
						<div>
							{dateOfCreation}
							{listOfFiles}
						</div>
					</div>
					<View doc={inContent} fieldData={this.props.fData} />
				</div>
			</div>
		);
	}
}
Document.propTypes = {
	role: PropTypes.arrayOf(PropTypes.string).isRequired,
	fData: PropTypes.object.isRequired,
	openDocs: PropTypes.object.isRequired,
	parseState: PropTypes.object.isRequired,
	dispBtnOfYesOrNo: PropTypes.bool,
	window: PropTypes.object.isRequired,
	fetchParseState: PropTypes.func.isRequired,
	setParseState: PropTypes.func.isRequired,
	renewFileStatus: PropTypes.func.isRequired,
	bookmark: PropTypes.func.isRequired,
	router: PropTypes.shape({
		push: PropTypes.func.isRequired,
		goBack: PropTypes.func.isRequired
	}).isRequired
};
export default withRouter(Document);
