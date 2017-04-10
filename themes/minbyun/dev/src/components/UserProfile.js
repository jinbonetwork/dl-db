import React, {Component, PropTypes} from 'react';
import Form from '../accessories/docManager/Form';
import Item from '../accessories/Item';
import CheckBox from '../accessories/CheckBox';
import Check from '../accessories/Check';
import {makeUserFormData} from '../fieldData/userFieldData';
import {SCREEN, ROLE_MAP} from '../constants';
import {_isEmpty} from '../accessories/functions';

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
			confirmPw: (slug) => !this.props.isPwShown
		},
		/*beforeSubmitBtn: (
			<Check selected={(this.props.isPwShown ? ['checked'] : [])} onChange={this.handleChange.bind(this, 'show password')}
				checkIcon={<i className="pe-7f-check pe-va"></i>} uncheckIcon={<i className="pe-7s-check pe-va"></i>}
			>
				<Item value="checked">비밀번호 변경</Item>
			</Check>
		),
		afterSubmitBtn: (
			<p>※ '회원정보 변경'을 클릭해야 변경한 정보가 저장됩니다.</p>
		),*/
		rowsAfter: (this.props.window.width > SCREEN.small ?
			[
				<tr key="pw" className="form__field form__role">
					<td className="form__col0">비밀번호</td>
					<td className="form__col1">비밀번호를 변경하시려면 <span style={{display: 'inline-block', backgroundColor: '#989cff', color: '#fff', padding: '0.5em 0.5em'}}>여기를 클릭하세요</span></td>
				</tr>,
				<tr key="role" className="form__field form__role">
					<td className="form__col0">권한</td>
					<td className="form__col1">{this.props.role.map((r) => ROLE_MAP[r]).join(', ')}</td>
				</tr>
			] :
			[
				<tr className="form__field form__role"><td>
					<div className="form__col0">권한</div>
					<div className="form__col1">{this.props.role.map((r) => ROLE_MAP[r]).join(', ')}</div>
				</td></tr>
			]
		)
	}}
	handleChange(which, arg1st, arg2nd){
		if(which == 'show password'){
			this.props.togglePassWordForm();
		}
	}
	handleSubmit(error){
		if(error){
			this.props.showMessage(error.message, () => this.props.focusIn(error));
		} else {
			//저장하는 동안 갱신된 내용이 있을 수 있기 때문에, 메타 데이터를 제외한 저장 결과를 반영해서는 안된다.
			let oldProfile = this.props.oldProfile;
			let pfFormData = makeUserFormData(this.props.profile, this.props.fData);
			this.props.onSubmit({oldProfile, pfFormData});
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
								submitLabel="회원정보 변경"
								submitSavingLabel="변경 중"
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
	onChange: PropTypes.func.isRequired,
	onBlur: PropTypes.func.isRequired,
	showMessage: PropTypes.func.isRequired,
	togglePassWordForm: PropTypes.func.isRequired
}

export default UserProfile;
