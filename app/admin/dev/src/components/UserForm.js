import React, {Component, PropTypes, cloneElement} from 'react';
import {withRouter} from 'react-router';
import Form from '../accessories/docManager/Form';
import Item from '../accessories/Item';
import {makeUserFormData} from '../fieldData/userFieldData';
import update from 'react-addons-update';
import {_mapO} from '../accessories/functions';

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
			something: (slug, value) => {}
		},
		checkValidOnSubmitByType: {
			something: (slug, value) => {}
		},
		renderFormByType: {
			something: (slug, index, value, formElem) => {}
		},
		checkHiddenBySlug: {
			something: (slug) => {}
		},
		*/
		renderFormBySlug: {
			role: (slug, index, value, formElem) => {
				let options = _mapO(this.props.userFieldData.roles, (roleCode, dispName) =>
					<Item key={roleCode} value={roleCode}><span>{dispName}</span></Item>
				);
				return cloneElement(formElem, {options});
			}
		}
	}}
	handleSubmit(error){
		if(error){
			this.props.showMessage(error.message, () => this.props.setFocus(error.fSlug, error.index));
		} else {
			const formData = makeUserFormData(this.props.user, this.props.userFieldData);
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
		let title = (this.props.user.id > 0 ? '회원정보 수정' : '회원추가');
		let submitLabel = (this.props.user.id > 0 ? '수정' : '저장');
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
								isSaving={this.props.isSaving}
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
	userFieldData: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired,
	openUsers: PropTypes.object.isRequired,
	focused: PropTypes.object.isRequired,
	submitLabel: PropTypes.string,
	isSaving: PropTypes.bool,
	fetchUser: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	setFocus: PropTypes.func.isRequired,
	onBlur: PropTypes.func.isRequired,
	showMessage: PropTypes.func.isRequired,
	submitForm: PropTypes.func.isRequired,
	submitNewForm: PropTypes.func.isRequired,
	formData: PropTypes.object,
	router: PropTypes.shape({
		push: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(UserForm);
