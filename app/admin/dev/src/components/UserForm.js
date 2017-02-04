import React, {Component, PropTypes, cloneElement} from 'react';
import {withRouter} from 'react-router';
import Form from '../accessories/docManager/Form';
import Item from '../accessories/Item';
import CheckBox from '../accessories/CheckBox';
import {makeUserFormData} from '../fieldData/userFieldData';
import update from 'react-addons-update';
import {_mapO, _wrap} from '../accessories/functions';

class UserForm extends Component {
	componentDidMount(){
		const id = this.props.params.id;
		if(id){
			if(this.props.openUsers[id]){
				this.props.onChange({mode: 'merge', value: this.props.openUsers[id]});
			} else {
				this.props.fetchUser(id, () => {
					this.props.onChange({mode: 'merge', value: this.props.openUsers[id]});
				});
			}
		} else {
			this.props.onChange({mode: 'merge', value: this.props.userFieldData.empty});
		}
		this.props.showPassword(false);
	}
	customize(){ return {
		/*
		fieldFooterBySlug: {
			name: <span>이름이름</span>
		},
		fieldFooterByType: {
			something: undefined
		},
		checkValidBySlug: {
			something: (slug, value) => {}
		},
		checkValidByType: {
			something: (slug, value) => {}
		},
		checkValidOnSubmitBySlug: {
			email: (slug, value) => {}
		},
		renderFormByType: {
			something: (slug, index, value, formElem) => {}
		},
		*/
		checkValidOnSubmitByType: {
			password: (slug, value) => {
				if(value === this.props.user.confirmPw) return true; else return false;
			}
		},
		checkHiddenBySlug: {
			password: (slug) => !this.props.isPwShown,
			confirmPw: (slug) => !this.props.isPwShown
		},
		renderFormBySlug: {
			role: (slug, index, value, formElem) => {
				let options = _mapO(this.props.userFieldData.roles, (roleCode, dispName) =>
					<Item key={roleCode} value={roleCode}><span>{dispName}</span></Item>
				);
				return cloneElement(formElem, {options});
			}
		}
	}}
	handleChange(which, arg1st, arg2nd){
		if(which == 'show password'){
			this.props.showPassword(!this.props.isPwShown);
			if(this.props.isPwShown) this.props.onChange({mode: 'merge', value: {password: '', confirmPw: ''}});
		}
	}
	handleSubmit(error){
		if(error){
			this.props.showMessage(error.message, () => this.props.setFocus(error.fSlug, error.index));
		} else {
			let formData = makeUserFormData(this.props.user, this.props.userFieldData);
			if(this.props.user.id > 0){
				this.props.submitForm(this.props.user, formData);
			} else {
				this.props.submitNewForm(this.props.user, formData,
					(userId) => this.props.onChange({mode: 'set', fSlug: 'id', value: userId})
				);
			}
		}
	}
	render(){
		let title = (this.props.user.id > 0 ? '회원정보 수정' : '회원 추가');
		let submitLabel = (this.props.user.id > 0 ? '수정' : '저장');
		let userFieldData = (this.props.user.uid > 0 || this.props.isPwShown ?
			update(this.props.userFieldData, {fProps: {email: {required: {$set: true}}}}) :
			this.props.userFieldData
		);
		let rowsBefore = (
			<tr className="form__show-password"><td colSpan="2">
				<CheckBox check={this.props.isPwShown} onChange={this.handleChange.bind(this, 'show password')} />
				<span>{(this.props.user.uid > 0 ? '비밀번호 변경' : '이용자로 등록')}</span>
			</td></tr>
		);
		return (
			<div className="user-form">
				<h1>{title}</h1>
				<table className="user-form__form-wrap"><tbody>
					<tr>
						<td className="user-form__table-margin"></td>
						<td>
							<Form
								doc={this.props.user}
								fieldData={userFieldData}
								focused={this.props.focused}
								isSaving={this.props.isSaving}
								submitLabel={submitLabel}
								rowsBefore={rowsBefore}
								onChange={this.props.onChange}
								onBlur={this.props.onBlur}
								onSubmit={this.handleSubmit.bind(this)}
								{...this.customize()}
							/>
						</td>
						<td className="user-form__table-margin"></td>
					</tr>
				</tbody></table>
			</div>
		);
	}
}
UserForm.propTypes = {
	userFieldData: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired,
	openUsers: PropTypes.object.isRequired,
	focused: PropTypes.object.isRequired,
	submitLabel: PropTypes.string,
	isSaving: PropTypes.bool,
	isPwShown: PropTypes.bool,
	fetchUser: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	setFocus: PropTypes.func.isRequired,
	onBlur: PropTypes.func.isRequired,
	showMessage: PropTypes.func.isRequired,
	submitForm: PropTypes.func.isRequired,
	submitNewForm: PropTypes.func.isRequired,
	showPassword: PropTypes.func.isRequired,
	router: PropTypes.shape({
		push: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(UserForm);
