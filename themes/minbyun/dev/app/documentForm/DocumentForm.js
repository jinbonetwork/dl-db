import React, {Component, PropTypes} from 'react';
import update from 'react-addons-update';  // for update()
import {withRouter} from 'react-router';
import 'babel-polyfill'; // for update(), find() ...
import axios from 'axios';
import SearchInput from './SearchInput';
import Textarea from '../inputs/Textarea';
import DateForm from '../inputs/DateForm';
import DocumentField from './DocumentField';
import Table from '../table/Table';
import Row from '../table/Row';
import Column from '../table/Column';
import ErrorMessage from './ErrorMessage';
import func from '../functions';

class DocumentForm extends Component {
	componentWillMount(){
		let hiddenFields = [];
		for(let fid in this.props.info.formOptions.actionShowInfo){
			let info = this.props.info.formOptions.actionShowInfo[fid];
			let value =this.props.document['f'+fid];
			if(value != info.term) hiddenFields.push(info.field);
		}
		this.setState({
			hiddenFields: hiddenFields,
			errorMessage: undefined
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
	validationCheck(){
		for(let i in this.props.info.formData.fields){
			let f = this.props.info.formData.fields[i];

			let value = this.props.callBacks.fieldValue(f.fid);
			if(f.required == '1' && f.type != 'group' && func.isEmpty(value) && !this.isHiddenField(f) && !this.isHiddenField(f.parent)){
				return {fid: f.fid, message: f.subject+'을(를) 입력하세요.'};
			}
			if((f.type == 'email' && !func.isEmailValid(value)) || (f.type == 'phone' && !func.isPhoneValid(value)) || (f.type == "date" && !func.isDateValid(value, f.form))){
				return {fid: f.fid, message: f.subject+'의 형식이 적합하지 않습니다.'};
			}
			if(f.type == 'taxonomy'){
				let term = this.props.info.formData.taxonomy[f.cid].find((t) => t.tid == value);
				if(!term) return {fid: f.fid, message: f.subject+'이(가) 올바르지 않습니다.'};
			}
		}
	}
	handleClickToSubmit(){
		let error = this.validationCheck();
		if(error){
			this.setState({errorMessage: error.message});
			return false;
		}

		let document = {};
		let formData = new FormData();
		this.props.info.formData.fields.forEach((f) => {
			let fid = (f.fid > 0 ? 'f'+f.fid : f.fid);
			if(f.form == 'file'){
				if(f.multiple == '1'){
					this.props.document[fid].forEach((file, index) => {
						if(file.name){
							formData.append(fid+'[]', file);
						} else if(file.filename){
							document[fid][index] = file;
						}
					});
				} else {
					let file = this.props.document[fid];
					if(file.name){
						formData.append(fid, file);
					} else if(file.filename){
						document[fid] = file;
					}
				}
			} else if(f.type != 'group'){
				document[fid] = this.props.document[fid];
			}
		});
		formData.append('document', JSON.stringify(document));

		axios.post(this.props.info.apiUrl+'/document/save?mode=add', formData)
		.then((response) => {
			if(response.statusText == 'OK'){
				if(response.data.error == 0){
					return response.data.did;
				} else {
					console.error(response.data);
				}
			} else {
				console.error('Server response was not OK');
			}
		})
		.then((did) => {
			this.props.router.push('/document/'+did);
		});
	}
	removeErrorMessage(){
		this.setState({errorMessage: undefined});
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
		let errorMessage = (this.state.errorMessage &&
			<ErrorMessage message={this.state.errorMessage}
				handleClick={this.removeErrorMessage.bind(this)}
			/>
		);
		return (
			<div className="document-form">
				<h1>{this.props.label.header}</h1>
				<Table>
					<Row>
						<Column className="table__label"></Column>
						<Column>
							<h2 className="document-form__accented_title">필수입력사항</h2>
						</Column>
					</Row>
					{requiredFields}
					<Row>
						<Column className="table__label"></Column>
						<Column><h2>선택입력사항</h2></Column>
					</Row>
					{electiveFields}
					<Row>
						<Column className="table__label"></Column>
						<Column>
							<button type="button" className="document-form--submit"
								onClick={this.handleClickToSubmit.bind(this)}>{this.props.label.submit}
							</button>
						</Column>
					</Row>
				</Table>
				{errorMessage}
			</div>
		);
	}
}
DocumentForm.propTypes = {
	label: PropTypes.object.isRequired,
	document: PropTypes.object.isRequired,
	info: PropTypes.object.isRequired,
	callBacks: PropTypes.object.isRequired,
	router: PropTypes.shape({
		push: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(DocumentForm);