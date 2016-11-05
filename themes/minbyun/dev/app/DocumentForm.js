import React, {Component, PropTypes} from 'react';
import axios from 'axios';
import SearchKeyword from './SearchKeyword';

class DocumentForm extends Component {
	search(fid, api, keyword){
		axios.get(this.props.apiUrl+'/'+api+keyword)
		.then(({data}) => {

		})
		.catch((error) => {
			console.error(error);
		});
	}
	handleChange(field, event){
		this.props.handleChange(field, event.target.value);
	}
	handleKeyDown(field, event){
		if(event.key === 'Enter'){
			/*
			if(field.form == 'search'){
				let searchInfo = this.props.documentFormOptions.search.find((s) => s.field == field.fid);
				this.search(field.fid, searchInfo.api, event.target.value);
			}
			*/
		}
	}
	handleSubmit(event){
		event.preventDefault();
	}
	makeFormFields(field){
		let form;
		switch(field.form){
			case 'text':
				form = <input type="text" onChange={this.handleChange.bind(this, field)} />;
				break;
			case 'search':
				//form = <SearchKeyword field={field} handleChange={this.handleChange.bind(this)} />
				form = <input type="search" onKeyDown={this.handleKeyDown.bind(this, field)} />;
				break;
			case 'file':
				form = <input type="file" />;
				break;
			case 'select':
				let options = [];
				this.props.documentFormData.taxonomy[field.cid].forEach((term) => {
					options[term.idx] = <option key={term.tid} value={term.tid}>{term.name}</option>;
				});
				form =
					<select value={this.props.document.custom[field.fid]} onChange={this.handleChange.bind(this, field)}>
						{options}
					</select>;
				break;
			case 'select_multiple':
				break;
			case 'radio':
				let radioButtons = [];
				this.props.documentFormData.taxonomy[field.cid].forEach((term) => {
					let checked = (this.props.document.custom[field.fid] == term.tid ? true : false);
					radioButtons[term.idx] = (
						<label key={term.tid}>
							<input type="radio" name={'taxonomy_'+term.cid} value={term.tid} defaultChecked={checked} />
							{term.name}
						</label>
					);
				});
				form = radioButtons;
				break;
			case 'fieldset':
				let subFormFields = [];
				this.props.documentFormData.fields.forEach((f) => {
					if(f.parent == field.fid){
						subFormFields[f.idx] = this.makeFormFields(f);
					}
				});
				form = <div className="table">{subFormFields}</div>;
				break;
			default:
				if(parseInt(field.form) || field.form == 'textarea'){
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
		this.props.documentFormData.fields.forEach((field) => {
			if(field.parent == 0){
				formFields[field.idx] = this.makeFormFields(field);
			}
		});

		return (
			<div className="document-form">
				<h1>자료 입력하기</h1>
				<form onSubmit={this.handleSubmit.bind(this)}>
					<div className="table document-form__required">
						<div className="table__row">
							<div className="table__col"></div>
							<div className="table__col">필수입력사항</div>
						</div>
						{this.makeFormFields(this.props.subjectField)}
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
	documentFormData: PropTypes.object.isRequired,
	document: PropTypes.object.isRequired,
	documentFormOptions: PropTypes.object.isRequired,
	subjectField: PropTypes.object.isRequired,
	apiUrl: PropTypes.string.isRequired,
	handleChange: PropTypes.func.isRequired
};

export default DocumentForm;
