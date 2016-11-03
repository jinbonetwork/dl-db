import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import axios from 'axios';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find() ...

import './style/common.less';

const apiUrl = '/api';
const emptyDocument = {
	id: 0,
	subject	: '',
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
}

class DigitalLibraryContainer extends Component {
	constructor(){
		super();
		this.state = {
			userData: undefined,
			documentFormData: undefined,
			documentForm: undefined
		};
	}
	fetchData(path, prop){
		axios.get(apiUrl+path)
		.then((response) => {
			if(response.statusText == 'OK'){
				return response.data;
			} else {
				throw new Error('Server response was not OK');
			}
		})
		.then((data) => {
			this.setState({ [prop]: data });
			if(prop == 'documentFormData') this.initializeDocumentForm(data);
		})
		.catch((error) => {
			console.error(error);
			this.props.router.push('/error');
		});
	}
	initializeDocumentForm(formData){
		let custom = {};
		formData.fields.forEach((field) => {
			if(field.type == 'taxonomy'){
				let minIdx = -1;
				let firstTermId;
				formData.taxonomy[field.cid].forEach((term) => {
					if(minIdx < 0){
						minIdx = term.idx; firstTermId = term.tid;
					} else if(minIdx > 0 && term.idx < minIdx){
						minIdx = term.idx; firstTermId = term.tid;
					}
				});
				custom[field.fid] = firstTermId;
			}
		});
		this.setState({documentForm: update(emptyDocument, {
			custom: {$set: custom} 
		})});

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
			documentForm: this.state.documentForm
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
