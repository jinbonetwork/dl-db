import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

class MainMenu extends Component {
	render(){
		return (
			<div className="main-menu">
				<Link to="/admin/userlist"><span>회원관리</span></Link>
				<Link to="/admin/agreement"><span>이용자 약관 수정</span></Link>
			</div>
		);
	}
}

export default MainMenu;
