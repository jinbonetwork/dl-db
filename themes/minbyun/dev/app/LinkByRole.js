
import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import func from './functions';

class LinkByRole extends Component {
	render(){
		let isAuthorized = this.props.userRole && func.isCommon(this.props.role, this.props.userRole);
		if(isAuthorized){
			return <Link className={this.props.className} to={this.props.to}>{this.props.children}</Link>
		} else {
			if(this.props.isVisible){
				return <span className={this.props.className}>{this.props.children}</span>
			} else {
				return null;
			}
		}
	}
}
LinkByRole.propTypes = {
	className: PropTypes.string,
	to: PropTypes.string.isRequired,
	role: PropTypes.array.isRequired,
	userRole: PropTypes.array,
	isVisible: PropTypes.bool
};

export default LinkByRole;
