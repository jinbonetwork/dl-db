import React, {Component, PropTypes} from 'react';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find() ...
import axios from 'axios';
import SearchBar from './SearchBar';
import Textarea from './Textarea';
import DateForm from './DateForm';
import DocumentField from './DocumentField';

class DocumentForm extends Component {
	componentWillMount(){
		let hiddenFields = [];
		for(let fid in this.props.info.formOptions.actionShowInfo){
			let info = this.props.info.formOptions.actionShowInfo[fid];
			let value =this.props.document.custom['f'+fid];
			if(value != info.term) hiddenFields.push(info.field);
		}
		this.setState({
			hiddenFields: hiddenFields
		});
	}
	addHiddenField(fid){
		if(this.state.hiddenFields.indexOf(fid) < 0){
			this.setState(update(this.state, {
				hiddenFields: {$push: [fid]}
			}));
		}
	}
	removeHiddenField(fid){
		let index = this.state.hiddenFields.indexOf(fid);
		if(index >= 0){
			this.setState(update(this.state, {
				hiddenFields: {$splice: [[index, 1]]}
			}));
		}
	}
	isHiddenField(fid){
		if(this.state.hiddenFields.indexOf(fid) >= 0) return true;
		else return false;
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
		for(let i in this.props.info.formData.fields){
			let f = this.props.info.formData.fields[i];

			let value = this.props.callBacks.fieldValue(f.fid);
			if(f.required == '1' && f.type != 'group' && this.isEmpty(value) && !this.isFieldHidden(f) && !this.isFieldHidden(f.parent)){
				return {fid: f.fid, message: f.subject+'를(을) 입력하세요.'};
			}
			if((f.type == 'email' && !this.isEmailValid(value)) || (f.type == 'phone' && !this.isPhoneValid(value)) || (f.type == "date" && !this.isDateValid(value, f.form))){
				return {fid: f.fid, message: f.subject+'의 형식이 적합하지 않습니다.'};
			}
			if(f.type == 'taxonomy'){
				let term = this.props.info.formData.taxonomy[f.cid].find((t) => t.tid == value);
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

		let modifiedState = update(this.props.document, {
			created: {$set: Date.now()}
		});
		let formData = new FormData();
		this.props.info.formData.fields.forEach((f) => {
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
	render(){
		let requiredFields = [], electiveFields = [];
		this.props.info.formData.fields.forEach((field) => {
			if(field.parent == 0 && this.isHiddenField(field.fid) === false){
				let documentField = (
					<DocumentField
						key={field.fid} field={field} value={this.props.callBacks.fieldValue(field.fid)}
						info={this.props.info} callBacks={this.props.callBacks}
						formCallBacks={{
							addHiddenField: this.addHiddenField.bind(this),
							removeHiddenField: this.removeHiddenField.bind(this),
							isHiddenField: this.isHiddenField.bind(this)
						}}
					/>
				);
				if(field.required == '1'){
					requiredFields[field.idx] = documentField;
				} else {
					electiveFields[field.idx] = documentField;
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
	document: PropTypes.object.isRequired,
	info: PropTypes.object.isRequired,
	callBacks: PropTypes.object.isRequired
};

export default DocumentForm;
