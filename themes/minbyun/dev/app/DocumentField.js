import React, {Component, PropTypes} from 'react';
import DocumentInputForm from './DocumentInputForm';
import Table from './Table';
import Row from './Row';
import Column from './Column';

class DocumentField extends Component {
	fieldFooter(){
		switch(this.props.field.form){
			case 'file':
				let accept = (this.props.field.type == 'file' ? 'pdf, hwp, doc, docx' : 'jpg, png');
				return `* 파일형식: ${accept}`;
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
	render(){
		let inputForms;
		if(this.props.field.multiple == '1'){
			inputForms = this.props.value.map((v, i) => (
				<Row key={i}>
					<Column>{this.documentInputForm(v, i)}</Column>
					<Column>
						<span className="button" onClick={this.handleClickToAddInputForm.bind(this)}>추가</span>
						<span className="button" onClick={this.handleClickToRemoveInputForm.bind(this, i)}>삭제</span>
					</Column>
				</Row>
			));
			inputForms = (
				<Table>
					{inputForms}
					<Row>{this.fieldFooter()}</Row>
				</Table>
			);
		} else if(this.props.field.form == 'file'){
			inputForms = (
				<Table>
					<Row>
						<Column>{this.documentInputForm(this.props.value)}</Column>
						<Column>
							<span className="button" onClick={this.props.callBacks.updateSingleField.bind(this, this.props.field)}>삭제</span>
						</Column>
					</Row>
					<Row>{this.fieldFooter()}</Row>
				</Table>
			);
		} else {
			inputForms = (
				<Table>
					{this.documentInputForm(this.props.value)}
					<Row>{this.fieldFooter()}</Row>
				</Table>
			);
		}
		return (
			<Row>
				<Column className="table__label">{this.props.field.subject}</Column>
				<Column>
					{inputForms}
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
