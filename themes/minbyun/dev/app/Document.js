import React, {Component, PropTypes} from 'react';
import {Link, withRouter} from 'react-router';
import axios from 'axios';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find(), findIndex() ...
import FieldsInHeader from './document/FieldsInHeader';
import FieldsInContents from './document/FieldsInContents';
import EditDocument from './EditDocument';
import LinkByRole from './LinkByRole';
import Table from './table/Table';
import Row from './table/Row';
import Column from './table/Column';
import func from './functions';

const _relation = { //어떤 type의 필드에 대한 term의 작용
	'32': { // 열람
		type: 'file',
		prop: 'link',
		value: false
	},
	'33': { // 다운로드
		type: 'file',
		prop: 'link',
		value: true
	}
}
const _show = { // term -> field
	'1': '2' // 판결문 -> 재판정보
}
const _removedFields = ['f11'];

class Document extends Component {
	constructor(){
		super();
		this.state = null;
	}
	componentDidMount(){
		axios.get(this.props.apiUrl+'/document?id='+this.props.params.did)
		.then((response) => {
			if(response.statusText == 'OK'){
				if(response.data.error == 0){
					return response.data.document;
				} else {
					console.error(response.data.message);
				}
			} else {
				console.error('Server response was not OK');
			}
		})
		.then((document) => {
			this.applyRelation(document);
			this.setDocument(document);
		});
	}
	applyRelation(document){
		let terms = {};
		this.props.documentFormData.fields.forEach((f) => {
			if(f.type == 'taxonomy'){
				let fid = (f.fid > 0 ? 'f'+f.fid : f.fid);
				for(let k in document[fid]){
					terms[k] = document[fid][k];
				}
			}
		});
		if(func.isEmpty(terms)) return;
		for(let tid in _relation){
			if(terms[tid]){
				this.props.documentFormData.fields.forEach((f) => {
					if(_relation[tid].type == f.type){
						let fid = (f.fid > 0 ? 'f'+f.fid : f.fid);
						for(let p in document[fid]){
							document[fid][p][_relation[tid].prop] = _relation[tid].value;
						}
					}
				});
			}
		}
		for(let tid in _show){
			if(!terms[tid]){
				let field = _show[tid];
				this.props.documentFormData.fields.forEach((f) => {
					if(f.fid == field || f.parent == field) delete document['f'+f.fid];
				});
			}
		}
		for(let i in _removedFields){
			delete document[_removedFields[i]];
		}
	}
	setDocument(document){
		let newDocument = {};
		['id', 'uid', 'owner', 'created'].forEach((prop) => {
			if(document[prop] !== undefined) newDocument[prop] = document[prop];
		});
		this.props.documentFormData.fields.forEach((f) => {
			let fid = (f.fid > 0 ? 'f'+f.fid : f.fid);
			let doc = document[fid];
			newDocument[fid] = [];
			switch(f.type){
				case 'char': case 'date': case 'textarea':
					if(!func.isEmpty(doc)){
						if(f.multiple != '1'){
							newDocument[fid] = [doc];
						} else {
							newDocument[fid] = doc;
						}
					}
					break;
				case 'taxonomy':
					for(let p in doc){
						let name = doc[p].name;
						if(!func.isEmpty(name)) newDocument[fid].push(name);
					}
					break;
				case 'image': case 'file':
					for(let p in doc){
						let fileinfo = doc[p];
						if(!func.isEmpty(fileinfo)) newDocument[fid].push(fileinfo);
					}
					break;
			}
		});
		this.setState(newDocument);
	}
	render(){
		if(this.state == null) return null;
		let userRole = (this.props.userData ? this.props.userData.role : null);

		let fieldsInHeader = {image: null, file: null, date: null};
		let fieldsInContents = [];
		this.props.documentFormData.fields.forEach((field) => {
			let fid = (field.fid > 0 ? 'f'+field.fid : field.fid);
			if((field.type == 'group' || this.state[fid].length > 0) && field.parent == '0' && field.fid != 'subject'){
				if(field.type == 'image' || field.type == 'file' || field.type == 'date'){
					fieldsInHeader[field.type] = (
						<FieldsInHeader type={field.type} value={this.state[fid]} subject={field.subject} userRole={this.props.userData.role} isOwner={this.state.owner == '1'} />
					);
				}
				else {
					fieldsInContents[field.idx] = (
						<FieldsInContents key={field.fid} field={field} formData={this.props.documentFormData} document={this.state} />
					);
				}
			}
		});
		return (
			<div className="document">
				<div className="document--back" onClick={this.props.router.goBack.bind(this)}>
					<i className="pe-7f-back pe-va"></i> <span>이전 페이지로</span>
				</div>
				<div className="document__wrap">
					<div className="document__header">
						{fieldsInHeader.image}
						<div className={(fieldsInHeader.image ? 'document__column' : '')}>
							<h1>{this.state.subject}</h1>
							<div className="document__buttons">
								<button type="button"><i className="pe-7f-bookmarks pe-va"></i>{' '}북마크</button>
								<LinkByRole to={'/document/'+this.state.id+'/edit'} role={[1, 3]} userRole={userRole}>수정하기</LinkByRole>
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
			</div>
		);
	}
}
Document.propTypes = {
	userData: PropTypes.object,
	documentFormData: PropTypes.object,
	documentFormOptions: PropTypes.object,
	apiUrl: PropTypes.string,
	openedDocuments: PropTypes.object,
	router: PropTypes.shape({
		goBack: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(Document);
