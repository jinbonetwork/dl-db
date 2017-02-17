import React, {Component, PropTypes} from 'react';

class UserProfile extends Component {
	componentDidMount(){
		this.props.fetchUserProfile();
	}
	render(){
		return null;
	}
}
UserProfile.propTypes = {
	fetchUserProfile: PropTypes.func.isRequired
}

export default UserProfile;
