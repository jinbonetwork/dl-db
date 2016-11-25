import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import {Table, Row, Column} from './accessories/Table';

class User extends Component {
	handleClick(which, event){
		if(which == 'logout'){
			this.props.fetchData('post', '/api/logout', null, (data) => {if(data){ console.log(data);
				this.props.setMessage('로그아웃되었습니다.', 'goToLogin');
			}});
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
	fetchData: PropTypes.func.isRequired,
	setMessage: PropTypes.func.isRequired
};

export default withRouter(User);
