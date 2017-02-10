import React, {Component, PropTypes} from 'react';
import {Table, Row, Column} from '../accessories/Table';
import {_usFdAttrs} from '../schema/userSchema';

class UserProfile extends Component {
	render(){
		let rows = [];
		for(let fn in this.props.userProfile.profile){
			let value = this.props.userProfile.profile[fn];
			rows.push(
				<Row key={fn}>
					<Column><span>{_usFdAttrs[fn].displayName}</span></Column>
					<Column>{(value ? <span>{value}</span> : <span>&nbsp;</span>)}</Column>
				</Row>
			);
		}
		return (
			<div className="user-profile">
				<Table>{rows}</Table>
			</div>
		);
	}
}
UserProfile.propTypes = {
	userProfile: PropTypes.object
};

export default UserProfile;
