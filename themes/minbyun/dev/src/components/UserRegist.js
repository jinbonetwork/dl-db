import React, {Component, PropTypes} from 'react';
import Form from '../accessories/docManager/Form';
import Item from '../accessories/Item';
import CheckBox from '../accessories/CheckBox';
import Check from '../accessories/Check';
import {makeUserFormData} from '../fieldData/userFieldData';
import {SCREEN, ROLE_MAP} from '../constants';
import {_isEmpty, _wrap} from '../accessories/functions';

class UserRegist extends Component {
	componentDidMount(){
		this.props.initialize();
		this.props.onChange({mode: 'merge', value: this.props.userFieldData.empty});
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
			return (
				<tr className="form__menu"><td colSpan="2">
					<span>회원 신청하기</span>
					<a className="goback" onClick={this.props.router.goBack}>
						<i className="pe-7f-back pe-va"></i><span>이전 페이지로</span>
					</a>
				</td></tr>
			);
		}),
		rowsAfter: _wrap(() => {
			return (this.props.window.width > SCREEN.small ?
				<tr key="role" className="form__field form__role">
					<td className="form__col0">권한</td>
					<td className="form__col1">{this.props.role.map((r) => ROLE_MAP[r]).join(', ')}</td>
				</tr> :
				<tr className="form__field form__role"><td>
					<div className="form__col0">권한</div>
					<div className="form__col1">{this.props.role.map((r) => ROLE_MAP[r]).join(', ')}</div>
				</td></tr>
			);
		})
	}}
	handleSubmit(error){
		if(error){
			this.props.showMessage({content: error.message, callback: () => this.props.focusIn(error)});
		} else {
			//저장하는 동안 갱신된 내용이 있을 수 있기 때문에, 메타 데이터를 제외한 저장 결과를 반영해서는 안된다.
			let pfFormData = makeUserFormData(this.props.profile, this.props.fData);
			/*this.props.onSubmit({
				pfFormData,
				afterSave: () => this.props.showMessage({content: '아이디 개설 인증 메일이 발송되었습니다. 수신한 메일을 통해 인증을 완료해주십시오.', mode: 'fadeout'})
			}); */
		}
	}
	render(){
		return (
			<div className="user-profile">
				<table className="user-profile__form-wrap"><tbody>
					<tr>
						<td className="user-profile__table-margin"></td>
						<td>
						{!this.props.isComplete && (
							<Form
								doc={this.props.userFieldData.empty}
								fieldData={this.props.fData}
								focused={this.props.focused}
								isSaving={this.props.isSaving}
								submitLabel={'회원 가입'}
								submitSavingLabel="신청 중"
								window={this.props.window}
								widthToChangeOneCol={SCREEN.small}
								onChange={this.props.onChange}
								onBlur={this.props.onBlur}
								onSubmit={this.handleSubmit.bind(this)}
								{...this.customize()}
							/>
						)}
						{this.props.isComplete && (
							<div className="user-profile-regist-complte">
								<p>아이디 개설 신청이 완료되었습니다.</p>
								<p>그리고, 인증메일이 발송되었습니다. 인증메일을 통해 인증작업을 마무리 하셔야, 이용하실수 있습니다.</p>
								<p><Link target="/">확인</Link></p>
							</div>
						)}
						</td>
						<td className="user-profile__table-margin"></td>
					</tr>
				</tbody></table>
			</div>
		);
	}
}
UserRegist.propTypes = {
	fData: PropTypes.object.isRequired,
	profile: PropTypes.object.isRequired,
	focused: PropTypes.object.isRequired,
	isSaving: PropTypes.bool,
	isComplte: PropTypes.bool,
	window: PropTypes.object.isRequired,
	initialize: PropTypes.func.isRequired,
	focusIn: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	onBlur: PropTypes.func.isRequired,
	showMessage: PropTypes.func.isRequired
}

export default UserRegist;
