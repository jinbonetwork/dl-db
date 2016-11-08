import React, {Component, PropTypes} from 'react';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find() ...
import axios from 'axios';

import SearchBar from './SearchBar';
import Textarea from './Textarea';
import DateForm from './DateForm';

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
	updateSingleField(field, index, value){
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
				[field.fid]: {$set: value}
			}));
		}
	}
	handleChange(field, index, event){
		let value = (field.form != 'file' ? event.target.value : event.target.files[0]);
		this.updateSingleField(field, index, value);
	}
	isEmailValid(email){
		email = email.trim();
		let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}
	isPhoneValid(phone){
		phone = phone.trim();
		let re = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1}|)-?[0-9]{3,4}-?[0-9]{4}$/;
		return re.test(phone);
	}
	isEmpty(value){
		if(!value) return true;
		if(typeof value === 'object'){
			for(let k in value){
				if(!value[k]) return true;
			}
		}
		return false;
	}
	isDateValid(value, form){
		let date = new Date();
		if(form == 'Ym'){
			if(1970 <= value.year && value.year <= date.getFullYear() && 1 <= value.month && value.month <= 12 ){
				return true;
			} else {
				return false;
			}
		} else {
			return true;
		}
	}
	valdationCheck(){
		for(let i in this.props.documentFormData.fields){
			let f = this.props.documentFormData.fields[i];

			let value = (f.fid > 0 ? this.state.custom['f'+f.fid] : this.state[f.fid]);
			if(f.required == '1' && f.type != 'group' && this.isEmpty(value) && !this.isFieldHidden(f) && !this.isFieldHidden(f.parent)){
				return {fid: f.fid, message: f.subject+'를(을) 입력하세요.'};
			}
			if((f.type == 'email' && !this.isEmailValid(value)) || (f.type == 'phone' && !this.isPhoneValid(value)) || (f.type == "date" && !this.isDateValid(value, f.form))){
				return {fid: f.fid, message: f.subject+'의 형식이 적합하지 않습니다.'};
			}
			if(f.type == 'taxonomy'){
				let term = this.props.documentFormData.taxonomy[f.cid].find((t) => t.tid == value);
				if(!term) return {fid: f.fid, message: f.subject+'가 올바르지 않습니다.'};
			}
		}
	}
	handleClickToSubmit(){
		let error = this.valdationCheck();
		if(error){
			alert(error.message);
			return false;
		}

		let modifiedState = update(this.state, {
			created: {$set: Date.now()}
		});
		let formData = new FormData();
		this.props.documentFormData.fields.forEach((f) => {
			if(f.form == 'file'){
				if(f.multiple == '1'){
					modifiedState.custom['f'+f.fid].forEach((file) => {
						if(file.name){
							formData.append('f'+f.fid+'[]', file);
						}
					});
				} else {
					let file = modifiedState.custom['f'+f.fid];
					if(file.name){
						formData.append('f'+f.fid, file);
					}
				}
			}
		});
		formData.append('document', JSON.stringify(modifiedState));

		axios.post(this.props.apiUrl+'/document/new', formData)
		.then((response) => {
			console.log(response.data);
		});
	}
	handleClickToAddInputForm(field){
		let value = '';
		switch(field.type){
			case 'taxonomy':
				value = this.defaultTaxonomyTerm(field.cid); break;
			case 'date':
				value = {year: '', month: ''}; break;
			case 'image': case 'file':
				value = {filename: ''}; break;
			default:
				value = '';
		}
		this.setState(update(this.state, {
			custom: {['f'+field.fid]: {$push: [value]}}
		}));
	}
	fieldFooter(field){
		switch(field.form){
			case 'file':
				let accept = (field.type == 'file' ? 'pdf, hwp, doc, docx' : 'jpg, png');
				return `* 파일형식: ${accept}`;
		}
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
					<div>
						<input type="text" value={value.name || value.filename} />
						<label className="button">
							<span>찾기</span>
							<input style={{display: 'none'}} type="file" accept={accept} onChange={this.handleChange.bind(this, field, index)} />
						</label>
					</div>
				);
			case 'select':
				let options = [];
				this.props.documentFormData.taxonomy[field.cid].forEach((term) => {
					options[term.idx] = <option key={term.tid} value={term.tid}>{term.name}</option>;
				});
				return (
					<select value={value} onChange={this.handleChange.bind(this, field, index)}>
						{options}
					</select>
				);
			case 'radio':
				let radioButtons = [];
				this.props.documentFormData.taxonomy[field.cid].forEach((term) => {
					let checked = (value == term.tid ? true : false);
					radioButtons[term.idx] = (
						<label key={term.tid}>
							<input type="radio" name={'taxonomy_'+term.cid} value={term.tid} defaultChecked={checked} onChange={this.handleChange.bind(this, field, index)} />
							{term.name}
						</label>
					);
				});
				return radioButtons;
			case 'Ym':
				return <DateForm field={field} value={value} index={index} updateSingleField={this.updateSingleField.bind(this)} />
			case 'fieldset':
				let subFormFields = [];
				this.props.documentFormData.fields.forEach((f) => {
					if(f.parent == field.fid){
						subFormFields[f.idx] = this.documentField(f);
					}
				});
				return <div className="table">{subFormFields}</div>;
		}
		switch(field.type){
			case 'textarea':
				return <Textarea field={field} value={value} index={index} handleChange={this.handleChange.bind(this)} />
		}

	}
	isFieldHidden(fid){
		let actionShow = this.props.documentFormOptions.action_show.find((item) => item.field == fid);
		if(actionShow){
			for(let i in this.props.documentFormData.fields){
				let f = this.props.documentFormData.fields[i];
				if(f.type == 'taxonomy' && this.state.custom['f'+f.fid] == actionShow.term){
					return false;
				}
			}
			return true;
		} else {
			return false;
		}
	}
	documentField(field){
		if(this.isFieldHidden(field.fid)) return null;

		let inputForms;
		let value = (field.fid > 0 ? this.state.custom['f'+field.fid] : this.state[field.fid]);
		if(field.multiple == '1'){
			inputForms = value.map((v, i) => (
				<div key={i} className="table__row">
					<div className="table__col">
						{this.inputForm(field, v, i)}
					</div>
					<div className="table__col">
						<span className="button" onClick={this.handleClickToAddInputForm.bind(this, field)}>추가</span>
					</div>
				</div>
			));
			inputForms = (
				<div className="table">
					{inputForms}
					<div className="table__row">{this.fieldFooter(field)}</div>
				</div>
			);
		} else {
			inputForms = (
				<div className="table">
					{this.inputForm(field, value)}
					<div className="table__row">{this.fieldFooter(field)}</div>
				</div>
			);
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
		let requiredFields = [], electiveFields = [];
		this.props.documentFormData.fields.forEach((field) => {
			if(field.parent == 0){
				if(field.required == '1'){
					requiredFields[field.idx] = this.documentField(field);
				} else {
					electiveFields[field.idx] = this.documentField(field);
				}
			}
		});
		return (
			<div className="document-form">
				<h1>자료 입력하기</h1>
				<div className="table">
					<div className="table__row">
						<div className="table__col"></div>
						<div className="table__col">필수입력사항</div>
					</div>
					{requiredFields}
					<div className="table__row">
						<div className="table__col"></div>
						<div className="table__col">선택입력사항</div>
					</div>
					{electiveFields}
					<div className="table__row">
						<div className="table__col"></div>
						<div className="table__col">
							<button type="button" onClick={this.handleClickToSubmit.bind(this)}>{this.props.submitLabel}</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
DocumentForm.propTypes = {
	submitLabel: PropTypes.string.isRequired,
	documentFormData: PropTypes.shape({
		fields: PropTypes.array.isRequired,
		taxonomy: PropTypes.objectOf(PropTypes.array).isRequired
	}).isRequired,
	document: PropTypes.object.isRequired,
	documentFormOptions: PropTypes.object.isRequired,
	apiUrl: PropTypes.string.isRequired,
	openedDocuments: PropTypes.array
};

export default DocumentForm;
