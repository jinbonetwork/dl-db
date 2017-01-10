import React, {Component, PropTypes} from 'react';

class Users extends Component {
	componentDidMount(){
		this.props.fetchUserFieldData();
		this.props.fetchUserList();
	}
	render(){
		return(
			<div>Users</div>
		);
	}
}
Users.propTypes = {
	fieldData: PropTypes.shape({
		fields: PropTypes.array, taxonomy: PropTypes.object, roles: PropTypes.object
	}).isRequired,
	list: PropTypes.array.isRequired,
	fetchUserFieldData: PropTypes.func.isRequired,
	fetchUserList: PropTypes.func.isRequired
}

export default Users;
