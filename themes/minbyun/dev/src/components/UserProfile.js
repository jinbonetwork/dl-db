import React, {Component, PropTypes} from 'react';
import Form from '../accessories/docManager/Form';
import Item from '../accessories/Item';
import CheckBox from '../accessories/CheckBox';
import Check from '../accessories/Check';
import {makeUserFormData} from '../fieldData/userFieldData';
import {SCREEN, ROLE_MAP} from '../constants';
import {_isEmpty, _wrap} from '../accessories/functions';

class UserProfile extends Component {
	componentDidMount(){
		this.props.initialize();
		if(_isEmpty(this.props.openProfile)) this.props.fetchUserProfile();
		else this.props.onChange({mode: 'merge', value: this.props.openProfile});
	}
	customize(){ return {
		checkValidOnSubmitBySlug: {
			confirmPw: (slug, value) => {
				if(value == this.props.profile.password) return true; else return false;
			}
		},
		errorMessageBySlug: {
			confirmPw: '비밀번호를 다시 확인하세요'
		},
		checkHiddenBySlug: {
			password: (slug) => !this.props.isPwShown,
			confirmPw: (slug) => !this.props.isPwShown,
			name: (slug) => this.props.isPwShown,
			class: (slug) => this.props.isPwShown,
			email: (slug) => this.props.isPwShown,
			phone: (slug) => this.props.isPwShown,
			committee: (slug) => this.props.isPwShown
		},
		/*
		beforeSubmitBtn: (
			<Check selected={(this.props.isPwShown ? ['checked'] : [])} onChange={this.handleChange.bind(this, 'show password')}
				checkIcon={<i className="pe-7f-check pe-va"></i>} uncheckIcon={<i className="pe-7s-check pe-va"></i>}
			>
				<Item value="checked">비밀번호 변경</Item>
			</Check>
		),
		*/
		rowsBefore: _wrap(() => {
			let classNames = [], handleClicks = [];
			if(this.props.isPwShown){
				classNames[1] = 'form__menu-item--selected'; handleClicks[0] = this.props.togglePassWordForm;
			} else {
				classNames[0] = 'form__menu-item--selected';
				handleClicks[1] = () => {
					this.props.onChange({mode: 'merge', value: this.props.openProfile});
					this.props.togglePassWordForm();
				}
			}
			return (
				<tr className="form__menu"><td colSpan="2">
					<a className={classNames[0]} onClick={handleClicks[0]}>회원정보</a>
					<a className={classNames[1]} onClick={handleClicks[1]}>비밀번호</a>
				</td></tr>
			);
		}),
		rowsAfter: _wrap(() => {
			if(!this.props.isPwShown){
				return (this.props.window.width > SCREEN.small ?
					<tr key="role" className="form__field form__role">
						<td className="form__col0">권한</td>
						<td className="form__col1">{(this.props.role && this.props.role.length && this.props.role[0] != 'authenticated') ? this.props.role.map((r) => ROLE_MAP[r]).join(', ') : '권한없음'}</td>
					</tr> :
					<tr className="form__field form__role"><td>
						<div className="form__col0">권한</div>
						<div className="form__col1">{(this.props.role && this.props.role.length && this.props.role[0] != 'authenticated') ? this.props.role.map((r) => ROLE_MAP[r]).join(', ') : '권한없음'}</div>
					</td></tr>
				);
			} else {
				return null;
			}
		})
	}}
	handleSubmit(error){
		if(error){
			this.props.showMessage({content: error.message, callback: () => this.props.focusIn(error)});
		} else {
			//저장하는 동안 갱신된 내용이 있을 수 있기 때문에, 메타 데이터를 제외한 저장 결과를 반영해서는 안된다.
			let oldProfile = this.props.oldProfile;
			let pfFormData = makeUserFormData(this.props.profile, this.props.fData);
			this.props.onSubmit({
				oldProfile, pfFormData,
				afterSave: () => this.props.showMessage({content: '수정되었습니다', mode: 'fadeout'})
			});
		}
	}
	render(){
		return (
			<div className="user-profile">
				<table className="user-profile__form-wrap"><tbody>
					<tr>
						<td className="user-profile__table-margin"></td>
						<td>
							<Form
								doc={this.props.profile}
								fieldData={this.props.fData}
								focused={this.props.focused}
								isSaving={this.props.isSaving}
								submitLabel={(this.props.isPwShown ? '비밀번호 수정' : '회원정보 수정')}
								submitSavingLabel="수정 중"
								window={this.props.window}
								widthToChangeOneCol={SCREEN.small}
								onChange={this.props.onChange}
								onBlur={this.props.onBlur}
								onSubmit={this.handleSubmit.bind(this)}
								{...this.customize()}
							/>
						</td>
						<td className="user-profile__table-margin"></td>
					</tr>
				</tbody></table>
			</div>
		);
	}
}
UserProfile.propTypes = {
	fData: PropTypes.object.isRequired,
	profile: PropTypes.object.isRequired,
	openProfile: PropTypes.object.isRequired,
	focused: PropTypes.object.isRequired,
	isSaving: PropTypes.bool,
	isPwShown: PropTypes.bool,
	window: PropTypes.object.isRequired,
	initialize: PropTypes.func.isRequired,
	fetchUserProfile: PropTypes.func.isRequired,
	focusIn: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	onBlur: PropTypes.func.isRequired,
	showMessage: PropTypes.func.isRequired,
	togglePassWordForm: PropTypes.func.isRequired
}

export default UserProfile;
