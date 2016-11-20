import React, {Component, PropTypes} from 'react';
import update from 'react-addons-update';  // for update()
import {withRouter} from 'react-router';
import 'babel-polyfill'; // for update(), find() ...
import axios from 'axios';
import SearchInput from './SearchInput';
import Textarea from '../inputs/Textarea';
import DateForm from '../inputs/DateForm';
import DocumentField from './DocumentField';
import {Table, Row, Column} from '../Table';
import ErrorMessage from '../ErrorMessage';
import Processing from './Processing';
import {_fieldAttrs, _sFname, _convertDocToSave} from '../docSchema';
import {_isEmpty, _isCommon, _isEmailValid, _isPhoneValid, _isDateValid} from '../functions';

class DocumentForm extends Component {
	componentWillMount(){
		this.setState({
			errorMessage: undefined,
			isProcessing: false
		});
	}
	isHiddenField(fname){
		if(fname == 'trial'){
			if(this.props.document.doctype == 1) return false;
			else return true;
		}
		return false;
	}
	validationCheck(){
		for(let fn in this.props.document){
			let value = this.props.document[fn];
			let fAttr = _fieldAttrs[fn];
			if(fAttr.type != 'meta' && fAttr.type != 'group'){
				if(fAttr.required && _isEmpty(value) && !this.isHiddenField(fn) && !this.isHiddenField(fAttr.parent)){
					return {fname: fn, message: fAttr.displayName+'을(를) 입력하세요.'};
				}
				if(fAttr.multiple === false) value = [value];
				for(let j in value){
					let v = value[j];
					if(
						(fAttr.type == 'email' && !_isEmailValid(v)) ||
						(fAttr.type == 'phone' && !_isPhoneValid(v)) ||
						(fAttr.type == 'date' && !_isDateValid(v, fAttr.form))
					){
						return {fname: fn, message:fAttr.displayName+'의 형식이 적합하지 않습니다.'};
					}
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

		let formData = new FormData();
		formData.append('document', JSON.stringify(
			_convertDocToSave(this.props.document)
		));
		for(let fn in this.props.document){
			let value = this.props.document[fn];
			let fAttr = _fieldAttrs[fn];
			if(fAttr.form == 'file'){
				if(fAttr.multiple){
					value.forEach((file) => {
						if(file.name) formData.append(_sFname[fn]+'[]', file);
					});
				} else {
					if(value.name) formData.append(_sFname[fn], value);
				}
			}
		};

		axios.post('/api/document/save?mode='+this.props.formAttr.mode, formData)
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
		for(let fn in this.props.document){
			let fAttr = _fieldAttrs[fn];
			let value = this.props.document[fn];
			if(fAttr.type != 'meta' && !fAttr.parent && !this.isHiddenField(fn)){
				let documentField = (
					<DocumentField
						key={fn} fname={fn} value={value} docData={this.props.docData} callBacks={this.props.callBacks}
						formCallBacks={{
							isHiddenField: this.isHiddenField.bind(this)
						}}
					/>
				);
				if(fAttr.required){
					requiredFields.push(documentField);
				} else {
					electiveFields.push(documentField);
				}
			}
		};
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
	docData: PropTypes.object.isRequired,
	callBacks: PropTypes.object.isRequired,
	router: PropTypes.shape({
		push: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(DocumentForm);
