import React, {Component, PropTypes} from 'react';
import Item from '../accessories/Item';
import {Link, withRouter} from 'react-router';
import {SCREEN, MAIN_MENU} from '../constants';

class Footer extends Component {
	menuItems(name, data) {
		return data.items.map((item, index) => {
			return (
				<li key={index}>
					<a href={item.url}><span>{item.displayName}</span></a>
				</li>
			);
		});
	}
	bottomMenu() {
/*		let items = MAIN_MENU.map((item) => {
			const menus = (item.name == 'board' ?  <ul>{this.menuItems(item.name, this.props.menuData[0])}</ul> : '');
			return menus;
		}); */
		let items = '';
		return (
			<div>
				{items}
			</div>
		);
	}
	render() {
		const menu = bottomMenu();
		return (
			<div className="global_bottom">
				<ul>
					<li><a href=''></a></li>
				</ul>
			</div>
		);
	}
}
Footer.propTypes = {
	menuData: PropTypes.array.isRequired,
	window: PropTypes.object.isRequired,
}
export default Footer;
