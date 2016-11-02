import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

class DigitalLibrary extends Component {
	render(){
		let childProps;
		if(this.props.children){
			switch(this.props.children.props.route.path){
				case '/document/new':
					childProps = {
						user: this.props.user,
						documentFormData: this.props.documentFormData
					};
					break;
				case '/user':
					childProps = {
						user: this.props.user,
						role: this.props.role
					};
					break;
			}
		}
		let child = this.props.children && React.cloneElement(this.props.children, childProps);

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
/*
DigitalLibrary.propTypes = {
	user: PropTypes.object,
	role: PropTypes.array,
	documentFormData: PropTypes.objectOf(PropTypes.array)
};
*/

export default DigitalLibrary;
