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
const subjectField = {fid: 0, parent: 0, subject: '제목', type: 'char', multiple: 0, required: 1, cid: 0, form: 'text'};
const documentFormOptions = {
	search_in_docform: [
		{
			field: 13,
			api: "member?name=",
			resultmap: {
				fname: ['name', 'class', 'email', 'phone'],
				fid: [13, 14, 15, 16]
			}
		}
	],
	action_show: [
		{
			term: 1,
			field: 2
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
			} else {
				this.setState({[prop]: data});
			}
		});
	}
	correctDocumentFormData(formData){
		formData.fields.forEach((field, i) => {
			if(field.multiple == '1'){
				if(field.parent != '0' || field.form == 'search' || field.form == 'fieldset'){
					formData.fields[i].multiple = '0';
				}
			}
		});
		this.setState({documentFormData: formData});
	}
	initializeDocumentForm(formData){
		let custom = {};
		formData.fields.forEach((field) => {
			let value;
			switch(field.type){
				case 'taxonomy':
					let minIdx = -1;
					let firstTermId, firstTerm;
					formData.taxonomy[field.cid].forEach((term) => {
						if(minIdx < 0){
							minIdx = term.idx; firstTermId = term.tid; firstTerm = term.name;
						} else if(minIdx > 0 && term.idx < minIdx){
							minIdx = term.idx; firstTermId = term.tid; firstTerm = term.name;
						}
					});
					value = firstTerm; break;
				case 'image': case 'file':
					value = {filename: ''}
					break;
				default:
					value = '';
			}
			if(field.multiple == '1') value = [value];
			if(field.type != 'group') custom['f'+field.fid] = value;
		});
		this.setState({documentForm: update(emptyDocument, {
			custom: {$set: custom}
		})});
	}
	componentDidMount(){
		this.fetchData('/', 'userData');
		this.fetchData('/fields', 'documentFormData');
		this.setState({
			documentFormOptions: documentFormOptions
		})
	}
	render(){
		let	digitalLibrary = this.props.children && React.cloneElement(this.props.children, {
			apiUrl: apiUrl,
			userData: this.state.userData,
			documentFormData: this.state.documentFormData,
			documentForm: this.state.documentForm,
			documentFormOptions: this.state.documentFormOptions,
			subjectField: subjectField,
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
