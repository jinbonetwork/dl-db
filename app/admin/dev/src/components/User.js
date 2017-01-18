import React, {Component, PropTypes} from 'react';

class User extends Component {
	componentDidMount(){
		this.props.fetchUser(this.props.params.id, this.props.originalUserList);
	}
	render(){
		return null;
	}
}
User.propTypes = {
	userFieldData: PropTypes.object.isRequired,
	originalUserList: PropTypes.array.isRequired,
	user: PropTypes.object.isRequired,
	fetchUser: PropTypes.func.isRequired
};

export default User;
