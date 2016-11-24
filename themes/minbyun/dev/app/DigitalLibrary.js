import React, {Component, PropTypes} from 'react';
import {Link, withRouter} from 'react-router';
import SearchBar from './SearchBar';
import LinkIf from './LinkIf';
import Message from './overlay/Message';
import {_isEmpty, _isCommon} from './functions';

const _childProps = {
	'/login': {
		role: null,
		required: ['fetchData', 'fetchContData', 'setMessage'],
		elective: ['userData']
	},
	'/user': {
		role: [1, 3, 7],
		required: ['userData', 'fetchData', 'setMessage']
	},
	'/document/:did': {
		role: [1, 7],
		required: ['userData', 'fetchData', 'setMessage'],
		elective: ['docData']
	},
	'/document/new':{
		role: [1, 3],
		required: ['userData', 'fetchData', 'setMessage'],
		elective: ['docData']
	},
	'/document/:did/edit': {
		role: [1, 7],
		required: ['userData', 'fetchData', 'setMessage'],
		elective: ['docData']
	},
	'/search**': {
		role: [1, 3, 7],
		required: ['userData', 'fetchData'],
		elective: ['docData']
	}
}

class DigitalLibrary extends Component {
	componentWillMount(){
		this.props.router.push('/login');
	}
	cloneChild(child, userData){
		if(!child || !userData.user) return null;
		let childProp = _childProps[child.props.route.path];
		if(!userData.role && childProp.role) return null;
		if(childProp.role && !_isCommon(childProp.role, userData.role)){
			return (
				<Message handleClick={this.props.router.goBack.bind(this)}>이 페이지에 접근할 권한이 없습니다.</Message>
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
	render(){
		let userRole = this.props.userData.role;
		let child = this.cloneChild(this.props.children, this.props.userData);
		if(!userRole){
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
						<img src={site_base_uri+'/themes/minbyun/images/logo-text.svg'} />
					</Link>
					{child && <SearchBar />}
					<div className="digital-library__menu">
						<LinkIf to="/user" if={_isCommon([1, 3, 7], userRole)}>내정보</LinkIf>
						<LinkIf to="/search" if={_isCommon([1, 7], userRole)}>자료목록</LinkIf>
						<LinkIf to="/document/new" if={_isCommon([1, 3], userRole)}>자료 입력</LinkIf>
					</div>
				</div>
				<div className="digital-library__content">
					{child || <SearchBar mode="content" />}
				</div>
				{this.props.message}
			</div>
		);
	}
}
DigitalLibrary.propTypes = {
	userData: PropTypes.object,
	docData: PropTypes.object,
	fetchContData: PropTypes.func.isRequired,
	setMessage: PropTypes.func.isRequired,
	openedDocuments: PropTypes.object,
	fetchData: PropTypes.func,
	message: PropTypes.element,
	router: PropTypes.shape({
		push: PropTypes.func.isRequired,
		goBack: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(DigitalLibrary);
