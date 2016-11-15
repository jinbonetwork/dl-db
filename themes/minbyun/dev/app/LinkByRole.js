import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import func from './functions';

class LinkByRole extends Component {
	render(){
		if(!this.props.userRole) return null;
		return ( func.isCommon(this.props.role, this.props.userRole) &&
			<Link to={this.props.to}>{this.props.children}</Link>
		);
	}
}
LinkByRole.propTypes = {
	to: PropTypes.string.isRequired,
	children: PropTypes.string.isRequired,
	role: PropTypes.array.isRequired,
	userRole: PropTypes.array
};

export default LinkByRole;
