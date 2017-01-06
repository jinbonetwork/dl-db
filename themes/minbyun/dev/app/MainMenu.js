import React, {Component, PropTypes} from 'react';
import {Link, withRouter} from 'react-router';
import Dropdown from './accessories/Dropdown';
import Item from './accessories/Item';
import Toggle from './accessories/Toggle';
import {Accordian, AcdItem} from './accessories/Accordian';
import LinkIf from './accessories/LinkIf';
import {_isCommon, _interpolate} from './accessories/functions';
import {_mainMenu, _userMenu} from './schema/menuSchema';
import {_screen} from './schema/screenSchema';

class MainMenu extends Component {
	handleClick(which, arg){
		if(which == 'logout'){
			this.props.fetchData('post', '/api/logout', null, (data) => {if(data){
				this.props.unsetUserData();
				this.props.router.push('/');
				this.props.router.push('/login');
			}});
		}
	}
	menuItems(name, data, tag){
		return data.items.map((item, index) => {
			const child = <a href={item.url} target={(name == 'boards' ? null : '_blank')}><span>{item.displayName}</span></a>
			if(tag == 'li'){
				return <li key={index}>{child}</li>
			} else {
				return <Item key={index}>{child}</Item>
			}
		});
	}
	displayNameOfMenu(name, where, key){
		switch(name){
			case 'user':
				return <span key={key}>{(this.props.userRole.indexOf('admin') >= 0 ? '관리자' : '회원')}</span>
			case 'boards':
				return <span key={key}>게시판</span>
			case 'links':
				if(where == 'hamburger'){
					return <span key={key}>바로가기</span>
				} else {
					return <span key={key}>바로<br/>가기</span>
				}
			default:
		}
	}
	childrenOfMenu(name, tag){
		switch(name){
			case 'user':
				let items = _userMenu.map((item) => {
					const child = <Link to={'/user/'+item.path}><i className={item.icon+' pe-va'}></i><span>{item.name}</span></Link>
					if(tag == 'li'){
						return <li key={item.path}>{child}</li>
					} else {
						return <Item key={item.path}>{child}</Item>
					}
				});
				const child = (
					<div onClick={this.handleClick.bind(this, 'logout')}>
						<i className="pe-7s-unlock pe-va"></i><span>로그아웃</span>
					</div>
				);
				if(tag == 'li'){
					items.push(<li key={items.length}>{child}</li>);
				} else {
					items.push(<Item key={items.length}>{child}</Item>);
				}
				return items;
			case 'boards':
				return this.menuItems(name, this.props.menuData[0], tag);
			case 'links':
				return this.menuItems(name, this.props.menuData[1], tag);
		}
	}
	dropdownMenu(){
		return _mainMenu.map((item) => {
			return (
				<Dropdown key={item.name} className={'main-menu__'+item.name} window={this.props.window}
					head={[<i key="head-icon" className={item.icon+' pe-va'}></i>, this.displayNameOfMenu(item.name, 'normal', 'display-name')]}
					arrow={<i className="pe-7s-angle-down pe-va"></i>}
				>
					{this.childrenOfMenu(item.name)}
				</Dropdown>
			);
		});
	}
	hamburgerMenu(){
		let acditems = _mainMenu.map((item) => {
			const head = (
				<div className={'main-menu__'+item.name}>
					<i className={item.icon+' pe-va'}></i>
					{this.displayNameOfMenu(item.name, 'hamburger')}
				</div>
			);
			return (
				<AcdItem key={item.name} head={head}>
					<ul>{this.childrenOfMenu(item.name, 'li')}</ul>
				</AcdItem>
			);
		});
		return (
			<Toggle notIf={(which) => (which == 'head')}
				iconWhenOff={<i className="pe-7f-menu pe-va"></i>}
				iconWhenOn={<i className="pe-7f-menu pe-va"></i>}
			>
				<Accordian>{acditems}</Accordian>
			</Toggle>
		);
	}
	propsForResponsivity(){
		const wWidth = this.props.window.width;
		let paddingOfWrite = _interpolate(wWidth, 0.7, 1.5, _screen.mmLarge, _screen.large, 'em');
		return {
			style: {
				write: {
					padding: '0 '+paddingOfWrite
				}
			}
		};
	}
	render(){
		const prsRsp = this.propsForResponsivity();
		const menu = (this.props.window.width <= _screen.mmLarge ? this.hamburgerMenu() : this.dropdownMenu());
		return (
			<div className="main-menu">
				<LinkIf className="main-menu__write" to="/document/new" if={_isCommon(['admin', 'write'], this.props.userRole)} style={prsRsp.style.write}>
					<i className="pe-7f-note pe-va"></i><span>자료<br/>입력</span>
				</LinkIf>
				{menu}
			</div>
		);
	}
}
MainMenu.propTypes = {
	userRole: PropTypes.array.isRequired,
	window: PropTypes.object.isRequired,
	menuData: PropTypes.array.isRequired,
	fetchData: PropTypes.func.isRequired,
	setMessage: PropTypes.func.isRequired,
	unsetUserData: PropTypes.func.isRequired
}
export default withRouter(MainMenu);
