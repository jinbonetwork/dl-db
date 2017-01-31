import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

class MainMenu extends Component {
	render(){
		return (
			<div className="main-menu">
				<Link to="/admin/userlist"><span>회원 관리</span></Link>
				<Link to="/admin/attachments"><span>첨부파일 관리</span></Link>
				<Link to="/admin/agreement"><span>이용약관 수정</span></Link>
			</div>
		);
	}
}

export default MainMenu;
