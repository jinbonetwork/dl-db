import React, {Component, PropTypes} from 'react';
import {Table, Row, Column} from '../accessories/Table';

class UserProfile extends Component {
	render(){ console.log(this.props.userProfile);
		if(!this.props.userProfile) return null;
		return <div>user profile</div>
		/*
		return(
			<div className="user">
				<Table>
					{
						this.props.userData.user.user_name &&
						<Row>
							<Column>이름</Column>
							<Column>{this.props.userData.user.user_name}</Column>
						</Row>
					}
					{
						this.props.userData.user.class &&
						<Row>
							<Column>기수</Column>
							<Column>{this.props.userData.user.class}</Column>
						</Row>
					}
					{
						this.props.userData.user.email &&
						<Row>
							<Column>이메일</Column>
							<Column>{this.props.userData.user.email}</Column>
						</Row>
					}
					<Row>
						<Column><button type="button" onClick={this.handleClick.bind(this, 'logout')}>로그아웃</button></Column>
					</Row>
				</Table>
			</div>
		);
		*/
	}
}
UserProfile.propTypes = {
	userProfile: PropTypes.object
};

export default UserProfile;
