import React, {Component, PropTypes} from 'react';

class UserForm extends Component {
	render(){
		return (

		);
	}
}
UserForm.propTypes = {
	userFieldData: PropTypes.object.isRequired,
	originalUserList: PropTypes.array.isRequired,
	originalUser: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired,
	fetchUser: PropTypes.func.isRequired
};

export default UserForm;
