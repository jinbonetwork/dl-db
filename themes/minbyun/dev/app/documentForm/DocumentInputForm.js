import React, {Component, PropTypes} from 'react';
import DocumentField from './DocumentField';
import SearchInput from './SearchInput';
import Textarea from '../accessories/Textarea';
import DateForm from '../accessories/DateForm';
import FileInput from '../accessories/FileInput';
import Select from '../accessories/Select';
import Option from '../accessories/Option';
import {Table} from '../accessories/Table';
import {_fieldAttrs, _taxonomy, _terms} from '../schema/docSchema';

class DocumentInputForm extends Component {
	handleChange(event){
		let value = (_fieldAttrs[this.props.fname].form != 'file' ? event.target.value : event.target.files[0]);
		this.props.callBacks.updateSingleField(this.props.fname, this.props.index, value);
	}
	render(){
		let fAttr = _fieldAttrs[this.props.fname];
		switch(fAttr.form){
			case 'text':
				return (
					<input className="textinput" type="text" value={this.props.value} onChange={this.handleChange.bind(this)} />
				);
			case 'search':
				let api;
				if(this.props.fname == 'name') api = '/api/members?q=';
				return (
					<SearchInput value={this.props.value} fname={this.props.fname} api={api}
						updateFields={this.props.callBacks.updateFields.bind(this)}
						updateSingleField={this.props.callBacks.updateSingleField.bind(this)}
						fetchData={this.props.callBacks.fetchData}
					/>
				);
			case 'file':
				let accept;
				if(fAttr.type == 'file') accept = '.pdf, .hwp, .doc, .docx';
				else if(fAttr.type == 'image') accept = '.jpg, .png';
				return (
					<FileInput value={this.props.value.name || this.props.value.filename}
						accept={accept} handleChange={this.handleChange.bind(this)}
					/>
				)
			case 'select':
				let options = [];
				this.props.docData.taxonomy[this.props.fname].forEach((tid) => { if(tid){
					options.push(<option key={tid} value={tid}>{this.props.docData.terms[tid]}</option>);
				}});
				return (
					<select value={this.props.value} onChange={this.handleChange.bind(this)}>
						{options}
					</select>
				);
			case 'radio':
				let radioButtons = [];
				this.props.docData.taxonomy[this.props.fname].forEach((tid) => { if(tid){
					let checked = (this.props.value == tid ? true : false);
					radioButtons.push(
						<label key={tid}>
							<input type="radio" name={'taxonomy_'+this.props.fname} value={tid} checked={checked} onChange={this.handleChange.bind(this)} />
							{this.props.docData.terms[tid]}
						</label>
					);
				}});
				return <div className="radio-wrap">{radioButtons}</div>
			case 'Ym':
				return (
					<DateForm fname={this.props.fname} value={this.props.value} index={this.props.index}
						updateSingleField={this.props.callBacks.updateSingleField.bind(this)}
					/>
				);
			case 'textarea':
				let numOfWords;
				if(this.props.fname == 'content') numOfWords = 200;
				return (
					<Textarea fname={this.props.fname} value={this.props.value} index={this.props.index} numOfWords={numOfWords}
						updateSingleField={this.props.callBacks.updateSingleField.bind(this)}
					/>
				);
			case 'fieldset':
				let subFormFields = [];
				fAttr.children.forEach((fn) => {
					if(this.props.formCallBacks.isHiddenField(fn) === false){
						subFormFields.push(
							<DocumentField
								key={fn} fname={fn} value={this.props.callBacks.fieldValue(fn)}
								docData={this.props.docData} callBacks={this.props.callBacks}
								formCallBacks={this.props.formCallBacks}
							/>
						)
					}
				});
				return <Table className="inner-table">{subFormFields}</Table>
		}
	}
}
DocumentInputForm.propTypes = {
	fname: PropTypes.string.isRequired,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object]),
	index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	docData: PropTypes.object.isRequired,
	callBacks: PropTypes.objectOf(PropTypes.func).isRequired,
	formCallBacks: PropTypes.object.isRequired
};

export default DocumentInputForm;
