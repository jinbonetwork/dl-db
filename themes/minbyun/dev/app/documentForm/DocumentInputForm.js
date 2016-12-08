import React, {Component, PropTypes} from 'react';
import DocumentField from './DocumentField';
import SearchInput from '../accessories/SearchInput';
import Textarea from './Textarea';
import DateForm from './DateForm';
import FileInput from '../accessories/FileInput';
import {Table} from '../accessories/Table';
import {Select, Option} from '../accessories/Select';
import {Radio, RdItem} from '../accessories/Radio';
import {_fieldAttrs, _taxonomy, _terms} from '../schema/docSchema';
import {_mapAO} from '../accessories/functions';

class DocumentInputForm extends Component {
	isValid(value, fAttr){
		if(fAttr.type == 'date' && fAttr.form == 'text'){
			let dateArray = value.split('-');
			if(dateArray.length > 3) return false;
			let today = new Date();
			for(let index in dateArray){
				if(index == 0){
					if(0 <= dateArray[0] && dateArray[0] <= today.getFullYear()); else return false;
				} else {
					if(0 <= dateArray[index] && dateArray[index] <= 31); else return false;
				}
			}
			return true;
		} else {
			return true;
		}
	}
	handleChange(arg){
		let value;
		const fAttr = _fieldAttrs[this.props.fname];
		switch(fAttr.form){
			case 'file': value = arg.target.files[0]; break;
			case 'select': case 'radio': value = arg; break;
			default: value = arg.target.value;
		}
		if(this.isValid(value, fAttr)){
			this.props.callBacks.updateSingleField(this.props.fname, this.props.index, value);
		}
	}
	handleChangeOfSearch(fnames, result){
		this.props.callBacks.updateFields(_mapAO(fnames, (fn) => result[fn]));
	}
	searchMember(name, callBack){
		this.props.callBacks.fetchData('get', '/api/members?q='+encodeURIComponent(name), (data) => {
			if(data && callBack) callBack(data.members);
		});
	}
	render(){
		const fAttr = _fieldAttrs[this.props.fname];
		switch(fAttr.form){
			case 'text':
				const placeholder = (fAttr.type == 'date' ? '2015-12-07' : '');
				return (
					<input type="text" value={this.props.value} onChange={this.handleChange.bind(this)} placeholder={placeholder} />
				);
			case 'search':
				const fnames = _fieldAttrs[_fieldAttrs[this.props.fname].parent].children;
				return (
					<SearchInput value={this.props.value} search={this.searchMember.bind(this)} resultFNames={fnames}
						onChange={this.handleChangeOfSearch.bind(this, fnames)}
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
					options.push(<Option key={tid} value={tid}><span>{this.props.docData.terms[tid]}</span></Option>);
				}});
				return (
					<Select selected={this.props.value} onChange={this.handleChange.bind(this)}>
						{options}
					</Select>
				);
			case 'radio':
				const radioItems =  this.props.docData.taxonomy[this.props.fname].map((tid) => (
					<RdItem key={tid} value={tid}><span>{this.props.docData.terms[tid]}</span></RdItem>
				));
				return (
					<Radio selected={this.props.value} onChange={this.handleChange.bind(this)}>
						{radioItems}
					</Radio>
				)
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
