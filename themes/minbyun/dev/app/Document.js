import React, {Component, PropTypes} from 'react';
import {Link, withRouter} from 'react-router';
import axios from 'axios';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find(), findIndex() ...
import FieldsInHeader from './document/FieldsInHeader';
import FieldsInContents from './document/FieldsInContents';
import FileTextEditor from './document/FileTextEditor';
import LinkByRole from './LinkByRole';
import ErrorMessage from  './ErrorMessage';
import {Table, Row, Column} from './Table';
import {_fieldAttrs, _convertToDoc} from './docSchema';
import {_isEmpty} from './functions';

class Document extends Component {
	constructor(){
		super();
		this.state = {
			document: null,
			fileText: {},
			fileTextEditor: null,
			errorMessage: null
		};
	}
	fetchData(uri, callBack){
		axios.get(uri).then((response) => {
			if(response.statusText == 'OK'){
				if(response.data.error == 0){
					callBack(response.data);
				} else {
					console.error(response.data.message);
				}
			} else {
				console.error('Server response was not OK');
			}
		});
	}
	componentDidMount(){
		this.fetchData('/api/document?id='+this.props.params.did, (data) => {
			let document = _convertToDoc(data.document);
			this.setState({
				document: document
			});
			document.file.forEach((f) => {
				this.fetchData('/api/document/text?id='+this.props.params.did+'&fid='+f.fid, (data) => {
					this.setState({
						fileText: update(this.state.fileText, {$merge: {[f.fid]: data.text}})
					});
				});
			})
		});
	}
	isHiddenField(fname){
		if(fname == 'trial'){
			if(this.state.document.doctype == 1) return false;
			else return true;
		}
		else if(fname == 'access') return true;
		return false;
	}
	setFileTextEditor(fileId){
		this.setState({
			fileTextEditor: (
				<FileTextEditor fid={fileId} text={this.state.fileText[fileId]}
					submit={this.submitFileText.bind(this)}
					cancel={this.unsetFileTextEditor.bind(this)}
				/>
			)
		});
	}
	unsetFileTextEditor(){
		this.setState({fileTextEditor: null});
	}
	submitFileText(fileId, text){
		let prevFiletext = this.state.fileText;

		this.setState({
			fileText: update(this.state.fileText, {[fileId]: {$set: text}}),
			fileTextEditor: null
		});

		let formData = new FormData();
		formData.append('text', text);
		axios.post('/api/document/text?mode=modify&id='+this.props.params.did+'&fid='+fileId, formData)
		.then((response) => {
			if(response.statusText == 'OK'){
				if(response.data.error != 0){
					this.setState({fileText: prevFiletext});
					console.error(response.data);
					this.setServerError();
				}
			} else {
				console.error('Server response was not OK');
				this.setServerError();
			}
		});
	}
	setServerError(){
		this.setState({
			errorMessage: (
				<ErrorMessage
					message='요청한 작업을 처리하는 과정에서 문제가 발생했습니다.'
					handleClick={this.unsetServerError.bind(this)}
				/>
			)
		});
	}
	unsetServerError(){
		this.setState({errorMessage: null});
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
						<FieldsInHeader fname={fn} document={this.state.document} userRole={userRole}
							callBacks={{setFileTextEditor: this.setFileTextEditor.bind(this)}}
						/>
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
								<button type="button"><i className="pe-7f-bookmarks pe-va"></i>{' '}북마크</button>
								<LinkByRole to={'/document/'+this.state.document.id+'/edit'} role={[1, 3]} userRole={userRole}>수정하기</LinkByRole>
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
				{this.state.fileTextEditor}
				{this.state.errorMessage}
			</div>
		);
	}
}
Document.propTypes = {
	userData: PropTypes.object,
	docData: PropTypes.object,
	openedDocuments: PropTypes.object,
	router: PropTypes.shape({
		goBack: PropTypes.func.isRequired,
		push: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(Document);
