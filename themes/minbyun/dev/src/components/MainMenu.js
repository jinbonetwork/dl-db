import React, {Component, PropTypes} from 'react';
import {Link, withRouter} from 'react-router';
import Dropdown from '../accessories/Dropdown';
import Item from '../accessories/Item';
import Toggle from '../accessories/Toggle';
import {Accordian, AcdItem} from '../accessories/Accordian';
import LinkIf from '../accessories/LinkIf';
import {_isCommon, _interpolate, _wrap} from '../accessories/functions';
import {SCREEN, MAIN_MENU, USER_MENU} from '../constants';

class MainMenu extends Component {
	handleClick(which, arg){
		if(which == 'logout'){
			this.props.onLogOut({afterLogout: () => {window.location = '/'}});
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
				return <span key={key}>{(this.props.role.indexOf('administrator') >= 0 ? '관리자' : '회원')}</span>
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
				return USER_MENU.map((item) => {
					const child = _wrap(() => {
						if(!item.path){
							return (
								<div onClick={this.handleClick.bind(this, 'logout')}>
									<i className={item.icon+' pe-va'}></i><span>{item.name}</span>
								</div>
							);
						}
						else if(item.path == '/admin'){
							if(this.props.role.indexOf('administrator') >= 0){
								return <a href={item.path}><i className={item.icon+' pe-va'}></i><span>{item.name}</span></a>
							} else {
								return null;
							}
						} else {
							return <Link to={item.path}><i className={item.icon+' pe-va'}></i><span>{item.name}</span></Link>
						}
					});
					if(child){
						if(tag == 'li'){
							return <li key={item.path}>{child}</li>
						} else {
							return <Item key={item.path}>{child}</Item>
						}
					}
				});
			case 'boards':
				return this.menuItems(name, this.props.menuData[0], tag);
			case 'links':
				return this.menuItems(name, this.props.menuData[1], tag);
		}
	}
	dropdownMenu(){
		return MAIN_MENU.map((item) => {
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
		let acditems = MAIN_MENU.map((item) => {
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
		let paddingOfWrite = _interpolate(wWidth, 0.7, 1.5, SCREEN.mmLarge, SCREEN.large, 'em');
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
		const menu = (this.props.window.width <= SCREEN.mmLarge ? this.hamburgerMenu() : this.dropdownMenu());
		return (
			<div className="main-menu">
				<LinkIf className="main-menu__write" to="/document/new" if={_isCommon(['administrator', 'write'], this.props.role)} style={prsRsp.style.write}>
					<i className="pe-7f-note pe-va"></i><span>자료<br/>입력</span>
				</LinkIf>
				{menu}
			</div>
		);
	}
}
MainMenu.propTypes = {
	role: PropTypes.array.isRequired,
	window: PropTypes.object.isRequired,
	menuData: PropTypes.array.isRequired,
	onLogOut: PropTypes.func.isRequired,
	router: PropTypes.shape({
		push: PropTypes.func.isRequired,
		goBack: PropTypes.func.isRequired
	}).isRequired
}
export default withRouter(MainMenu);
