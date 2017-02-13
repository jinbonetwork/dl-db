import React, {Component, PropTypes} from 'react';
import {Link, withRouter} from 'react-router';
import MainMenu from './MainMenu';
import SearchBar from './SearchBar';
import LinkIf from './accessories/LinkIf';
import Message from './accessories/Message';
import {_isEmpty, _isCommon} from './accessories/functions';
import {_screen} from './schema/screenSchema';

const _childProps = {
	'/login': {
		role: null,
		required: ['fetchData', 'fetchContData', 'setMessage', 'window', 'unsetUserData', 'setAgreement'],
		elective: ['userData']
	},
	'/user': {
		role: ['admin', 'write', 'view'],
		required: ['userData', 'fetchData', 'setMessage'],
		elective: ['userProfile', 'docData']
	},
	'/document/:did': {
		role: ['admin', 'view'],
		required: ['userData', 'fetchData', 'setMessage', 'window'],
		elective: ['docData']
	},
	'/document/new':{
		role: ['admin', 'write'],
		required: ['userData', 'fetchData', 'setMessage'],
		elective: ['docData']
	},
	'/document/:did/edit': {
		role: ['admin', 'write'],
		required: ['userData', 'fetchData', 'setMessage'],
		elective: ['docData']
	},
	'/search**': {
		role: ['admin', 'write', 'view'],
		required: ['userData', 'fetchData', 'updateSearchQuery', 'setMessage'],
		elective: ['docData']
	}
}

class DigitalLibrary extends Component {
	cloneChild(child, userData){
		if(!child || !userData.user) return null;
		if(!userData.agreement && child.props.route.path != '/login') return null;
		let childProp = _childProps[child.props.route.path];
		if(childProp.role && !_isCommon(childProp.role, userData.role)){
			return (
				<Message onClick={this.props.router.goBack}>이 페이지에 접근할 권한이 없습니다.</Message>
			);
		}
		let props = {};
		if(childProp.required){
			for(let i = 0, len = childProp.required.length; i < len; i++){
				let p = childProp.required[i];
				if(_isEmpty(this.props[p])) return null;
				props[p] = this.props[p];
			}
		}
		if(childProp.elective){
			for(let i = 0, len = childProp.elective.length; i < len; i++){
				let p = childProp.elective[i];
				props[p] = this.props[p];
			}
		}
		return React.cloneElement(child, props);
	}
	searchBar(mode){
		return (
			<SearchBar
				mode={mode}
				docData={this.props.docData}
				query={this.props.searchQuery}
				window={this.props.window}
				update={this.props.updateSearchQuery}
				setMessage={this.props.setMessage}
			/>
		);
	}
	render(){
		const wWidth = this.props.window.width;
		const userRole = this.props.userData.role;
		const child = this.cloneChild(this.props.children, this.props.userData);
		if(!this.props.userData.agreement || this.props.location.pathname == '/login'){
			return (
				<div className="digital-library">
					{child}
					{this.props.message}
				</div>
			);
		}
		return(
			<div className="digital-library">
				<div className="digital-library__header">
					<Link className="digital-library__logo" to="/">
						<img src={site_base_uri+'/themes/minbyun/images/logo.png'} />
						{(!child || wWidth <= _screen.sMedium) && <span>민주사회를 위한 변호사모임</span>}
					</Link>
					{child && this.searchBar()}{!child && <span>&nbsp;</span>}
					<MainMenu userRole={userRole} menuData={this.props.menuData} window={this.props.window}
						fetchData={this.props.fetchData} setMessage={this.props.setMessage} unsetUserData={this.props.unsetUserData}
					/>
				</div>
				<div className="digital-library__content">
					{child || this.searchBar('content')}
				</div>
				{this.props.message}
			</div>
		);
	}
}
DigitalLibrary.propTypes = {
	userData: PropTypes.object.isRequired,
	menuData: PropTypes.array.isRequired,
	docData: PropTypes.object.isRequired,
	searchQuery: PropTypes.object.isRequired,
	openedDocuments: PropTypes.array.isRequired,
	message: PropTypes.element,
	window: PropTypes.object.isRequired,
	fetchContData: PropTypes.func.isRequired,
	setMessage: PropTypes.func.isRequired,
	unsetUserData: PropTypes.func.isRequired,
	setAgreement: PropTypes.func.isRequired,
	fetchData: PropTypes.func.isRequired,
	updateSearchQuery: PropTypes.func.isRequired,
	router: PropTypes.shape({
		push: PropTypes.func.isRequired,
		goBack: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(DigitalLibrary);