import React, {Component, PropTypes} from 'react';
import View from '../accessories/docManager/View';
import {Link} from 'react-router';
import {_mapO, _mapAO} from '../accessories/functions';

class User extends Component {
	componentDidMount(){
		this.props.fetchUser(this.props.params.id, this.props.originalUserList);
	}
	customize(){ return {
		renderValueBySlug: {
			something: (slug, value) => {}
		},
		renderValueByType: {
			something: (slug, value) => {}
		}
	}}
	render(){
		return (
			<div className="user">
				<h1>회원정보</h1>
				<table className="user__wrap"><tbody>
					<tr>
						<td className="user__table-margin"></td>
						<td className="user__menu" colSpan="3">
							{(!this.props.user.uid) &&
							<button className="user__register-user">
								<i className="pe-7s-id pe-va"></i><span>등록</span>
							</button>}
							<Link className="user__edit-user" to={'/admin/user/'+this.props.params.id+'/edit'}>
								<i className="pe-7s-note pe-va"></i><span>수정</span>
							</Link>
							<button className="user__delete-user">
								<i className="pe-7s-delete-user pe-va"></i><span>삭제</span>
							</button>
						</td>
						<td className="user__table-margin"></td>
					</tr>
					<tr className="user__table-padding"><td></td><td colSpan="3"></td><td></td></tr>
					<tr className="user__body">
						<td className="user__table-margin"></td>
						<td className="user__table-padding"></td>
						<td><View doc={this.props.user} fieldData={this.props.userFieldData} {...this.customize()} /></td>
						<td className="user__table-padding"></td>
						<td className="user__table-margin"></td>
					</tr>
					<tr className="user__table-padding"><td></td><td colSpan="3"></td><td></td></tr>
				</tbody></table>
			</div>
		);
	}
}
User.propTypes = {
	userFieldData: PropTypes.object.isRequired,
	originalUserList: PropTypes.array.isRequired,
	user: PropTypes.object.isRequired,
	fetchUser: PropTypes.func.isRequired
};

export default User;
