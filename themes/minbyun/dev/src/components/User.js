import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {USER_MENU} from '../constants';

class User extends Component {
	render(){
		const menuItems = USER_MENU.map((item) => item.path.match('/user/') && (
			<li key={item.path} className={(this.props.location.pathname.match(item.path) ? 'user__selected' : null)}>
				<Link to={item.path}>
					<i className={item.icon+' pe-va'}></i>
					<span>{item.name}</span>
					<span><i className="pe-7s-angle-right pe-va"></i></span>
				</Link>
			</li>
		));
		return (
			<div className="user">
				<div className="user__menu">
					<ul>{menuItems}</ul>
				</div>
				<div className="user__content">
					{this.props.children}
				</div>
			</div>
		);
	}
}

export default User;
