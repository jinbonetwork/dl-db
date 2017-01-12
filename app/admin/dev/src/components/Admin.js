import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

class Admin extends Component {
	componentDidMount(){
		this.props.fetchAdminInfo();
	}
	render(){
		return (
			<div>
				<div className="menu">
					<Link to="/admin/users"><span>회원</span></Link>{' '}
					<Link to="/admin/agreement"><span>이용자 약관</span></Link>
				</div>
				<div>
					{this.props.children}
				</div>
			</div>
		);
	}
}
Admin.propTypes = {
	isAdmin: PropTypes.bool,
	loginType: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	password: PropTypes.string.isRequired,
	fetchAdminInfo: PropTypes.func.isRequired
};

export default Admin;
