import React, {Component, PropTypes} from 'react';
import {Link, withRouter} from 'react-router';
import SearchBar from './SearchBar';
import LinkByRole from './LinkByRole';
import Message from './overlay/Message';
import {_isEmpty, _isCommon} from './functions';

const _childProps = {
	'/login': {
		role: null,
		required: ['userData']
	},
	'/user': {
		role: [1, 3, 7],
		required: ['userData']
	},
	'/document/:did': {
		role: [1, 7],
		required: ['userData'],
		elective: ['docData']
	},
	'/document/new':{
		role: [1, 3],
		required: ['userData'],
		elective: ['docData']
	},
	'/document/:did/edit': {
		role: [1, 7],
		required: ['userData'],
		elective: ['docData']
	},
	'/search**': {
		role: [1, 3, 7],
		required: ['userData'],
		elective: ['docData']
	}
}

class DigitalLibrary extends Component {
	componentWillReceiveProps(nextProps){
		if(!nextProps.children && nextProps.userData.user && nextProps.userData.user.uid == 0){
			this.props.router.push('/login');
		}
	}
	handleClick(which, args, event){
		if(which == 'goback'){
			this.props.router.goBack();
		}
	}
	cloneChild(child, userRole){
		if(!child) return null;
		let childProp = _childProps[child.props.route.path];
		if(!userRole && childProp.role) return null;
		if(childProp.role && !_isCommon(childProp.role, userRole)){
			return (
				<Message handleClick={this.handleClick.bind(this, 'goback')}>
					이 페이지에 접근할 권한이 없습니다. 되돌아가려면 클릭하세요.
				</Message>
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
		let child = this.cloneChild(this.props.children, userRole);
		return(
			<div className="digital-library">
				<div className="digital-library__header">
					<Link className="digital-library__logo" to="/">
						<img src={site_base_uri+'/themes/minbyun/images/logo.svg'} />
					</Link>
					{child && <SearchBar />}
					<div className="digital-library__menu">
						<LinkByRole to="/user" role={[1, 3, 7]} userRole={userRole}>내정보</LinkByRole>
						<LinkByRole to="/search" role={[1, 7]} userRole={userRole}>자료목록</LinkByRole>
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
	userData: PropTypes.object,
	docData: PropTypes.object,
	openedDocuments: PropTypes.object,
	router: PropTypes.shape({
		push: PropTypes.func.isRequired,
		goBack: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(DigitalLibrary);
