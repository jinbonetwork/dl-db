import React, {Component, PropTypes} from 'react';

class User extends Component {
	render(){
		return(
			<div>
				<p>{this.props.user.uid}</p>
				<p>{this.props.role}</p>
			</div>
		);
	}
}
User.propTypes = {
	user: PropTypes.object,
	role: PropTypes.array
};

export default User;
