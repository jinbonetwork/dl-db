import React, {Component, PropTypes} from 'react';

class User extends Component {
	render(){
		return(
			<div className="userinfo">
				<p>uid: {this.props.userData.user.uid}</p>
				<p>nick_name: {this.props.userData.user.nick_name}</p>
				<p>role: {this.props.userData.role.join()}</p>
			</div>
		);
	}
}
User.propTypes = {
	userData: PropTypes.object,
};

export default User;
