import React, {Component, PropTypes} from 'react';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find() ...
import SearchBar from './SearchBar';

class DocumentForm extends Component {
	componentWillMount(){
		this.setState(this.props.document);
	}
	updateFields(fields){ if(!fields) return;
		this.setState(update(this.state, {
			custom: { $merge: fields}
		}));
	}
	defaultTaxonomyTerm(cid){
		let minIdx = -1;
		let firstTermId;
		this.props.documentFormData.taxonomy[cid].forEach((term) => {
			if(minIdx < 0){
				minIdx = term.idx; firstTermId = term.tid;
			} else if(minIdx > 0 && term.idx < minIdx){
				minIdx = term.idx; firstTermId = term.tid;
			}
		});
		return firstTermId;
	}
	handleChange(field, index, event){
		let value = (field.form != 'file' ? event.target.value : event.target.files[0]);
		if(field.fid > 0){
			if(index === undefined){
				this.setState(update(this.state, { custom: {
					['f'+field.fid]: {$set: value}
				}}));
			} else {
				this.setState(update(this.state, { custom: {
					['f'+field.fid]: {
						[index]: {$set: value}
					}
				}}));
			}
		} else {
			this.setState(update(this.state, {
				'subject': {$set: value}
			}));
		}
	}
	handleSubmit(event){
		event.preventDefault();
		console.log(this.state.custom);
	}
	handleClickToAddInputForm(field){
		let value = '';
		switch(field.type){
			case 'taxonomy':
				value = this.defaultTaxonomyTerm(field.cid); break;
			case 'date':
				value = '0'; break;
			case 'image': case 'file':
				value = {}; break;
			default:
				value = '';
		}
		this.setState(update(this.state, {
			custom: {['f'+field.fid]: {$push: [value]}}
		}));
	}
	inputForm(field, value, index){
		switch(field.form){
			case 'text':
				return <input type="text" value={value} onChange={this.handleChange.bind(this, field, index)} />;
			case 'search':
				let searchInfo = this.props.documentFormOptions.search_in_docform.find((s) => s.field == field.fid);
				return (
					<SearchBar value={value} field={field} index={index}
						searchApiUrl={this.props.apiUrl+'/'+searchInfo.api}
						resultMap = {searchInfo.resultmap}
						updateFields={this.updateFields.bind(this)}
						handleChange={this.handleChange.bind(this)}
					/>
				);
			case 'file':
				let accept = (field.type == 'file' ? '.pdf, .hwp, .doc, .docx' : '.jpg, .png');
				return (
					<div className="inputform__file">
						<input type="text" value={value.name || value.filename} />
						<label className="button">
							<span>찾기</span>
							<input style={{display: 'none'}} type="file" accept={accept} onChange={this.handleChange.bind(this, field, index)} />
						</label>
						<div>* 파일형식: {accept}</div>
					</div>
				);
			case 'select':
				let options = [];
				this.props.documentFormData.taxonomy[field.cid].forEach((term) => {
					options[term.idx] = <option key={term.tid} value={term.name}>{term.name}</option>;
				});
				return (
					<select value={value} onChange={this.handleChange.bind(this, field, index)}>
						{options}
					</select>
				);
			case 'radio':
				let radioButtons = [];
				this.props.documentFormData.taxonomy[field.cid].forEach((term) => {
					let checked = (value == term.name ? true : false);
					radioButtons[term.idx] = (
						<label key={term.tid}>
							<input type="radio" name={'taxonomy_'+term.cid} value={term.name} defaultChecked={checked} onChange={this.handleChange.bind(this, field, index)} />
							{term.name}
						</label>
					);
				});
				return radioButtons;
			case 'fieldset':
				let subFormFields = [];
				this.props.documentFormData.fields.forEach((f) => {
					if(f.parent == field.fid){
						subFormFields[f.idx] = this.formRow(f);
					}
				});
				return <div className="table">{subFormFields}</div>;
			default:
				if(parseInt(field.form) || field.form == 'textarea'){
					let maxLength = (field.form > 0 ? field.form : null);
					return <textarea maxLength={maxLength} />;
				}
		}
	}
	formRow(field){
		let inputForms;
		let value = (field.fid != 0 ? this.state.custom['f'+field.fid] : this.state.subject);
		if(field.multiple == '1'){
			inputForms = value.map((v, i) =>
				<div key={i} className="table__row">
					<div className="table__col">
						{this.inputForm(field, v, i)}
					</div>
					<div className="table__col">
						<span className="button" onClick={this.handleClickToAddInputForm.bind(this, field)}>추가</span>
					</div>
				</div>
			);
		} else {
			inputForms = this.inputForm(field, value);
		}
		return (
			<div key={field.fid} className="table__row">
				<div className="table__col">{field.subject}</div>
				<div className="table__col">
					{inputForms}
				</div>
			</div>
		);
	}
	render(){
		let formRows = [];
		this.props.documentFormData.fields.forEach((field) => {
			if(field.parent == 0){
				formRows[field.idx] = this.formRow(field);
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
						{this.formRow(this.props.subjectField)}
						{formRows}
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
	openedDocuments: PropTypes.array
};

export default DocumentForm;
