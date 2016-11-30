import React, {Component, PropTypes, cloneElement} from 'react';
import {Link} from 'react-router';
import {Table, Row, Column} from './accessories/Table';
import {_userMenu} from './schema/menuSchema';

class User extends Component {
	render(){
		const child = this.props.children;
		let path, props;
		if(child){
			path = child.props.route.path;
			switch(path){
				case 'profile':
					props = {userProfile: this.props.userProfile}; break;
				case 'bookmarks':
					props = {}; break;
				case 'history':
					props = {}; break;
				case 'documents':
					props = {
						userData: this.props.userData,
						docData: this.props.docData,
						fetchData: this.props.fetchData,
						setMessage: this.props.setMessage
					}; break;
				default:
			}
		}
		let menuItems = _userMenu.map((item) => (
			<li key={item.path} className={(path == item.path ? 'user__selected' : null)}>
				<Link to={'/user/'+item.path}>
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
					{child && cloneElement(child, props)}
				</div>
			</div>
		);
	}
}
User.propTypes = {
	userData: PropTypes.object,
	userProfile: PropTypes.object,
	docData: PropTypes.object,
	fetchData: PropTypes.func,
	setMessage: PropTypes.func
};

export default User;
