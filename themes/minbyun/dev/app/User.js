import React, {Component, PropTypes} from 'react';

class User extends Component {
	render(){
		let user = this.props.userData && (
			<div>
				<p>uid: {this.props.userData.user.uid}</p>
				<p>nick_name: {this.props.userData.user.nick_name}</p>
				<p>role: {this.props.userData.role.join()}</p>
			</div>
		);

		return(
			<div className="userinfo">
				{user}
			</div>
		);
	}
}
User.propTypes = {
	userData: PropTypes.object,
};

export default User;
