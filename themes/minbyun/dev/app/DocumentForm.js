import React, {Component, PropTypes} from 'react';

class DocumentForm extends Component {
	handleChange(field, event){
		this.props.handleChange(field,  event.target.value);
	}
	makeFormFields(field, fieldArrayIndex){
		let form;
		switch(field.form){
			case 'text':
				form = <input type="text" onChange={this.handleChange.bind(this, field)} />;
				break;
			case 'textarea':
				form = <textarea />;
				break;
			case 'file':
				form = <input type="file" />;
				break;
			case 'select':
				let options = [];
				this.props.documentFormData.taxonomy_terms.forEach((term) => {
					if(term.cid == field.cid){
						options[term.idx] = <option key={term.tid} value={term.tid}>{term.name}</option>;
					}
				});
				form = <select onChange={this.handleChange.bind(this, field)}>{options}</select>;
				break;
			case 'radio':
				let radioButtons = [];
				this.props.documentFormData.taxonomy_terms.forEach((term) => {
					if(term.cid == field.cid){
						radioButtons[term.idx] = (
							<label key={term.tid}>
								<input type="radio" name={'taxonomy_'+term.cid} value={term.tid} />
								{term.name}
							</label>
						);
					}
				});
				form = radioButtons;
				break;
			case 'fieldset':
				let subFormFields = [];
				this.props.documentFormData.fields.forEach((f) => {
					if(f.parent == field.fid && f.active == 1){
						subFormFields[f.idx] = this.makeFormFields(f);
					}
				});
				form = <div className="table">{subFormFields}</div>;
				break;
			default:
				if(parseInt(field.form)){
					let maxLength = (field.form > 0 ? field.form : null);
					form = <textarea maxLength={maxLength} />;
				}
		}
		return (
			<div key={field.fid} className="table__row">
				<div className="table__col">{field.subject}</div>
				<div className="table__col">
					{form}
				</div>
			</div>
		);
	}
	render(){
		let formFields = [];
		if(this.props.documentFormData){
			this.props.documentFormData.fields.forEach((field) => {
				if(field.parent == 0 && field.active == 1){
					formFields[field.idx] = this.makeFormFields(field);
				}
			});
		}
		return (
			<div className="document-form">
				<h1>자료 입력하기</h1>
				<form>
					<div className="table document-form__required">
						<div className="table__row">
							<div className="table__col"></div>
							<div className="table__col">필수입력사항</div>
						</div>
						<div className="table__row">
							<div className="table__col">제목</div>
							<div className="table__col">
								<input type="text" name="title" />
							</div>
						</div>
						{formFields}
					</div>
					<div className="document-form__elective">

					</div>
					<button type="submit">{this.props.submitLabel}</button>
				</form>
			</div>
		);
	}
}
DocumentForm.propTypes = {
	submitLabel: PropTypes.string.isRequired,
	documentFormData: PropTypes.objectOf(PropTypes.array),
	document: PropTypes.object.isRequired,
	handleChange: PropTypes.func.isRequired
};

export default DocumentForm;
