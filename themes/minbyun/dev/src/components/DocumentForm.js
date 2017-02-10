import React, {Component, PropTypes} from 'react';
import Form from '../accessories/docManager/Form';

class DocumentForm extends Component {
	componentDidMount(){
		const id = this.props.params.id;
		if(id){/*
			if(this.props.openUsers[id]){
				this.props.onChange({mode: 'merge', value: this.props.openUsers[id]});
			} else {
				this.props.fetchUser(id, () => {
					this.props.onChange({mode: 'merge', value: this.props.openUsers[id]});
				});
			}
			*/
		} else {
			this.props.onChange({mode: 'merge', value: this.props.fData.empty});
		}
	}
	customize(){ return {
		checkHiddenBySlug: {
			trial: (slug) => {
				let doctype = this.props.fData.terms[this.props.doc.doctype].slug;
				return ((doctype == 'sentencing' || doctype == 'writing') ? false : true)
			},
			sentence: (slug) => {
				let doctype = this.props.fData.terms[this.props.doc.doctype].slug;
				return (doctype == 'sentencing' ? false : true);
			}
		},
	}}
	handleChange(which, arg1st, arg2nd){
	}
	handleSubmit(error){ /*
		if(error){
			this.props.showMessage(error.message, () => this.props.setFocus(error.fSlug, error.index));
		} else {
			//저장하는 동안 갱신된 내용이 있을 수 있기 때문에, 메타 데이터를 제외한 저장 결과를 반영해서는 안된다.
			let formData = makeUserFormData(this.props.user, this.props.userFieldData);
			this.props.submit(this.props.user, formData,
				(userId) => {
					let meta = {};
					_forIn(this.props.openUsers[userId], (fs, value) => {
						if(this.props.userFieldData.fProps[fs].type == 'meta') meta[fs] = value;
					});
					this.props.onChange({mode: 'merge', value: meta});
				}
			);
		}*/
	}
	render(){
		let title = (this.props.doc.id > 0 ? '자료 수정하기' : '자료 입력하기');
		let submitLabel = (this.props.doc.id > 0 ? '수정' : '등록');
		let rowsBeforeSlug = {
			title: <tr><td></td><td><h2>필수입력사항</h2></td></tr>,
			tag: <tr><td></td><td><h2>선택입력사항</h2></td></tr>
		};
		return (
			<div className="docform">
				<h1>{title}</h1>
				<table className="docform__form-wrap"><tbody>
					<tr>
						<td className="table-margin"></td>
						<td>
							<Form
								doc={this.props.doc}
								fieldData={this.props.fData}
								focused={this.props.focused}
								isSaving={this.props.isSaving}
								submitLabel={submitLabel}
								onChange={this.props.onChange}
								onBlur={this.props.onBlur}
								onSubmit={this.handleSubmit.bind(this)}
								rowsBeforeSlug={rowsBeforeSlug}
								{...this.customize()}
							/>
						</td>
						<td className="table-margin"></td>
					</tr>
				</tbody></table>
			</div>
		);
	}
}
DocumentForm.propTypes = {
	fData: PropTypes.object.isRequired,
	doc: PropTypes.object.isRequired,
	openDocs: PropTypes.array.isRequired,
	focused: PropTypes.object.isRequired,
	isSaving: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
	onBlur: PropTypes.func.isRequired
	/*,
	fetchDoc: PropTypes.func.isRequired,
	setFocus: PropTypes.func.isRequired,
	showMessage: PropTypes.func.isRequired,
	OnSubmit: PropTypes.func.isRequired*/
};
export default DocumentForm;
