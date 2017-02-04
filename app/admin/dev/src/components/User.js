import React, {Component, PropTypes} from 'react';
import View from '../accessories/docManager/View';
import {Link} from 'react-router';
import {_mapO, _mapAO} from '../accessories/functions';

class User extends Component {
	componentDidMount(){
		if(!this.props.openUsers[this.props.params.id]){
			this.props.fetchUser(this.props.params.id);
		}
	}
	handleClick(which){
		switch(which){
			case 'delete user':
				if(!this.props.isDelBtnYesOrNo){
					this.props.onChange('isDelBtnYesOrNo', true); break;
				} else {
					break;
				}
			case 'cancel deleting user':
				this.props.onChange('isDelBtnYesOrNo', false); break;
			default:
		}
	}
	customize(){ return {/*
		renderValueBySlug: {
			something: (slug, value) => {}
		},
		renderValueByType: {
			something: (slug, value) => {}
		},*/
		checkHiddenBySlug: {
			password: (slug, value) => true,
			confirmPw: (slug, value) => true,
		}
	}}
	getUser(){
		return (this.props.openUsers[this.props.params.id] ?
			this.props.openUsers[this.props.params.id] : this.props.userFieldData.empty
		);
	}
	render(){
		const user = this.getUser();
		const deletButton = (!this.props.isDelBtnYesOrNo ?
			<button className="user__delete-user" onClick={this.handleClick.bind(this, 'delete user')}>
				<i className="pe-7s-delete-user pe-va"></i><span>삭제</span>
			</button> :
			<div className="user__confirm-del">
				<button onClick={this.handleClick.bind(this, 'delete user')}>예</button>
				<button onClick={this.handleClick.bind(this, 'cancel deleting user')}>아니오</button>
			</div>
		);
		const rowsBefore = (user.uid > 0 ? null : <tr><td>등록여부</td><td>미등록</td></tr>);
		return (
			<div className="user">
				<h1>회원정보</h1>
				<table className="user__wrap"><tbody>
					<tr>
						<td className="user__table-margin"></td>
						<td className="user__menu" colSpan="3">
							{/*(!user.uid) &&
							<button className="user__register-user">
								<i className="pe-7s-id pe-va"></i><span>등록</span>
							</button>*/}
							<Link className="user__edit-user" to={'/admin/user/'+this.props.params.id+'/edit'}>
								<i className="pe-7s-note pe-va"></i><span>수정</span>
							</Link>
							{deletButton}
						</td>
						<td className="user__table-margin"></td>
					</tr>
					<tr className="user__table-padding"><td></td><td colSpan="3"></td><td></td></tr>
					<tr className="user__body">
						<td className="user__table-margin"></td>
						<td className="user__table-padding"></td>
						<td>
							<View doc={user} fieldData={this.props.userFieldData} {...this.customize()} rowsBefore={rowsBefore} />
						</td>
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
	openUsers: PropTypes.object.isRequired,
	isDelBtnYesOrNo: PropTypes.bool,
	fetchUser: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired
};

export default User;
