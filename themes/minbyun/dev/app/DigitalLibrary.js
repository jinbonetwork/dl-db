import React, {Component, PropTypes} from 'react';
import {Link, withRouter} from 'react-router';
import SearchBar from './SearchBar';
import LinkByRole from './LinkByRole';
import ErrorMessage from './ErrorMessage';
import func from './functions';

const _childProps = {
	'/user': {
		role: [1, 3, 7],
		required: ['userData']
	},
	'/document/:did': {
		role: [1, 3, 7],
		required: ['userData', 'documentFormData', 'documentFormOptions', 'apiUrl']
	},
	'/document/new':{
		role: [1, 3, 7],
		required: ['userData', 'documentFormData', 'documentForm', 'documentFormOptions', 'apiUrl'],
		elective: ['openedDocuments']
	},
	'/document/:did/edit': {
		role: [1, 3, 7],
		required: ['userData', 'documentFormData', 'documentForm', 'documentFormOptions', 'apiUrl'],
		elective: ['openedDocuments']
	},
	'/search**': {
		role: [1, 3, 7, 15],
		required: ['userData', 'apiUrl'],
	}
}

class DigitalLibrary extends Component {
	handleClickToGoBoak(){
		this.props.router.goBack();
	}
	cloneChild(children){
		if(!children || !this.props.userData) return null;
		let childProp = _childProps[children.props.route.path];
		let props = {};
		if(childProp.required){
			for(let i = 0, len = childProp.required.length; i < len; i++){
				let p = childProp.required[i];
				if(!this.props[p]) return null;
				props[p] = this.props[p];
			}
		}
		if(childProp.elective){
			for(let i = 0, len = childProp.elective.length; i < len; i++){
				let p = childProp.elective[i];
				props[p] = this.props[p];
			}
		}
		return React.cloneElement(children, props);
	}
	render(){
		let userRole = (this.props.userData ? this.props.userData.role : null);
		let child = this.cloneChild(this.props.children);
		if(child && func.isCommon(_childProps[this.props.children.props.route.path].role, this.props.userData.role) === false){
			child = <ErrorMessage message="이 페이지에 접근할 권한이 없습니다. 되돌아가려면 클릭하세요." handleClick={this.handleClickToGoBoak.bind(this)} />
		}
		return(
			<div className="digital-library">
				<div className="digital-library__header">
					<Link className="digital-library__logo" to="/">
						<img src={site_base_uri+'/themes/minbyun/logo.svg'} />
					</Link>
					{child && <SearchBar />}
					<div className="digital-library__menu">
						<LinkByRole to="/user" role={[1, 3, 7]} userRole={userRole}>내정보</LinkByRole>
						<LinkByRole to="/document/new" role={[1, 3]} userRole={userRole}>자료 입력</LinkByRole>
					</div>
				</div>
				<div className="digital-library__content">
					{child || <SearchBar mode="content" />}
				</div>
			</div>
		);
	}
}
DigitalLibrary.propTypes = {
	apiUrl: PropTypes.string,
	userData: PropTypes.object,
	documentFormData: PropTypes.object,
	documentForm: PropTypes.object,
	documentFormOptions: PropTypes.object,
	openedDocuments: PropTypes.object,
	router: PropTypes.shape({
		goBack: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(DigitalLibrary);
