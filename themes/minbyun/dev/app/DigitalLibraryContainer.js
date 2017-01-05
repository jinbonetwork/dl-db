import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import axios from 'axios';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find(), findIndex() ...
import Message from './accessories/Message';
import Overlay from './accessories/Overlay';
import  {_emptyDoc, _fAttrs, _fname, _sFname, _docData} from './schema/docSchema';
import {_role, _convertToUser, _emptyUser, _usCustomFieldAttrs, _usCustomFields} from './schema/userSchema';
import {_menuData} from './schema/menuSchema';
import {_isEmpty} from './accessories/functions';
import jQ from 'jquery';

class DigitalLibraryContainer extends Component {
	constructor(){
		super();
		this.state = {
			userData: {user: null, role: null, type: null, agreement: null},
			menuData: [],
			docData: {
				emptyDoc: _emptyDoc,
				fAttrs: _fAttrs,
				fname: _fname,
				sFname: _sFname,
				taxonomy: {},
				terms: {},
			},
			searchQuery: {
				doctypes: [],
				keyword: '',
				from: '',
				to: ''
			},
			userProfile: {
				profile: _emptyUser
			},
			message: null,
			openedDocuments: [],
			window: {width: 100, height: 100}
		};
	}
	componentDidMount(){
		this.fetchContData((data) => {
			if(data.agreement != 1){
				if(this.props.location.pathname != '/login'){
					this.props.router.push('/login');
				} else {
					this.props.router.push('/');
					this.props.router.push('/login');
				}
			}
		});
		this.handleResize();
		jQ(window).on('resize', this.handleResize.bind(this));
	}
	componentWillUnmount(){
		jQ(window).off('resize');
	}
	handleResize(){
		this.setState({window: {width: window.innerWidth, height: window.innerHeight}});
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
					let message = (response.data.message ? response.data.message : response.data);
					this.setMessage(message, actOnClick);
					console.error(response.data);
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
			this.setState({
				userData: {
					user: data.user,
					role: _role(data.role),
					type: data.sessiontype,
					agreement: (data.agreement == 1)
				},
				menuData: _menuData(data.menu)
			});
			if(data.role){
				this.fetchData('get', '/api/fields', (data) => {
					this.setState({docData: _docData(data)});
				});
				this.fetchData('get', '/api/user/profile', (data) => {
					this.setState({userProfile: {
						profile: _convertToUser(data.profile)
					}});
				});
			}
			if(callBack) callBack(data);
		});
	}
	setMessage(message, arg1st, arg2nd){
		if(message){
			this.setState({message: (
				<Message onClick={this.handleOfMessage.bind(this, arg1st, arg2nd)}>{message}</Message>
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
	unsetUserData(){
		this.setState({userData: update(this.state.userData, {
			user: {$set: {uid: 0}}, role: {$set: null}, agreement: {$set: null}
		})});
	}
	setAgreement(){
		this.setState({userData: update(this.state.userData, {agreement: {$set: true}})});
	}
	handleOfMessage(actOnClick, arg){
		this.setState({message: null});
		switch(actOnClick){
			case 'goBack':
				this.props.router.goBack(); break;
			case 'goToLogin':
				this.unsetUserData();
				this.props.router.push('/login'); break;
			case 'goTo':
				if(arg) this.props.router.push(arg); break;
			case 'replace':
				if(arg) this.props.router.replace(arg); break;
			default:
				if(typeof actOnClick === 'function') actOnClick();
		}
	}
	updateSearchQuery(arg0, arg1){
		if(typeof arg0 !== 'object'){
			let which = arg0, value = arg1;
			this.setState({searchQuery: update(this.state.searchQuery, {[which]: {$set: value}})});
		} else {
			let searchQuery = arg0;
			this.setState({searchQuery: update(this.state.searchQuery, {$merge: searchQuery})});
		}
	}
	render(){
		let digitalLibrary = this.props.children && React.cloneElement(this.props.children, {
			userData: this.state.userData,
			menuData: this.state.menuData,
			userProfile: this.state.userProfile,
			docData: this.state.docData,
			searchQuery: this.state.searchQuery,
			openedDocuments: this.state.openedDocuments,
			message: this.state.message,
			window: this.state.window,
			fetchContData: this.fetchContData.bind(this),
			setMessage: this.setMessage.bind(this),
			unsetUserData: this.unsetUserData.bind(this),
			setAgreement: this.setAgreement.bind(this),
			fetchData: this.fetchData.bind(this),
			updateSearchQuery: this.updateSearchQuery.bind(this)
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
