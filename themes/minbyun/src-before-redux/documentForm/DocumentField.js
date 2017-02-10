import React, {Component, PropTypes} from 'react';
import DocumentInputForm from './DocumentInputForm';
import {Table, Row, Column} from '../accessories/Table';

class DocumentField extends Component {
	fieldFooter(){
		const fAttr = this.props.docData.fAttrs[this.props.fname];
		switch(fAttr.type){
			case 'file':
				return (
					<div className="document-form__bottom-message">
						<div>* 파일형식: pdf, doc, docx, hwp</div>
						<div>* 민변 디지털도서관은 첨부파일의 내용을 자동으로 추출하여 검색할 수 있습니다. 다만, 한글(hwp) 파일의 경우 자체 암호화로 내용 검색이 불가능하므로 가능한 'PDF' 파일로 변환하여 주시기를 권장합니다(방법: 파일 &rarr; PDF로 저장하기).</div>
					</div>
				);
			case 'image':
				return (
					<div className="document-form__bottom-message">* 파일형식: jpg, png</div>
				);
			default:
		}
	}
	handleClick(which, arg1st){
		if(which == 'add'){
			this.props.callBacks.addValueToField(this.props.fname);
		}
		else if(which =='remove'){
			const index = arg1st;
			this.props.callBacks.removeValueInField(this.props.fname, index);
		}
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
		const fAttr = this.props.docData.fAttrs[this.props.fname];
		let innerElement;
		if(fAttr.multiple){
			innerElement = this.props.value.map((v, i) => {
				return (
					<div key={i} className="document-form__input-with-buttons">
						<div className="document-form__middle">
							{this.documentInputForm(v, i)}
						</div>
						<div className="document-from__buttons">
							<button type="button" onClick={this.handleClick.bind(this, 'add')}>
								<i className="pe-7s-plus"></i>
							</button>
							<button type="button" onClick={this.handleClick.bind(this, 'remove', i)}>
								<i className="pe-7s-close-circle"></i>
							</button>
						</div>
					</div>
				)
			});
		} else if(fAttr.form == 'file'){
			innerElement = (
				<div className="document-form__input-with-buttons">
					<div className="document-form__middle">
						{this.documentInputForm(this.props.value)}
					</div>
					<div className="document-from__buttons">
						<button type="button" onClick={this.handleClick.bind(this, 'remove', undefined)}>
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
		if(!this.props.formCallBacks.isHiddenField(this.props.fname)){
			const fAttr = this.props.docData.fAttrs[this.props.fname];
			return (
				<Row>
					<Column>
						<span>{fAttr.displayName}</span>
					</Column>
					<Column>
						{this.inputForms()}
					</Column>
				</Row>
			);
		} else {
			return null;
		}
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
