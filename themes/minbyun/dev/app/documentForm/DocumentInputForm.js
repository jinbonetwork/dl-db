import React, {Component, PropTypes} from 'react';
import DocumentField from './DocumentField';
import TextInput from '../accessories/TextInput';
import SearchInput from '../accessories/SearchInput';
import Textarea from '../accessories/Textarea';
import DateForm from './DateForm';
import FileInput from '../accessories/FileInput';
import {Table} from '../accessories/Table';
import Select from '../accessories/Select';
import Item from '../accessories/Item';
import Check from '../accessories/Check';
import {_taxonomy, _terms} from '../schema/docSchema';
import {_mapAO} from '../accessories/functions';

class DocumentInputForm extends Component {
	isValid(value, fAttr){
		if(this.props.fname == 'sentence'){
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
		}
		else if(fAttr.type == 'phone'){
			const phone = value.split('-');
			if(phone.length > 3) return false;
			for(let index in phone){
				if(phone[index] >= 0); else return false;
				if(phone.length > 1 && phone[index].length > 4) return false;
				if(phone.length == 1 && phone[index].length > 11) return false;
			}
			return true;
		} else {
			return true;
		}
	}
	handleChange(value){
		if(this.isValid(value, this.props.docData.fAttrs[this.props.fname])){
			this.props.callBacks.updateSingleField(this.props.fname, this.props.index, value);
		}
	}
	handleChangeOfSearch(fnames, result){
		if(typeof result !== 'object'){
			this.props.callBacks.updateSingleField(this.props.fname, this.props.index, result);
		} else {
			this.props.callBacks.updateFields(_mapAO(fnames, (fn) => result[fn]));
		}
	}
	searchMember(name, callBack){
		this.props.callBacks.fetchData('get', '/api/members?q='+encodeURIComponent(name), (data) => {
			if(data && callBack) callBack(data.members);
		});
	}
	render(){
		const fAttrs = this.props.docData.fAttrs;
		const fAttr = fAttrs[this.props.fname];
		const isWithFocus = (this.props.fieldWithFocus.fname === this.props.fname && this.props.fieldWithFocus.index === this.props.index);
		switch(fAttr.form){
			case 'text':
				if(this.props.fname != 'name'){
					const placeholder = (this.props.fname == 'sentence' ? '2015-12-07' : null);
					const type = (fAttr.type == 'email' ? 'email' : null);
					return <TextInput type={type} value={this.props.value} focus={isWithFocus} placeholder={placeholder} onChange={this.handleChange.bind(this)} />;
				}
				else {
					const fnames = fAttrs[fAttrs[this.props.fname].parent].children;
					return (
						<SearchInput value={this.props.value} search={this.searchMember.bind(this)} resultFNames={fnames} focus={isWithFocus}
							onChange={this.handleChangeOfSearch.bind(this, fnames)}
						/>
					);
				}
			case 'file':
				let accept;
				if(fAttr.type == 'file') accept = '.pdf, .hwp, .doc, .docx';
				else if(fAttr.type == 'image') accept = '.jpg, .png';
				return (
					<FileInput value={this.props.value.name || this.props.value.filename} focus={isWithFocus}
						accept={accept} onChange={this.handleChange.bind(this)}
					/>
				);
			case 'select':
				let options = [];
				this.props.docData.taxonomy[this.props.fname].forEach((tid) => { if(tid){
					options.push(<Item key={tid} value={tid}><span>{this.props.docData.terms[tid]}</span></Item>);
				}});
				return (
					<Select selected={this.props.value} onChange={this.handleChange.bind(this)}>
						{options}
					</Select>
				);
			case 'radio':
				const radioItems =  this.props.docData.taxonomy[this.props.fname].map((tid) => (
					<Item key={tid} value={tid}><span>{this.props.docData.terms[tid]}</span></Item>
				));
				return (
					<Check multiple={false} selected={this.props.value} onChange={this.handleChange.bind(this)}
						checkIcon={<i className="pe-7f-check pe-va"></i>} uncheckIcon={<i className="pe-7s-less pe-va"></i>}
					>
						{radioItems}
					</Check>
				);
			case 'Ym':
				return <DateForm value={this.props.value} focus={isWithFocus} onChange={this.handleChange.bind(this)}/>;
			case 'textarea':
				let message, displayCount;
				switch(this.props.fname){
					case 'content':
						message = '* 200자 내외로 작성해주세요.';
						displayCount = true;
						break;
					case 'tag':
						message = '* 쉼표로 구분해주세요.';
						break;
					default:
				}
				return (
					<Textarea value={this.props.value} focus={isWithFocus} message={message} displayCount={displayCount} onChange={this.handleChange.bind(this)} />
				);
			case 'fieldset':
				let subFormFields = [];
				fAttr.children.forEach((fn) => {
					if(this.props.formCallBacks.isHiddenField(fn) === false){
						subFormFields.push(
							<DocumentField
								key={fn} fname={fn} value={this.props.callBacks.fieldValue(fn)} fieldWithFocus={this.props.fieldWithFocus}
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
	fieldWithFocus: PropTypes.object,
	docData: PropTypes.object.isRequired,
	callBacks: PropTypes.objectOf(PropTypes.func).isRequired,
	formCallBacks: PropTypes.object.isRequired
};

export default DocumentInputForm;
