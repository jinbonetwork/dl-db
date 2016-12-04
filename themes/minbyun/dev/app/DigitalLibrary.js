import React, {Component, PropTypes} from 'react';
import {Link, withRouter} from 'react-router';
import MainMenu from './MainMenu';
import SearchBar from './SearchBar';
import LinkIf from './accessories/LinkIf';
import Message from './accessories/Message';
import {_isEmpty, _isCommon} from './accessories/functions';
import jQ from 'jquery';

const _childProps = {
	'/login': {
		role: null,
		required: ['fetchData', 'fetchContData', 'setMessage'],
		elective: ['userData']
	},
	'/user': {
		role: ['admin', 'write', 'view'],
		required: ['userData', 'fetchData', 'setMessage'],
		elective: ['userProfile', 'docData']
	},
	'/document/:did': {
		role: ['admin', 'view'],
		required: ['userData', 'fetchData', 'setMessage'],
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
	constructor(){
		super();
		this.state = {
			rerender: false
		};
	}
	componentWillMount(){
		this.props.router.push('/login');
	}
	componentDidMount(){
		jQ(window).on('resize', () => {this.setState({rerender: true})});
	}
	componentWillUnmount(){
		jQ(window).off('resize');
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
	searchBar(mode){
		return (
			<SearchBar
				mode={mode}
				docData={this.props.docData}
				query={this.props.searchQuery}
				update={this.props.updateSearchQuery}
			/>
		);
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
			<div className="digital-library" onClick={() => {this.setState({rerender: true})}}>
				<div className="digital-library__header">
					<Link className="digital-library__logo" to="/">
						<img src={site_base_uri+'/themes/minbyun/images/logo-text.svg'} />
					</Link>
					{child && this.searchBar()}{!child && <span>&nbsp;</span>}
					<MainMenu userRole={userRole} fetchData={this.props.fetchData} setMessage={this.props.setMessage} />
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
	userData: PropTypes.object,
	docData: PropTypes.object,
	searchQuery: PropTypes.object,
	fetchContData: PropTypes.func.isRequired,
	setMessage: PropTypes.func.isRequired,
	openedDocuments: PropTypes.object,
	fetchData: PropTypes.func,
	updateSearchQuery: PropTypes.func,
	message: PropTypes.element,
	router: PropTypes.shape({
		push: PropTypes.func.isRequired,
		goBack: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(DigitalLibrary);
