import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

const childPropList = {
	'/user': {
		required: ['userData'],
		elective: []
	},
	'/document/new':{
		required: ['userData', 'documentFormData', 'documentForm'],
		elective: []
	},
	'/error': {
		required: [],
		elective: []
	}
}

class DigitalLibrary extends Component {
	cloneChild(children){
		if(!children) return null;
		let childProp = childPropList[children.props.route.path];
		let props = {};
		for(let i = 0, len = childProp.required.length; i < len; i++){
			let p = childProp.required[i];
			if(!this.props[p]) return null;
			props[p] = this.props[p];
		}
		for(let i = 0, len = childProp.elective.length; i < len; i++){
			let p = childProp.electiv[i];
			props[p] = this.props[p];
		}
		return React.cloneElement(children, props);
	}
	render(){
		let child = this.cloneChild(this.props.children);
		return(
			<div className="digital-library">
				<div className="digital-library__menu">
					<Link to="/user">내정보</Link>{' '}
					<Link to="/document/new">자료 입력하기</Link>
				</div>
				{child}
			</div>
		);
	}
}
DigitalLibrary.propTypes = {
	apiUrl: PropTypes.string,
	userData: PropTypes.object,
	documentFormData: PropTypes.object,
	documentForm: PropTypes.object
};

export default DigitalLibrary;
