import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

class LinkByRole extends Component {
	intersection(array1, array2){
		for(let i in array1){
			for(let j in array2){
				if(array1[i] == array2[j]) return true;
			}
		}
		return false;
	}
	render(){
		if(!this.props.userData) return null;
		return ( this.intersection(this.props.role, this.props.userData.role) &&
			<Link to={this.props.to}>{this.props.children}</Link>
		);
	}
}
LinkByRole.propTypes = {
	to: PropTypes.string.isRequired,
	children: PropTypes.string.isRequired,
	role: PropTypes.array.isRequired,
	userData: PropTypes.object
};

export default LinkByRole;
