import React, {Component, PropTypes} from 'react';
import DocumentInputForm from './DocumentInputForm';
import {Table, Row, Column} from '../accessories/Table';

class DocumentField extends Component {
	fieldFooter(){
		switch(this.props.docData.fAttrs[this.props.fname].form){
			case 'file':
				let accept = (this.props.docData.fAttrs[this.props.fname].type == 'file' ? 'pdf, hwp, doc, docx' : 'jpg, png');
				return <div className="document-form__fileformat">{`* 파일형식: ${accept}`}</div>;
		}
	}
	handleClickToAddInputForm(){
		this.props.callBacks.addValueToField(this.props.fname);
	}
	handleClickToRemoveInputForm(index){
		this.props.callBacks.removeValueInField(this.props.fname, index);
	}
	documentInputForm(value, index){
		return (
			<DocumentInputForm fname={this.props.fname} value={value} index={index} fieldWithFocus={this.props.fieldWithFocus}
				docData={this.props.docData} callBacks={this.props.callBacks}
				formCallBacks={this.props.formCallBacks}
			/>
		);
	}
	inputForms(){
		let innerElement;
		if(this.props.docData.fAttrs[this.props.fname].multiple){
			innerElement = this.props.value.map((v, i) => {
				return (
					<div key={i} className="document-form__input-with-buttons">
						<div className="document-form__middle">
							{this.documentInputForm(v, i)}
						</div>
						<div className="document-from__buttons">
							<button type="button" onClick={this.handleClickToAddInputForm.bind(this)}>
								<i className="pe-7s-plus"></i>
							</button>
							<button type="button" onClick={this.handleClickToRemoveInputForm.bind(this, i)}>
								<i className="pe-7s-close-circle"></i>
							</button>
						</div>
					</div>
				)
			});
		} else if(this.props.docData.fAttrs[this.props.fname].form == 'file'){
			innerElement = (
				<div className="document-form__input-with-buttons">
					<div className="document-form__middle">
						{this.documentInputForm(this.props.value)}
					</div>
					<div className="document-from__buttons">
						<button type="button" onClick={this.handleClickToRemoveInputForm.bind(this, undefined)}>
							<i className="pe-7s-close-circle"></i>
						</button>
					</div>
				</div>
			);
		} else {
			innerElement = this.documentInputForm(this.props.value);
		}
		return (
			<div>
				{innerElement}
				{this.fieldFooter()}
			</div>
		);
	}
	render(){
		return (
			<Row>
				<Column>
					<span>{this.props.docData.fAttrs[this.props.fname].displayName}</span>
				</Column>
				<Column>
					{this.inputForms()}
				</Column>
			</Row>
		);
	}
}
DocumentField.propTypes = {
	fname: PropTypes.string.isRequired,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object]),
	docData: PropTypes.object.isRequired,
	fieldWithFocus: PropTypes.object,
	callBacks: PropTypes.objectOf(PropTypes.func).isRequired,
	formCallBacks: PropTypes.object.isRequired,
};

export default DocumentField;
