import React, {Component, PropTypes, cloneElement} from 'react';
import {Link, withRouter} from 'react-router';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find(), findIndex() ...
import FieldsInHeader from './document/FieldsInHeader';
import FieldsInContents from './document/FieldsInContents';
import LinkIf from './accessories/LinkIf';
import Message from  './accessories/Message';
import {Table, Row, Column} from './accessories/Table';
import {_fieldAttrs, _convertToDoc} from './schema/docSchema';
import {_isEmpty, _isCommon} from './accessories/functions';

class Document extends Component {
	constructor(){
		super();
		this.state = {
			document: null,
			fileText: {}
		};
	}
	componentDidMount(){
		this.props.fetchData('get', '/api/document?id='+this.props.params.did, (data) => { if(data){
			let document = _convertToDoc(data.document);
			this.setState({
				document: document
			});
			document.file.forEach((f) => {if(f.fid){
				this.props.fetchData('get', '/api/document/text?id='+this.props.params.did+'&fid='+f.fid, (data) => { if(data){
					this.setState({
						fileText: update(this.state.fileText, {$merge: {[f.fid]: {
							text: data.text, header: data.header
						}}})
					});
				}});
			}});
		}});
	}
	isHiddenField(fname){
		if(fname == 'trial'){
			if(this.state.document.doctype == 1) return false;
			else return true;
		}
		else if(fname == 'access') return true;
		return false;
	}
	handleClick(which){
		if(which == 'bookmark'){
			/*
			this.props.fetchData('post', '/api/user/bookmark?mode=add&did='+this.state.document.id, null, (data) => {
				if(data){

				}
			});
			*/
		}
	}
	submitFileText(fileId, text){
		let prevFiletext = this.state.fileText;
		this.setState({
			fileText: update(this.state.fileText, {[fileId]: {text: {$set: text}}})
		});

		let formData = new FormData();
		formData.append('text', text);

		this.props.fetchData('post', '/api/document/text?mode=modify&id='+this.props.params.did+'&fid='+fileId, formData, (data) => {
			if(!data){
				this.setState({fileText: prevFiletext});
			}
		});
	}
	render(){
		if(!this.state.document) return null;
		let userRole = this.props.userData.role;

		let fieldsInHeader = {image: null, file: null, date: null};
		let fieldsInContents = [];
		for(let fn in this.state.document){
			let fAttr = _fieldAttrs[fn];
			if(!fAttr.parent && fn != 'title'){
				if(fn == 'image' || fn == 'file' || fn == 'date'){
					fieldsInHeader[fn] = !_isEmpty(this.state.document[fn]) && (
						<FieldsInHeader fname={fn} document={this.state.document} userRole={userRole} />
					);
				}
				else if(!this.isHiddenField(fn)){
					fieldsInContents.push(<FieldsInContents key={fn} fname={fn} docData={this.props.docData} document={this.state.document} />);
				}
			}
		};
		return (
			<div className="document">
				<div className="document--back" onClick={this.props.router.goBack.bind(this)}>
					<i className="pe-7f-back pe-va"></i> <span>이전 페이지로</span>
				</div>
				<div className="document__wrap">
					<div className="document__header">
						{fieldsInHeader.image}
						<div className={(fieldsInHeader.image ? 'document__column' : '')}>
							<h1>{this.state.document.title}</h1>
							<div className="document__buttons">
								<button type="button" onClick={this.handleClick.bind(this, 'bookmark')}>
									<i className="pe-7f-bookmarks pe-va"></i>{' '}북마크
								</button>
								<LinkIf to={'/document/'+this.state.document.id+'/edit'} if={_isCommon(['admin'], userRole) || this.state.document.owner}>
									수정하기
								</LinkIf>
							</div>
							<Table>
								{fieldsInHeader.date}
								{fieldsInHeader.file}
							</Table>
						</div>
					</div>
					<Table className="document__contents">
						{fieldsInContents}
					</Table>
				</div>
				{this.props.children && cloneElement(this.props.children, {
					document: this.state.document,  fileText: this.state.fileText, submit: this.submitFileText.bind(this)
				})}
			</div>
		);
	}
}
Document.propTypes = {
	userData: PropTypes.object,
	docData: PropTypes.object,
	fetchData: PropTypes.func,
	setMessage: PropTypes.func,
	openedDocuments: PropTypes.object,
	router: PropTypes.shape({
		goBack: PropTypes.func.isRequired,
		push: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(Document);
