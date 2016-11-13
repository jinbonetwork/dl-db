import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

const childPropList = {
	'/user': {
		required: ['userData']
	},
	'/document': {
		required: ['userData']
	},
	'/document/:did': {
		required: ['userData', 'documentFormData', 'documentFormOptions', 'apiUrl']
	},
	'/document/new':{
		required: ['userData', 'documentFormData', 'documentForm', 'documentFormOptions', 'apiUrl'],
		elective: ['openedDocuments']
	},
	'/error': {},
	'/test': {}
}

class DigitalLibrary extends Component {
	cloneChild(children){
		if(!children) return null;
		let childProp = childPropList[children.props.route.path];
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
		let child = this.cloneChild(this.props.children);
		return(
			<div className="digital-library">
				<div className="digital-library__header">
					<div className="searchbar">
					</div>
					<div className="digital-library__menu">
						<Link to="/user">내정보</Link>
						<Link to="/document/new">자료 입력하기</Link>
						<Link to="/document/1">테스트 문서</Link>
					</div>
				</div>
				<div className="digital-library__content">
					{child}
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
	openedDocuments: PropTypes.object
};

export default DigitalLibrary;
