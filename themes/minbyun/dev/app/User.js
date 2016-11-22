import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import axios from 'axios';
import {Table, Row, Column} from './Table';

class User extends Component {
	handleClick(which, event){
		if(which == 'logout'){
			axios.post('/api/logout').then((response) => {
				this.props.removeUserData();
				this.props.router.push('/login');
			});
		}
	}
	render(){
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
	}
}
User.propTypes = {
	userData: PropTypes.object.isRequired,
	removeUserData: PropTypes.func.isRequired
};

export default withRouter(User);
