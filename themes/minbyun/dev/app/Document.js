import React, {Component, PropTypes} from 'react';
import axios from 'axios';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find(), findIndex() ...
import FieldsInHeader from './document/FieldsInHeader';
import FieldsInContents from './document/FieldsInContents';
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
		if(!func.isEmpty(terms)){
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
		}
	}
	setDocument(document){
		let newDocument = {};
		this.props.documentFormData.fields.forEach((f) => {
			let fid = (f.fid > 0 ? 'f'+f.fid : f.fid);
			let doc = document[fid];
			switch(f.type){
				case 'char': case 'date': case 'textarea':
					if(f.multiple != '1'){
						newDocument[fid] = [doc];
					} else {
						newDocument[fid] = doc;
					}
					break;
				case 'taxonomy':
					newDocument[fid] = [];
					for(let p in doc){
						newDocument[fid].push(doc[p].name);
					}
					break;
				case 'image': case 'file':
					newDocument[fid] = [];
					for(let p in doc){
						newDocument[fid].push(doc[p]);
					}
					break;
			}
		});
		this.setState(newDocument);
	}
	render(){
		if(this.state == null) return null;

		let hiddenFields = [];
		for(let fid in this.props.documentFormOptions.actionShowInfo){
			let info = this.props.documentFormOptions.actionShowInfo[fid];
			let value =this.state['f'+fid];
			if(value != info.term) hiddenFields.push(info.field);
		}

		let fieldsInHeader = {image: null, file: null, date: null};
		let fieldsInContents = [];
		this.props.documentFormData.fields.forEach((field) => {
			let fid = (field.fid > 0 ? 'f'+field.fid : field.fid);
			if(field.type == 'image' || field.type == 'file' || field.type == 'date'){
				fieldsInHeader[field.type] = <FieldsInHeader type={field.type} value={this.state[fid]} subject={field.subject} />
			}
			else if(field.fid != 'subject' && field.parent == '0'){
				fieldsInContents[field.idx] = (
					<FieldsInContents key={field.fid} field={field} formData={this.props.documentFormData} document={this.state} />
				);
			}
		});
		return (
			<div className="document">
				<div>이전 페이지로</div>
				<div className="document__wrap">
					<div className="document__header">
						{fieldsInHeader.image}
						<div className={(fieldsInHeader.image ? 'document__column' : '')}>
							<h1>{this.state.subject}</h1>
							<div className="document__buttons">
								<button type="button"><i className="pe-7f-bookmarks pe-va"></i>{' '}북마크</button>
								<button type="button">수정하기</button>
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
	openedDocuments: PropTypes.object
};

export default Document;
