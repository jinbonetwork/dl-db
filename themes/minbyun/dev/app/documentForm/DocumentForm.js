import React, {Component, PropTypes} from 'react';
import update from 'react-addons-update';  // for update()
import {withRouter} from 'react-router';
import 'babel-polyfill'; // for update(), find() ...
import SearchInput from './SearchInput';
import Textarea from '../accessories/Textarea';
import DateForm from '../accessories/DateForm';
import DocumentField from './DocumentField';
import {Table, Row, Column} from '../accessories/Table';
import Message from '../accessories/Message';
import {_fieldAttrs, _sFname, _convertDocToSave} from '../schema/docSchema';
import {_isEmpty, _isCommon, _isEmailValid, _isPhoneValid, _isDateValid} from '../accessories/functions';

class DocumentForm extends Component {
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
	submit(){
		let error = this.validationCheck();
		if(error){
			this.props.callBacks.setMessage(error.message, 'unset');
			return false;
		}

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

		let usetProcessing = this.props.callBacks.setMessage(null);
		this.props.callBacks.fetchData('post', '/api/document/save?mode='+this.props.formAttr.mode, formData, (data) => { if(data){
			usetProcessing();
			this.props.router.push('/document/'+data.did);
		}});
	}
	handleClick(which, event){
		if(which == 'submit'){
			this.submit();
		}
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
		return (
			<div className="document-form">
				<h1>{this.props.formAttr.header}</h1>
				<Table>
					<Row>
						<Column></Column>
						<Column>
							<h2 className="document-form__accented_title">필수입력사항</h2>
						</Column>
					</Row>
					{requiredFields}
					<Row>
						<Column></Column>
						<Column><h2>선택입력사항</h2></Column>
					</Row>
					{electiveFields}
					<Row>
						<Column></Column>
						<Column>
							<button type="button" className="document-form--submit"
								onClick={this.handleClick.bind(this, 'submit')}>{this.props.formAttr.submit}
							</button>
						</Column>
					</Row>
				</Table>
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
		push: PropTypes.func.isRequired,
		goBack: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(DocumentForm);
