import React, {Component, PropTypes} from 'react';

class Users extends Component {
	componentDidMount(){
		this.props.fetchUserList();
	}
	render(){
		console.log(this.props.list);
		return(
			<div>Users</div>
		);
	}
}
Users.propTypes = {
	list: PropTypes.array.isRequired,
	fetchUserList: PropTypes.func.isRequired
}

export default Users;
