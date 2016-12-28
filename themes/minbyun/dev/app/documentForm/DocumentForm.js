import React, {Component, PropTypes} from 'react';
import DocumentField from './DocumentField';
import {Table, Row, Column} from '../accessories/Table';
import Message from '../accessories/Message';
import {_fieldAttrs, _sFname, _convertDocToSave, _isHiddenField} from '../schema/docSchema';
import {_isEmpty, _isCommon, _isEmailValid, _isPhoneValid, _isDateValid} from '../accessories/functions';
import update from 'react-addons-update';  // for update()
import {withRouter} from 'react-router';
import 'babel-polyfill'; // for update(), find() ...

class DocumentForm extends Component {
	isHiddenField(fname){
		return _isHiddenField(fname, this.props.document, 'form');
	}
	validationCheck(){
		for(let fn in this.props.document){
			let value = this.props.document[fn];
			let fAttr = _fieldAttrs[fn];
			if(fAttr.type == 'meta' || fAttr.type == 'group' || this.isHiddenField(fn) || this.isHiddenField(fAttr.parent)) continue;
			if(fAttr.required && _isEmpty(value)){
				return {fname: fn, index: (fAttr.multiple ? 0 : undefined), message: fAttr.displayName+'을(를) 입력하세요.'};
			}
			if(fAttr.multiple === false) value = [value];
			for(let j in value){
				const v = value[j];
				if(v && (
					(fAttr.type == 'email' && !_isEmailValid(v)) ||
					(fAttr.type == 'phone' && !_isPhoneValid(v)) ||
					(fAttr.type == 'date' && !_isDateValid(v, fAttr.form))
				)){
					return {fname: fn, index: (fAttr.multiple ? j : undefined), message:fAttr.displayName+'의 형식이 적합하지 않습니다.'};
				}
			}
		}
	}
	submit(){
		let error = this.validationCheck();
		if(error){
			this.props.callBacks.setMessage(error.message, () => {
				this.props.callBacks.setFieldWithFocus(error.fname, error.index);
			});
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

		let unsetProcessing = this.props.callBacks.setMessage(null);
		this.props.callBacks.fetchData('post', '/api/document/save?mode='+this.props.formAttr.mode, formData, (data) => {
			unsetProcessing();
			if(data){
				this.props.router.push('/document/'+data.did);
			}
		});
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
			if(fAttr.type != 'meta' && !fAttr.parent && !_isHiddenField(fn, this.props.document, 'form')){
				const documentField = (
					<DocumentField
						key={fn} fname={fn} value={value} docData={this.props.docData} fieldWithFocus={this.props.fieldWithFocus}
						callBacks={this.props.callBacks} formCallBacks={{isHiddenField: this.isHiddenField.bind(this)}}
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
					<Row className="document-form__section-title">
						<Column></Column>
						<Column><h2>필수입력사항</h2></Column>
					</Row>
					{requiredFields}
					<Row className="document-form__section-title">
						<Column></Column>
						<Column><h2>선택입력사항</h2></Column>
					</Row>
					{electiveFields}
					<Row>
						<Column></Column>
						<Column>
							<button type="button" className="document-form__submit"
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
	fieldWithFocus: PropTypes.object.isRequired,
	callBacks: PropTypes.object.isRequired,
	router: PropTypes.shape({
		push: PropTypes.func.isRequired,
		goBack: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(DocumentForm);
