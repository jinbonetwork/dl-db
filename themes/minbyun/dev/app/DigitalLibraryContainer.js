import React, {Component, PropTypes} from 'react';
import axios from 'axios';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find(), findIndex() ...
import Message from './overlay/Message';
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
			openedDocuments: null,
			child: null,
			axiosInst: axios.create({timeout: 60000})
		};
	}
	fetchData(uri, callBack){
		axios.get(uri).then((response) => {
			if(response.statusText == 'OK'){
				callBack(response.data);
			} else {
				console.error('Server response was not OK');
				this.setServerError();
			}
		});
	}
	fetchContainerData(callBack){
		this.fetchData('/api/', (data) => {
			this.setState({userData: {
				user: data.user,
				role: data.role,
				type: data.sessiontype
			}});
			if(callBack) callBack(data);
			if(data.role){
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
	removeUserData(){
		this.setState({userData: update(this.state.userData, {
			user: {$set: null}, role: {$set: null}
		})});
	}
	componentDidMount(){
		this.fetchContainerData();
	}
	setServerError(){
		this.setState({ child: (
			<Message handleClick={this.unsetChild.bind(this)}>요청한 작업을 처리하는 과정에서 문제가 발생했습니다.</Message>
		)});
	}
	unsetChild(){
		this.setState({child: null});
	}
	render(){
		let digitalLibrary = this.props.children && React.cloneElement(this.props.children, {
			userData: this.state.userData,
			docData: this.state.docData,
			openedDocuments: this.state.openedDocuments,
			fetchContainerData: this.fetchContainerData.bind(this),
			removeUserData: this.removeUserData.bind(this)
		});
		return this.state.child || digitalLibrary;
	}
}

export default DigitalLibraryContainer;
