import React, {Component, PropTypes} from 'react';
import DocumentInputForm from './DocumentInputForm';
import Table from '../table/Table';
import Row from '../table/Row';
import Column from '../table/Column';

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
	handleClickToRemoveInputForm(index){ console.log(index);
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
				<div key={i}>
					{this.documentInputForm(v, i)}
					<span className="button" onClick={this.handleClickToAddInputForm.bind(this)}>추가</span>
					<span className="button" onClick={this.handleClickToRemoveInputForm.bind(this, i)}>삭제</span>
				</div>
			));
		} else if(this.props.field.form == 'file'){
			innerElement = (
				<div>
					{this.documentInputForm(this.props.value)}
					<span className="button" onClick={this.handleClickToRemoveInputForm.bind(this, undefined)}>삭제</span>
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
