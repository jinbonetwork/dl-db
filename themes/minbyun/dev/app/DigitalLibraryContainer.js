import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import axios from 'axios';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find(), findIndex() ...
import Message from './accessories/Message';
import Overlay from './accessories/Overlay';
import  {_defaultTaxonomy, _defaultTerms, _taxonomy, _terms, _customFields, _customFieldAttrs} from './schema/docSchema';
import {_role} from './schema/userSchema';
import {_isEmpty} from './accessories/functions';

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
			searchQuery: {
				doctypes: [],
				keyword: '',
				from: '',
				to: ''
			},
			message: null,
			openedDocuments: null,
		};
	}
	componentDidMount(){
		this.fetchContData();
	}
	fetchData(method, url, arg2, arg3){
		let data = (method == 'get' ? null : arg2);
		let callBack = (method == 'get' ? arg2 : arg3);
		axios({method: method, url: url, data: data, timeout: 60000}).then((response) => {
			if(response.statusText == 'OK'){
				if(!response.data.error || response.data.error == 0){
					if(callBack) callBack(response.data);
				} else {
					let actOnClick = (response.data.error == -9999 ? 'goToLogin' : 'unset');
					if(callBack) callBack(null);
					console.error(response.data);
					this.setMessage(response.data.message, actOnClick);
				}
			} else {
				console.error('Server response was not OK');
				this.setMessage('서버와 통신하는데 문제가 발생했습니다.', 'goBack');
			}
		});
		/*
		.catch((error) => {
			console.error('Error', error.message);
			this.setMessage(error.message, 'goBack');
		});
		*/
	}
	fetchContData(callBack){
		this.fetchData('get', '/api', (data) => {
			this.setState({userData: {
				user: data.user,
				role: _role(data.role),
				type: data.sessiontype
			}});
			if(data.role){
				this.fetchData('get', '/api/fields', (data) => {
					this.setState({docData: {
						taxonomy: _taxonomy(data.taxonomy, data.fields),
						terms: _terms(data.taxonomy),
						customFields: _customFields(data.fields),
						customFieldAttrs: _customFieldAttrs(data.fields)
					}});
				});
			}
			if(callBack) callBack(data);
		});
	}
	setMessage(message, arg1st, arg2nd){
		if(message){
			let actOnClick = arg1st;
			this.setState({message: (
				<Message handleClick={this.handleOfMessage.bind(this, actOnClick, arg2nd)}>{message}</Message>
			)});
		} else {
			this.setState({message: (
				<div className="processing">
					<Overlay />
					<i className="pe-7f-config pe-4x pe-spin"></i>
				</div>
			)});
			return this.handleOfMessage.bind(this, 'unset');
		}
	}
	handleOfMessage(actOnClick, arg){
		this.setState({message: null});
		switch(actOnClick){
			case 'goBack':
				this.props.router.goBack(); break;
			case 'goToLogin':
				this.setState({userData: update(this.state.userData, {
					user: {$set: {uid: 0}}, role: {$set: null}
				})});
				this.props.router.push('/login'); break;
			case 'goTo':
				let path = arg;
				if(path) this.props.router.push(path); break;
			default:
		}
	}
	updateSearchQuery(which, value){
		this.setState({searchQuery: update(this.state.searchQuery, {[which]: {$set: value}})});
	}
	render(){
		let digitalLibrary = this.props.children && React.cloneElement(this.props.children, {
			userData: this.state.userData,
			docData: this.state.docData,
			searchQuery: this.state.searchQuery,
			openedDocuments: this.state.openedDocuments,
			fetchContData: this.fetchContData.bind(this),
			setMessage: this.setMessage.bind(this),
			fetchData: this.fetchData.bind(this),
			updateSearchQuery: this.updateSearchQuery.bind(this),
			message: this.state.message
		});
		return digitalLibrary;
	}
}
DigitalLibraryContainer.propTypes = {
	router: PropTypes.shape({
		push: PropTypes.func.isRequired,
		goBack: PropTypes.func.isRequired
	}).isRequired
}

export default withRouter(DigitalLibraryContainer);
