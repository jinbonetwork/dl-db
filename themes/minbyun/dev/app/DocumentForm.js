import React, {Component, PropTypes} from 'react';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find() ...
import SearchBar from './SearchBar';

class DocumentForm extends Component {
	componentWillMount(){
		this.setState({
			document: this.props.document,
			files: []
		});
	}
	updateFields(fields){ if(!fields) return;
		this.setState({
			document: update(this.state.document, {
				custom: { $merge: fields}
			})
		});

		console.log(this.state.document);
	}
	handleChange(fid, event){
		if(fid == 0){
			this.setState({
				document: update(this.state.document, {
					'subject': {$set: event.target.value}
				})
			});
		} else {
			this.updateFields({['f'+fid]: event.target.value});
		}
	}
	handleSubmit(event){
		event.preventDefault();
	}
	makeFormFields(field){
		let form;
		let  value = (field.fid != 0 ? this.state.document.custom['f'+field.fid] : this.state.document.subject);
		switch(field.form){
			case 'text':
				form = <input type="text" value={value} onChange={this.handleChange.bind(this, field.fid)} />;
				break;
			case 'search':
				let searchInfo = this.props.documentFormOptions.search_in_docform.find((s) => s.field == field.fid);
				form = (
					<SearchBar value={value} field={field}
						searchApiUrl={this.props.apiUrl+'/'+searchInfo.api}
						resultMap = {searchInfo.resultmap}
						updateFields={this.updateFields.bind(this)}
					/>
				);
				break;
			case 'file':
				if(field.multiple == 1){
					form = value.map((v, i) => <input key={field.fid+'_'+i} type="file" />);
				} else {
					form = <input type="file" />;
				}
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
	apiUrl: PropTypes.string.isRequired
};

export default DocumentForm;
