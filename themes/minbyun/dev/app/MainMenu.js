import React, {Component, PropTypes} from 'react';
import {Dropdown, DdHead, DdItem} from './accessories/Dropdown';

class MainMenu extends Component {
	render(){
		return (
			<Dropdown>
				<DdHead><i className="pe-7f-user pe-2x pe-va"></i></DdHead>
				<DdItem><span>내정보</span></DdItem>
				<DdItem><span>북마크</span></DdItem>
				<DdItem><span>검색기록</span></DdItem>
				<DdItem><span>내가 올린 자료</span></DdItem>
				<DdItem><span>로그아웃</span></DdItem>
			</Dropdown>
		);
	}
}

export default MainMenu;
