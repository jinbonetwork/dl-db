import React, {Component, PropTypes, cloneElement} from 'react';
import {Link} from 'react-router';
import {Table, Row, Column} from './accessories/Table';

class User extends Component {
	render(){
		const child = this.props.children;
		let props;
		let classSelected = {};
		if(child){
			const path = child.props.route.path;
			switch(path){
				case 'profile':
					props = {userProfile: this.props.userProfile};
					classSelected[path] = 'user__selected';
				default:
			}
		}
		return (
			<div className="user">
				<div className="user__menu">
					<ul>
						<li className={classSelected.profile}>
							<Link to="/user/profile">
								<i className="pe-7s-user pe-va"></i>
								<span>내정보</span>
								<span><i className="pe-7s-angle-right pe-va"></i></span>
							</Link>
						</li>
						<li className={classSelected.bookmark}>
							<Link to="/user/bookmark">
								<i className="pe-7s-bookmarks pe-va"></i>
								<span>북마크</span>
								<span><i className="pe-7s-angle-right pe-va"></i></span>
							</Link>
						</li>
						<li className={classSelected.history}>
							<Link to="/user/history">
								<i className="pe-7s-search pe-va"></i>
								<span>검색기록</span>
								<span><i className="pe-7s-angle-right pe-va"></i></span>
							</Link>
						</li>
						<li className={classSelected.documents}>
							<Link to="/user/documents">
								<i className="pe-7s-file pe-va"></i>
								<span>내가 올린 자료</span>
								<span><i className="pe-7s-angle-right pe-va"></i></span>
							</Link>
						</li>
					</ul>
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
	fetchData: PropTypes.func,
	setMessage: PropTypes.func
};

export default User;
