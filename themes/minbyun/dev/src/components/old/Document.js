import React, {Component, PropTypes, cloneElement} from 'react';
import {Link, withRouter} from 'react-router';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find(), findIndex() ...
import FieldInHeader from './document/FieldInHeader';
import FieldInContents from './document/FieldInContents';
import LinkIf from './accessories/LinkIf';
import Message from  './accessories/Message';
import {Table, Row, Column} from './accessories/Table';
import {_convertToDoc, _isHiddenField} from './schema/docSchema';
import {_screen} from './schema/screenSchema';
import {_isEmpty, _isCommon, _interpolate} from './accessories/functions';

class Document extends Component {
	constructor(){
		super();
		this.state = {
			sDocument: {},
			document: {},
			dispBtnOfYesOrNo: false
		};
	}
	componentDidMount(){
		const fAttrs = this.props.docData.fAttrs;
		const docApi = '/api/document?id='+this.props.params.did;
		const unsetProc = this.props.setMessage(null);
		this.props.fetchData('get', docApi, (data) => { unsetProc(); if(data){
			const document = _convertToDoc(data.document, this.props.docData);
			this.setState({
				sDocument: data.document,
				document: document
			});
		}});
	}
	componentDidUpdate(prevProps, prevState){
		if(JSON.stringify(prevProps.docData) != JSON.stringify(this.props.docData)){
			const document = _convertToDoc(this.state.sDocument, this.props.docData);
			this.setState({document: document});
		}
	}
	handleClick(which){
		const document = this.state.document;
		switch(which){
			case 'bookmark':
				this.setState({document: update(document, {bookmark: {$set: -1}})});
				this.props.fetchData('post', '/api/user/bookmark?mode=add&did='+document.id, null, (data) => {
					if(data){
						this.setState({document: update(document, {bookmark: {$set: data.bid}})});
					} else {
						this.setState({bookmark: 0});
						this.setState({document: update(document, {bookmark: {$set: 0}})});
					}
				});
				break;
			case 'removeBookmark':
				const prevBookmark = document.bookmark;
				this.setState({document: update(document, {bookmark: {$set: 0}})});
				this.props.fetchData('post', '/api/user/bookmark?mode=delete&bid='+document.bookmark, null, (data) => {
					if(!data) this.setState({document: update(document, {bookmark: {$set: prevBookmark}})});
				});
				break;
			case 'delete':
				this.setState({dispBtnOfYesOrNo: true});
				break;
			case 'delete-yes':
				this.props.fetchData('post', '/api/document/save?mode=delete&id='+document.id, null, (data) => { if(data){
					this.props.router.goBack();
				}});
				break;
			case 'delete-no':
				this.setState({dispBtnOfYesOrNo: false});
				break;
			default:
		}
	}
	bookmark(){
		if(!this.state.document.bookmark){ return (
			<div className="document__bookmark">
				<i className="pe-7s-bookmarks pe-va"></i>
				<button type="button" onClick={this.handleClick.bind(this, 'bookmark')}>
					<span>북마크</span>
				</button>
			</div>
		);} else { return (
			<div className="document__bookmark document__remove-bookmark">
				<i className="pe-7f-bookmarks pe-va"></i>
				<button type="button" onClick={this.handleClick.bind(this, 'removeBookmark')}>
					<span>북마크 해제</span>
				</button>
			</div>
		);}
	}
	deleteDocument(){
		if(_isCommon(['admin'], this.props.userData.role) || this.state.document.owner){
			if(!this.state.dispBtnOfYesOrNo){
				const className = "document__delete";
				return (
					<div className={className}>
						<button type="button" onClick={this.handleClick.bind(this, 'delete')}>삭제하기</button>
					</div>
				);
			} else {
				const className = "document__delete document__delete--yes-or-no";
				return (
					<div className={className}>
						<button type="button" onClick={this.handleClick.bind(this, 'delete-yes')}>예</button>
						<button type="button" onClick={this.handleClick.bind(this, 'delete-no')}>아니오</button>
					</div>
				);
			}
		}
	}
	propsForResponsivity(){ //prsRsp
		const wWidth = this.props.window.width;
		return {
			style: {
				h1: {
					fontSize: _interpolate(wWidth, 1.3, 2.5, _screen.smallest, _screen.medium, 'em')
				}
			}
		}
	}
	render(){
		const document = this.state.document;
		const fileText = this.state.fileText;
		const userRole = this.props.userData.role;

		const fieldsInHeader = {image: null, file: null, date: null};
		const fieldsInContents = [];

		const prsRsp = this.propsForResponsivity();

		for(let fn in document){
			let fAttr = this.props.docData.fAttrs[fn];
			if(!fAttr.parent && fn != 'title'){
				if(fn == 'image' || fn == 'file' || fn == 'date'){
					fieldsInHeader[fn] = !_isEmpty(document[fn]) && (
						<FieldInHeader fname={fn} document={document} userRole={userRole} docData={this.props.docData} />
					);
				}
				else if(!_isHiddenField(fn, 'view', document, this.props.docData)){
					fieldsInContents.push(<FieldInContents key={fn} fname={fn} docData={this.props.docData} document={document} />);
				}
			}
		};
		const children = this.props.children && cloneElement(this.props.children, {
			docId: this.props.params.did,
			file: document.file,
			fetchData: this.props.fetchData,
			authorized: (userRole.indexOf('admin') >= 0 || document.owner)
		});

		return (
			<div className="document">
				<div className="document__back" onClick={this.props.router.goBack}>
					<i className="pe-7f-back pe-va"></i> <span>이전 페이지로</span>
				</div>
				<div className="document__wrap">
					<div className="document__header">
						{fieldsInHeader.image}
						<div className={(fieldsInHeader.image ? 'document__column' : '')}>
							<h1 style={prsRsp.style.h1}>{document.title}</h1>
						</div>
						<div className="document__buttons">
							{this.bookmark()}
							<LinkIf to={'/document/'+document.id+'/edit'} if={_isCommon(['admin'], userRole) || document.owner}>
								<span>수정하기</span>
							</LinkIf>
							{this.deleteDocument()}
						</div>
						<Table>
							{fieldsInHeader.date}
							{fieldsInHeader.file}
						</Table>
					</div>
					<Table className="document__contents">
						{fieldsInContents}
					</Table>
				</div>
				{children}
			</div>
		);
	}
}
Document.propTypes = {
	userData: PropTypes.object,
	docData: PropTypes.object,
	window: PropTypes.object,
	fetchData: PropTypes.func,
	setMessage: PropTypes.func,
	openedDocuments: PropTypes.object,
	router: PropTypes.shape({
		goBack: PropTypes.func.isRequired,
		push: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(Document);
