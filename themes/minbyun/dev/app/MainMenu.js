import React, {Component, PropTypes} from 'react';
import {Link, withRouter} from 'react-router';
import {Dropdown, DdHead, DdItem, DdArrow} from './accessories/Dropdown';
import LinkIf from './accessories/LinkIf';
import {_isCommon} from './accessories/functions';

class MainMenu extends Component {
	constructor(){
		super();
		this.state = {
			stateOfUnfolded: [false, false, false]
		};
	}
	handleClick(which, arg){
		let dropdown = which.match(/^dropdown-([0-9])$/);
		if(dropdown){
			let index = dropdown[1], isUnfolded = arg;
			if(this.state.stateOfUnfolded[index] != isUnfolded){
				let state = [false, false, false];
				if(isUnfolded) state[index] = true;
				this.setState({stateOfUnfolded: state});
			}
		}
		else if(which == 'logout'){
			this.props.fetchData('post', '/api/logout', null, (data) => {if(data){
				this.props.setMessage('로그아웃되었습니다.', 'goToLogin');
			}});
		}
	}
	render(){
		return (
			<div className="main-menu">
				<LinkIf to="/document/new" if={_isCommon(['admin', 'write'], this.props.userRole)}>
					<i className="pe-7s-note pe-2x pe-va"></i>
				</LinkIf>
				<Dropdown className="main-menu__user" isUnfolded={this.state.stateOfUnfolded[0]} handleClick={this.handleClick.bind(this, 'dropdown-0')}>
					<DdHead>
						<i className="pe-7f-user pe-2x pe-va"></i>
						<DdArrow><i className="pe-7s-angle-down pe-va pe-2x"></i></DdArrow>
					</DdHead>
					<DdItem><Link to="/user/profile"><i className="pe-7s-user pe-2x pe-va"></i><span>내정보</span></Link></DdItem>
					<DdItem><i className="pe-7s-bookmarks pe-2x pe-va"></i><span>북마크</span></DdItem>
					<DdItem><i className="pe-7s-search pe-2x pe-va"></i><span>검색기록</span></DdItem>
					<DdItem><i className="pe-7s-file pe-2x pe-va"></i><span>내가 올린 자료</span></DdItem>
					<DdItem>
						<div onClick={this.handleClick.bind(this, 'logout')}>
							<i className="pe-7s-unlock pe-2x pe-va"></i><span>로그아웃</span>
						</div>
					</DdItem>
				</Dropdown>
				<Dropdown className="main-menu__board" isUnfolded={this.state.stateOfUnfolded[1]} handleClick={this.handleClick.bind(this, 'dropdown-1')}>
					<DdHead>
						<i className="pe-7s-note2 pe-va pe-2x"></i><span>게시판</span>
						<DdArrow><i className="pe-7s-angle-down pe-va pe-2x"></i></DdArrow>
					</DdHead>
					<DdItem><span>Q & A</span></DdItem>
					<DdItem><span>이주의 변론</span></DdItem>
					<DdItem><span>소송도우미</span></DdItem>
				</Dropdown>
				<Dropdown className="main-menu__link" isUnfolded={this.state.stateOfUnfolded[2]} handleClick={this.handleClick.bind(this, 'dropdown-2')}>
					<DdHead>
						<i className="pe-7s-star pe-va pe-2x"></i><span>바로<br/>가기</span>
						<DdArrow><i className="pe-7s-angle-down pe-va pe-2x"></i></DdArrow>
					</DdHead>
					<DdItem><span>민변</span></DdItem>
					<DdItem><span>대법원</span></DdItem>
				</Dropdown>
			</div>
		);
	}
}
MainMenu.propTypes = {
	userRole: PropTypes.array,
	fetchData: PropTypes.func
}
export default withRouter(MainMenu);
