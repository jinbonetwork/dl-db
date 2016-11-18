import React, {Component, PropTypes} from 'react';
import DocumentInputForm from './DocumentInputForm';
import {Table, Row, Column} from '../Table';

class DocumentField extends Component {
	fieldFooter(){
		switch(this.props.field.form){
			case 'file':
				let accept = (this.props.field.type == 'file' ? 'pdf, hwp, doc, docx' : 'jpg, png');
				return <div>{`* 파일형식: ${accept}`}</div>;
		}
	}
	handleClickToAddInputForm(){
		this.props.callBacks.addValueToField(this.props.field.fid);
	}
	handleClickToRemoveInputForm(index){
		this.props.callBacks.removeValueInField(this.props.field.fid, index);
	}
	documentInputForm(value, index){
		return (
			<DocumentInputForm field={this.props.field} value={value} index={index}
				info={this.props.info} callBacks={this.props.callBacks}
				formCallBacks={this.props.formCallBacks}
			/>
		);
	}
	inputForms(){
		let innerElement;
		if(this.props.field.multiple == '1'){
			innerElement = this.props.value.map((v, i) => (
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
			));
		} else if(this.props.field.form == 'file'){
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
				<Column className="table__label">
					<span>{this.props.field.subject}</span>
				</Column>
				<Column>
					{this.inputForms()}
				</Column>
			</Row>
		);
	}
}
DocumentField.propTypes = {
	field: PropTypes.object.isRequired,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object]),
	info: PropTypes.object.isRequired,
	callBacks: PropTypes.objectOf(PropTypes.func).isRequired,
	formCallBacks: PropTypes.object.isRequired,
};

export default DocumentField;
