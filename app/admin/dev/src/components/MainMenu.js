import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

class MainMenu extends Component {
	handleClick(which){
		if(which == 'logout'){
			this.props.onLogOut({afterLogout: () => {window.location = '/admin'}});
		}
	}
	render(){
		return (
			<div className="main-menu">
				<Link to="/admin/userlist"><span>회원 관리</span></Link>
				<Link to="/admin/attachments"><span>첨부파일 관리</span></Link>
				<Link to="/admin/agreement"><span>이용약관 수정</span></Link>
				<a onClick={this.handleClick.bind(this, 'logout')}><span>로그아웃</span></a>
			</div>
		);
	}
}
MainMenu.propTypes = {
	onLogOut: PropTypes.func.isRequired
};

export default MainMenu;
