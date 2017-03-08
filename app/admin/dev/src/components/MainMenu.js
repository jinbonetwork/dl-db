import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {_wrap} from '../accessories/functions';

class MainMenu extends Component {
	handleClick(which){
		if(which == 'logout'){
			this.props.onLogOut({afterLogout: () => {window.location = '/admin'}});
		}
	}
	render(){
		const boardAdminUrl = _wrap(() => {
			switch(this.props.loginType){
				case 'xe': return '/xe?module=admin';
				case 'gnu': return '/gnu5/admin';
				case 'wp': return '/wordpress/wp-admin';
			}
		});
		return (
			<div className="main-menu">
				<a href="/"><span>돌아가기</span></a>
				<Link to="/admin/userlist"><span>회원 관리</span></Link>
				<Link to="/admin/stats"><span>통계</span></Link>
				<Link to="/admin/attachments"><span>첨부파일 관리</span></Link>
				<Link to="/admin/agreement"><span>이용약관 수정</span></Link>
				<a href={boardAdminUrl}><span>게시판 관리</span></a>
				<a tabIndex="0" onClick={this.handleClick.bind(this, 'logout')}><span>로그아웃</span></a>
			</div>
		);
	}
}
MainMenu.propTypes = {
	onLogOut: PropTypes.func.isRequired,
	loginType: PropTypes.string.isRequired
};

export default MainMenu;
