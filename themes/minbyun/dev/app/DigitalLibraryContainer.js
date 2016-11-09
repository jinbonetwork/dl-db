import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import axios from 'axios';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find(), findIndex() ...

import './style/common.less';

const apiUrl = '/api';
const emptyDocument = {
	id: 0,
	subject: '',
	content: '',
	memo: '',
	custom: {},
	uid: 0,
	created: 0,
	f3: '',
	f4: '',
	f5: '',
	f6: '',
	f7: '',
	f9: {}
};
const defaultFields = [
	{fid: 'subject', parent: '0', idx: '0', subject: '제목', type: 'char', multiple: '0', required: '1', cid: '0', form: 'text'},
	{fid: 'content', parent: '0', idx: '4', subject: '주요내용', type: 'textarea', multiple: '0', required: '1', cid: '0', form: '200'}
];
const documentFormOptions = {
	search_in_docform: [
		{
			field: '13',
			api: "member?name=",
			resultmap: {
				fname: ['name', 'class', 'email', 'phone'],
				fid: ['13', '14', '15', '16']
			}
		}
	],
	action_show: [
		{
			term: '1',
			field: '2'
		}
	]
};

class DigitalLibraryContainer extends Component {
	constructor(){
		super();
		this.state = {
			userData: undefined,
			documentFormData: undefined,
			documentForm: undefined,
			documentFormOptions: undefined,
			openedDocuments: []
		};
	}
	fetchData(path, prop){
		axios.get(apiUrl+path)
		.then((response) => {
			if(response.statusText == 'OK'){
				return response.data;
			} else {
				this.props.router.push('/error');
				throw new Error('Server response was not OK');
			}
		})
		.then((data) => {
			if(prop == 'documentFormData'){
				this.correctDocumentFormData(data);
				this.initializeDocumentForm(data);
				this.setFormOptions(data);
			} else {
				this.setState({[prop]: data});
			}
		});
	}
	correctDocumentFormData(formData){
		formData.fields = formData.fields.concat(defaultFields);
		formData.fields.forEach((field, i) => {
			if(field.multiple == '1'){
				if(field.parent != '0' || field.form == 'search' || field.form == 'fieldset'){
					formData.fields[i].multiple = '0';
				}
			}
		});
		this.setState({documentFormData: formData});
	}
	defaultValue(field, formData){
		switch(field.type){
			case 'taxonomy':
				let minIdx = -1;
				let firstTermId;
				formData.taxonomy[field.cid].forEach((term) => {
					if(minIdx < 0){
						minIdx = term.idx; firstTermId = term.tid;
					} else if(minIdx > 0 && term.idx < minIdx){
						minIdx = term.idx; firstTermId = term.tid;
					}
				});
				return firstTermId;
			case 'date':
				return {year: '', month: ''};
			case 'image': case 'file':
				return {filename: ''};
			default:
				return '';
		}
	}
	initializeDocumentForm(formData){
		let custom = {};
		formData.fields.forEach((field) => {
			let value = this.defaultValue(field, formData);
			if(field.multiple == '1') value = [value];
			if(field.type != 'group' && field.fid > 0) custom['f'+field.fid] = value;
		});
		this.setState({documentForm: update(emptyDocument, {
			custom: {$set: custom}
		})});
	}
	setFormOptions(formData){
		let searchInfo, actionShowInfo, defaultValues = {};
		if(documentFormOptions && documentFormOptions.search_in_docform){
			searchInfo = {};
			documentFormOptions.search_in_docform.forEach((item) => {
				searchInfo[item.field] = {api: item.api, resultMap: item.resultmap};
			});
		}
		if(documentFormOptions && documentFormOptions.action_show){
			actionShowInfo = {};
			documentFormOptions.action_show.forEach((item) => {
				let term;
				for(let cid in formData.taxonomy){
					term = formData.taxonomy[cid].find((t) => t.tid == item.term);
					if(term) break;
				}
				if(term){
					let field = formData.fields.find((f) => f.cid == term.cid);
					actionShowInfo[field.fid] = {term: item.term, field: item.field}
				}
			});
		}
		formData.fields.forEach((field) => {
			if(field.type != 'group' && field.fid > 0){
				defaultValues[field.fid] = this.defaultValue(field, formData);
			}
		});
		this.setState({
			documentFormOptions: {
				searchInfo: searchInfo,
				actionShowInfo: actionShowInfo,
				defaultValues: defaultValues
			}
		});
	}
	componentDidMount(){
		this.fetchData('/', 'userData');
		this.fetchData('/fields', 'documentFormData');
	}
	render(){
		let	digitalLibrary = this.props.children && React.cloneElement(this.props.children, {
			apiUrl: apiUrl,
			userData: this.state.userData,
			documentFormData: this.state.documentFormData,
			documentForm: this.state.documentForm,
			documentFormOptions: this.state.documentFormOptions,
			openedDocuments: this.state.openedDocuments
		});
		return digitalLibrary;
	}
}
DigitalLibraryContainer.propTypes = {
	router: PropTypes.shape({
		push: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(DigitalLibraryContainer);
