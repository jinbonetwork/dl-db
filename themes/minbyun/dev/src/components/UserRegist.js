import React, {Component, PropTypes} from 'react';
import {Link, withRouter} from 'react-router';
import Form from '../accessories/docManager/Form';
import Item from '../accessories/Item';
import CheckBox from '../accessories/CheckBox';
import Check from '../accessories/Check';
import {makeUserFormData} from '../fieldData/userFieldData';
import {SCREEN, ROLE_MAP} from '../constants';
import {_interpolate} from '../accessories/functions';
import {_isEmpty, _wrap} from '../accessories/functions';

const pathOfImage = site_base_uri+'/themes/minbyun/images';

class UserRegist extends Component {
	componentDidMount(){
		this.props.initialize();
		this.props.fetchForm();
		this.props.onChange({mode: 'merge', value: this.props.profile});
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
					<span className="form_menu_title">회원 가입하기</span>
					<p className="form__intro">이 사이트는 민변회원 전용 사이트입니다. 민변회원임을 확인할 수 있도록, 정확한 정보를 입력해주세요. 회원가입 신청후, 인증메일을 통해 인증해십시오. 이후 운영자가 확인을 거쳐 최종 사용권한을 부여해 드립니다.</p>
				</td></tr>
			);
		}),
		rowsAfter: _wrap(() => {
			return (this.props.window.width > SCREEN.small ?
				<tr key="role" className="form__field form__role">
					<td className="form__col0">권한</td>
					<td className="form__col1">가입후 운영자가 확인후 권한을 부여합니다.</td>
				</tr> :
				<tr className="form__field form__role"><td>
					<div className="form__col0">권한</div>
					<div className="form__col1">가입후 운영자가 확인후 권한을 부여합니다.</div>
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
			this.props.onSubmit({
				pfFormData,
				afterSave: () => this.props.showMessage({content: '아이디 개설 인증 메일이 발송되었습니다. 수신한 메일을 통해 인증을 완료해주십시오.', mode: 'fadeout'})
			});
		}
	}
	propsForResponsivity(){
		const window = this.props.window;
		return {
			style: {
				title0: {
					fontSize: _interpolate(window.width, 24, 28.8, 320, 500),
					textAlign: 'left'
				},
				title1: {
					fontSize: _interpolate(window.width, 28.8, 57.6, 320, 500),
					textAlign: 'left'
				}
			},
		};
	}
	render(){
		const prsRsp = this.propsForResponsivity();
		return (
			<div className="user-regist">
				<div className="regist__innerwrap">
					<div className="regist__header">
						<img src={pathOfImage+'/logo.svg'} />
						<div className="regist__title">
							<span style={prsRsp.style.title0}>민주사회를 위한 변호사모임</span>
							<span style={prsRsp.style.title1}>디지털 도서관</span>
						</div>
					</div>
					<div className="regist__body">
						<div className="user-profile">
							<table className="user-profile__form-wrap"><tbody>
								<tr>
									<td className="user-profile__table-margin"></td>
									<td>
									{!this.props.isComplete && this.props.fData && (
										<Form
											doc={this.props.profile}
											fieldData={this.props.fData}
											focused={this.props.focused}
											isSaving={this.props.isSaving}
											submitLabel={'회원 가입'}
											submitSavingLabel="가입신청 중"
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
											<p>그리고, 입력하신 이메일로 인증메일이 발송되었습니다. 인증메일을 통해 인증작업을 마무리 해주세요.</p>
											<p>운영자가 확인해, 서비스가 활성화되는데 시간이 걸릴 수 있습니다.</p>
											<p><Link to="/">확인</Link></p>
										</div>
									)}
									</td>
									<td className="user-profile__table-margin"></td>
								</tr>
							</tbody></table>
						</div>
					</div>
					<div className="regist__links">
						<div className="regist__links-content">
							<div>
								<div><span>Powered by </span><a href="http://jinbo.net" target="_blank">진보넷</a></div>              
								<div>
									<span>디지털 아카이브 프로젝트 </span>
									<a href="http://github.com/jinbonetwork" target="_blank">
										<img src={pathOfImage+'/github.png'}/>
									</a>
								</div>
							</div>
							<div><img src={pathOfImage+'/archive.png'} /></div>
						</div>
					</div>
				</div>
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
	fetchForm: PropTypes.func.isRequired,
	focusIn: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	onBlur: PropTypes.func.isRequired,
	showMessage: PropTypes.func.isRequired
}

export default UserRegist;
