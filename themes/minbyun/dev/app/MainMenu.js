import React, {Component, PropTypes} from 'react';
import {Link, withRouter} from 'react-router';
import {Dropdown, DdHead, DdItem, DdArrow} from './accessories/Dropdown';
import LinkIf from './accessories/LinkIf';
import {_isCommon} from './accessories/functions';
import {_userMenu} from './schema/menuSchema';

class MainMenu extends Component {
	handleClick(which, arg){
		if(which == 'logout'){
			this.props.fetchData('post', '/api/logout', null, (data) => {if(data){
				this.props.unsetUserData();
				this.props.router.push('/login');
			}});
		}
	}
	menuItems(data){
		return data.items.map((item, index) =>
			<DdItem key={index}><a href={item.url} target="_blank"><span>{item.displayName}</span></a></DdItem>
		);
	}
	render(){
		const boards = this.props.menuData[0];
		const links = this.props.menuData[1];
		const userDisplayName = (this.props.userRole.indexOf('admin') >= 0 ? '관리자' : '회원');
		const userMenuItems = _userMenu.map((item) => (
			<DdItem key={item.path}>
				<Link to={'/user/'+item.path}><i className={item.icon+' pe-va'}></i><span>{item.name}</span></Link>
			</DdItem>
		));
		return (
			<div className="main-menu">
				<LinkIf className="main-menu__write" to="/document/new" if={_isCommon(['admin', 'write'], this.props.userRole)}>
					<i className="pe-7f-note pe-va"></i>{' '}<span>자료<br/>입력</span>
				</LinkIf>
				<Dropdown className="main-menu__user">
					<DdHead>
						<i className="pe-7f-user pe-va"></i>{' '}<span>{userDisplayName}</span>
						<DdArrow><i className="pe-7s-angle-down pe-va"></i></DdArrow>
					</DdHead>
					{userMenuItems}
					<DdItem>
						<div onClick={this.handleClick.bind(this, 'logout')}>
							<i className="pe-7s-unlock pe-va"></i><span>로그아웃</span>
						</div>
					</DdItem>
				</Dropdown>
				<Dropdown className="main-menu__boards">
					<DdHead>
						<i className="pe-7s-note2 pe-va"></i>{' '}<span>게시판</span>
						<DdArrow><i className="pe-7s-angle-down pe-va"></i></DdArrow>
					</DdHead>
					{this.menuItems(boards)}
				</Dropdown>
				<Dropdown className="main-menu__links">
					<DdHead>
						<i className="pe-7s-star pe-va"></i>{' '}<span>바로<br/>가기</span>
						<DdArrow><i className="pe-7s-angle-down pe-va"></i></DdArrow>
					</DdHead>
					{this.menuItems(links)}
				</Dropdown>
			</div>
		);
	}
}
MainMenu.propTypes = {
	userRole: PropTypes.array.isRequired,
	menuData: PropTypes.array.isRequired,
	fetchData: PropTypes.func.isRequired,
	setMessage: PropTypes.func.isRequired,
	unsetUserData: PropTypes.func.isRequired
}
export default withRouter(MainMenu);
