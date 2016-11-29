import React, {Component, PropTypes, cloneElement} from 'react';
import {withRouter} from 'react-router';
import {Table, Row, Column} from './accessories/Table';

class User extends Component {
	render(){
		const child = this.props.children;
		let props;
		if(child){
			switch(child.props.route.path){
				case 'profile':
					props = {userProfile: this.props.userProfile};
				default:
			}
		}
		return (
			<div className="user">
				{child && cloneElement(child, props)}
			</div>
		);
	}
}
User.propTypes = {
	userData: PropTypes.object.isRequired,
	userProfile: PropTypes.object,
	fetchData: PropTypes.func.isRequired,
	setMessage: PropTypes.func.isRequired
};

export default withRouter(User);
