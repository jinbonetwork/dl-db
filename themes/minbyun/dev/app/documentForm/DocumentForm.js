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
import ErrorMessage from '../ErrorMessage';
import Processing from './Processing';
import func from '../functions';

class DocumentForm extends Component {
	componentWillMount(){
		this.setState({
			errorMessage: undefined,
			isProcessing: false
		});
	}
	isHiddenField(fid){
		if(this.props.info.hiddenFields.indexOf(fid) >= 0) return true;
		else return false;
	}
	validationCheck(){
		for(let i in this.props.info.formData.fields){
			let f = this.props.info.formData.fields[i];

			let value = this.props.callBacks.fieldValue(f.fid);
			if(f.required == '1' && f.type != 'group' && func.isEmpty(value) && !this.isHiddenField(f) && !this.isHiddenField(f.parent)){
				return {fid: f.fid, message: f.subject+'을(를) 입력하세요.'};
			}

			if(f.multiple != '1'){
				value = [value];
			}
			for(let j in value){
				let v = value[j];
				if((f.type == 'email' && !func.isEmailValid(v)) || (f.type == 'phone' && !func.isPhoneValid(v)) || (f.type == 'date' && !func.isDateValid(v, f.form))){
					return {fid: f.fid, message: f.subject+'의 형식이 적합하지 않습니다.'};
				}
				if(f.type == 'taxonomy'){
					let term = this.props.info.formData.taxonomy[f.cid].find((t) => t.tid == v);
					if(!term) return {fid: f.fid, message: f.subject+'이(가) 올바르지 않습니다.'};
				}
			}
		}
	}
	handleClickToSubmit(){
		let error = this.validationCheck();
		if(error){
			this.setState({errorMessage: error.message});
			return false;
		}
		this.setState({isProcessing: true});

		let document = {};
		['id', 'uid', 'owner', 'created'].forEach((prop) => {
			if(this.props.document[prop] !== undefined) document[prop] = this.props.document[prop];
		});
		let formData = new FormData();
		this.props.info.formData.fields.forEach((f) => {
			let fid = (f.fid > 0 ? 'f'+f.fid : f.fid);
			if(f.form == 'file'){
				if(f.multiple == '1'){
					this.props.document[fid].forEach((file, index) => {
						if(file.fid){
							if(!document[fid]) document[fid] = [];
							document[fid].push(file.fid);
						}
						else if(file.name) {
							formData.append(fid+'[]', file);
						}
					});
				} else {
					let file = this.props.document[fid];
					if(file.fid){
						document[fid] = file.fid;
					} else if(file.name){
						formData.append(fid, file);
					}
				}
			} else if(f.type != 'group'){
				document[fid] = this.props.document[fid];
			}
		});
		formData.append('document', JSON.stringify(document));

		axios.post(this.props.info.apiUrl+'/document/save?mode='+this.props.formAttr.mode, formData)
		.then((response) => {
			if(response.statusText == 'OK'){
				if(response.data.error == 0){
					this.props.router.push('/document/'+response.data.did);
				} else {
					console.error(response.data);
				}
			} else {
				console.error('Server response was not OK');
			}
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
				<h1>{this.props.formAttr.header}</h1>
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
								onClick={this.handleClickToSubmit.bind(this)}>{this.props.formAttr.submit}
							</button>
						</Column>
					</Row>
				</Table>
				{errorMessage}
				{this.state.isProcessing && <Processing />}
			</div>
		);
	}
}
DocumentForm.propTypes = {
	formAttr: PropTypes.object.isRequired,
	document: PropTypes.object.isRequired,
	info: PropTypes.object.isRequired,
	callBacks: PropTypes.object.isRequired,
	router: PropTypes.shape({
		push: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(DocumentForm);
