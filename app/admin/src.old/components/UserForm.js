import React, {Component, PropTypes, cloneElement} from 'react';
import {withRouter} from 'react-router';
import Form from '../accessories/docManager/Form';
import Item from '../accessories/Item';
import {makeUserFormData} from '../fieldData/userFieldData';
import {_mapO} from '../accessories/functions';

class UserForm extends Component {
	componentDidMount(){
		if(this.props.params.id){
			this.props.fetchUser(this.props.params.id, this.props.originalUserList);
		}
	}
	customize(){ return {
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
			something: (slug, value) => {}
		},
		checkValidOnSubmitByType: {
			something: (slug, value) => {}
		},
		renderFormBySlug: {
			role: (slug, index, value, formElem) => {
				let options = _mapO(this.props.userFieldData.roles, (roleCode, dispName) =>
					<Item key={roleCode} value={roleCode}><span>{dispName}</span></Item>
				);
				return cloneElement(formElem, {options});
			}
		},
		renderFormByType: {
			something: (slug, index, value, formElem) => {}
		},
		checkHiddenBySlug: {
			something: (slug) => {}
		}
	}}
	handleSubmit(error){
		if(error){
			this.props.showMessage(error.message, () => this.props.setFocus(error.fSlug, error.index));
		} else {
			this.props.submit(
				this.props.params.id, makeUserFormData(this.props.user, this.props.userFieldData),
				() => {
					this.props.router.push('/admin/user/'+this.props.params.id);
				}
			);
		}
	}
	render(){
		let title = (this.props.params.id ? '회원정보 수정' : '회원추가')
		let submitLabel = (this.props.params.id ? '수정' : '저장');
		return (
			<div className="user-form">
				<h1>{title}</h1>
				<table className="user-form__form-wrap"><tbody>
					<tr>
						<td className="user-form__table-margin"></td>
						<td>
							<Form
								doc={this.props.user}
								fieldData={this.props.userFieldData}
								focused={this.props.focused}
								submitLabel={submitLabel}
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
	user: PropTypes.object.isRequired,
	userFieldData: PropTypes.object.isRequired,
	originalUserList: PropTypes.array.isRequired,
	focused: PropTypes.object.isRequired,
	submitLabel: PropTypes.string,
	fetchUser: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	setFocus: PropTypes.func.isRequired,
	onBlur: PropTypes.func.isRequired,
	showMessage: PropTypes.func.isRequired,
	submit: PropTypes.func.isRequired,
	formData: PropTypes.object,
	router: PropTypes.shape({
		push: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(UserForm);
