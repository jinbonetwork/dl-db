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
			userData: {user: null, role: null, type: null},
			docData: {
				taxonomy: _defaultTaxonomy,
				terms: _defaultTerms,
				customFields: null,
				customFieldAttrs: null
			},
			openedDocuments: null
		};
	}
	fetchData(uri, callBack){
		axios.get(uri).then((response) => {
			if(response.statusText == 'OK'){
				if(response.data.error == 0){
					callBack(response.data);
				} else {
					//console.error(response.data);
					//this.setServerError();
				}
			} else {
				//console.error('Server response was not OK');
				//this.setServerError();
			}
		});
	}
	componentDidMount(){
		this.fetchData('/api/', (data) => {
			this.setState({userData: {
				user: data.user,
				role: data.role,
				type: data.sessiontype
			}});
			if(data.user.uid == 0){
				this.fetchData('/api/fields', (data) => {
					this.setState({docData: {
						taxonomy: _taxonomy(data.taxonomy, data.fields),
						terms: _terms(data.taxonomy),
						customFields: _customFields(data.fields),
						customFieldAttrs: _customFieldAttrs(data.fields)
					}});
				});
			}
		});
	}
	render(){
		let digitalLibrary = this.props.children && React.cloneElement(this.props.children, {
			userData: this.state.userData,
			docData: this.state.docData,
			openedDocuments: this.state.openedDocuments
		});
		return digitalLibrary;
	}
}

export default DigitalLibraryContainer;
