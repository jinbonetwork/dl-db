import React, {Component, PropTypes} from 'react';
import DocumentField from './DocumentField';
import SearchBar from './SearchBar';
import Textarea from '../inputs/Textarea';
import DateForm from '../inputs/DateForm';
import FileInput from '../inputs/FileInput';
import Select from '../inputs/Select';
import Option from '../inputs/Option';
import Table from '../table/Table';

class DocumentInputForm extends Component {
	handleChange(event){
		let value = (this.props.field.form != 'file' ? event.target.value : event.target.files[0]);
		this.props.callBacks.updateSingleField(this.props.field, this.props.index, value);

		if(this.props.field.type == 'taxonomy'){
			let actionShowInfo = this.props.info.formOptions.actionShowInfo[this.props.field.fid];
			if(actionShowInfo){
				if(actionShowInfo.term == value){
					this.props.formCallBacks.removeHiddenField(actionShowInfo.field);
				} else {
					this.props.formCallBacks.addHiddenField(actionShowInfo.field);
				}
			}
		}
	}
	render(){
		switch(this.props.field.form){
			case 'text':
				return <input className="textinput" type="text" value={this.props.value} onChange={this.handleChange.bind(this)} />;
			case 'search':
				let searchInfo = this.props.info.formOptions.searchInfo[this.props.field.fid];
				return (
					<SearchBar value={this.props.value} field={this.props.field} index={this.props.index}
						searchApiUrl={this.props.info.apiUrl+'/'+searchInfo.api}
						resultMap = {searchInfo.resultMap}
						updateFields={this.props.callBacks.updateFields.bind(this)}
						updateSingleField={this.props.callBacks.updateSingleField.bind(this)}
					/>
				);
			case 'file':
				let accept = (this.props.field.type == 'file' ? '.pdf, .hwp, .doc, .docx' : '.jpg, .png');
				return (
					<FileInput value={this.props.value.name || this.props.value.filename}
						accept={accept} handleChange={this.handleChange.bind(this)}
					/>
				)
			case 'select':
				let options = [];
				this.props.info.formData.taxonomy[this.props.field.cid].forEach((term) => {
					options[term.idx] = <option key={term.tid} value={term.tid}>{term.name}</option>;
				});
				return (
					<select value={this.props.value} onChange={this.handleChange.bind(this)}>
						{options}
					</select>
				);
				/*
				this.props.info.formData.taxonomy[this.props.field.cid].forEach((term) => {
					options[term.idx] = <Option key={term.tid} value={term.tid}>{term.name}</Option>;
				});
				return (
					<Select value={this.props.value} onChange={this.handleChange.bind(this)}>
						{options}
					</Select>
				);
				*/
			case 'radio':
				let radioButtons = [];
				this.props.info.formData.taxonomy[this.props.field.cid].forEach((term) => {
					let checked = (this.props.value == term.tid ? true : false);
					radioButtons[term.idx] = (
						<label key={term.tid}>
							<input type="radio" name={'taxonomy_'+term.cid} value={term.tid} defaultChecked={checked} onChange={this.handleChange.bind(this)} />
							{term.name}
						</label>
					);
				});
				return <div className="radio-wrap">{radioButtons}</div>
			case 'Ym':
				return (
					<DateForm field={this.props.field} value={this.props.value} index={this.props.index}
						updateSingleField={this.props.callBacks.updateSingleField.bind(this)}
					/>
				);
			case 'fieldset':
				let subFormFields = [];
				this.props.info.formData.fields.forEach((f) => {
					if(f.parent == this.props.field.fid && this.props.formCallBacks.isHiddenField(f.fid) === false){
						subFormFields[f.idx] = (
							<DocumentField
								key={f.fid} field={f} value={this.props.callBacks.fieldValue(f.fid)}
								info={this.props.info} callBacks={this.props.callBacks}
								formCallBacks={this.props.formCallBacks}
							/>
						)
					}
				});
				return <Table className="inner-table">{subFormFields}</Table>
		}
		switch(this.props.field.type){
			case 'textarea':
				return (
					<Textarea field={this.props.field} value={this.props.value} index={this.props.index}
						updateSingleField={this.props.callBacks.updateSingleField.bind(this)}
					/>
				);
		}
	}
}
DocumentInputForm.propTypes = {
	field: PropTypes.object.isRequired,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object]),
	index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	info: PropTypes.object.isRequired,
	callBacks: PropTypes.objectOf(PropTypes.func).isRequired,
	formCallBacks: PropTypes.object.isRequired
};

export default DocumentInputForm;
