import React, {Component, PropTypes} from 'react';
import axios from 'axios';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find(), findIndex() ...
import  {_defaultTaxonomy, _defaultTerms, _taxonomy, _terms, _customFields, _customFieldAttrs} from './docSchema';

import {_isEmpty} from './functions';

class DigitalLibraryContainer extends Component {
	constructor(){
		super();
		this.state = {
			userData: {user: null, role: null},
			docData: {
				taxonomy: _defaultTaxonomy,
				terms: _defaultTerms,
				customFields: null,
				customFieldAttrs: null
			},
			openedDocuments: null
		};
	}
	fetchData(path, prop){
		axios.get('/api'+path)
		.then((response) => {
			if(response.statusText == 'OK'){
				this.setData(prop, response.data);
			} else {
				console.log('Server response was not OK');
			}
		})
	}
	setData(prop, data){
		if(prop == 'userData'){
			this.setState({[prop]: data});
		} else if(prop == 'docData'){
			this.setState({[prop]: {
				taxonomy: _taxonomy(data.taxonomy, data.fields),
				terms: _terms(data.taxonomy),
				customFields: _customFields(data.fields),
				customFieldAttrs: _customFieldAttrs(data.fields)
			}});
		}
	}
	componentDidMount(){
		this.fetchData('/', 'userData');
		this.fetchData('/fields', 'docData');
	}
	render(){
		let	digitalLibrary = this.props.children && React.cloneElement(this.props.children, {
			userData: this.state.userData,
			docData: this.state.docData,
			openedDocuments: this.state.openedDocuments
		});
		return digitalLibrary;
	}
}

export default DigitalLibraryContainer;
