import React, {Component, PropTypes} from 'react';
import DocumentInputForm from './DocumentInputForm';

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
				<div key={i} className="table__row">
					<div className="table__col">
						{this.documentInputForm(v, i)}
					</div>
					<div className="table__col">
						<span className="button" onClick={this.handleClickToAddInputForm.bind(this, this.props.field)}>추가</span>
					</div>
				</div>
			));
			inputForms = (
				<div className="table">
					{inputForms}
					<div className="table__row">{this.fieldFooter()}</div>
				</div>
			);
		} else {
			inputForms = (
				<div className="table">
					{this.documentInputForm(this.props.value)}
					<div className="table__row">{this.fieldFooter()}</div>
				</div>
			);
		}
		return (
			<div className="table__row">
				<div className="table__col">{this.props.field.subject}</div>
				<div className="table__col">
					{inputForms}
				</div>
			</div>
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
