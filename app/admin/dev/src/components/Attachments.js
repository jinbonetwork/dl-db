import React, {Component, PropTypes} from 'react';
import {Link, withRouter} from 'react-router';
import Check from '../accessories/Check';
import Item from '../accessories/Item';
import Select from '../accessories/Select';
import Pagination from '../accessories/Pagination';
import {_mapO, _pushpull, _wrap} from '../accessories/functions';

class Attachments extends Component {
	componentDidMount(){
		this.props.fetchAttachments(this.props.params);
	}
	componentDidUpdate(prevProps, prevState){
		if(JSON.stringify(prevProps.params) != JSON.stringify(this.props.params)){
			this.props.fetchAttachments(this.props.params);
		}
	}
	handleChange(which, arg1st, arg2nd){
		const keyword = this.props.keywordSearching;
		const field = this.props.fieldSearching;
		if(which == 'check'){
			let docId = arg1st, isChecked = arg2nd;
			this.props.onChange('selected', _pushpull(this.props.selected, docId));
		}
		else if(which == 'fieldSearching'){
			let value = arg1st;
			if(value == 'default'){
				if(keyword) this.props.onChange('keywordSearching', '');
				this.props.router.push('/admin/attachments');
			}
			else if((value == 'filename' || value == 'subject') && (field == 'status' || field == 'anonymity')){
				this.props.onChange('keywordSearching', '');
			}
			else if(value == 'parsed') this.props.onChange('keywordSearching', '');
			else if(value == 'anonymity') this.props.onChange('keywordSearching', '');
			this.props.onChange('fieldSearching', value);
		}
		else if(which == 'keywordSearching'){
			if(field == 'status' || field == 'anonymity'){
				let value = arg1st;
				this.props.onChange('keywordSearching', value);
				this.props.router.push('/admin/attachments/'+field+'/'+value);
			} else {
				let value = arg1st.target.value;
				if(field != 'default') this.props.onChange('keywordSearching', value);
			}
		}
		else if(which == 'upload'){
			const newFile = arg2nd.target.files[0];
			let formData = new FormData();
			formData.append(this.props.fData.fID.file, newFile);
			this.props.onUpload({fileId: arg1st.fileId, idxOfFiles: arg1st.idxOfFiles, newFile: arg2nd.target.files[0], formData});
		}
	}
	handleClick(which, arg1st){
		switch(which){
			case 'search':
				if(this.props.fieldSearching == 'default' || !this.props.keywordSearching){
					if(this.props.keywordSearching) this.props.onChange('keywordSearching', '');
					this.props.router.push('/admin/attachments');
				} else {
					this.props.router.push('/admin/attachments/'+this.props.fieldSearching+'/'+this.props.keywordSearching);
				}
				break;
			case 'toggle parsed':
				this.props.toggleParsed(arg1st); break;
			case 'toggle anonymity':
				this.props.toggleAnonymity(arg1st); break;
			case 'edit text':
				const file = arg1st, {docId, fileId} = arg1st;
				if(!this.props.openFileTexts[fileId]){
					this.props.addFileToOpenFileTexts(fileId, file);
				}
				this.props.router.push('/admin/filetext/'+docId+'/'+fileId); break;
			default:
		}
	}
	handleKeyDown(which, arg1st, arg2nd){
		if(which == 'keywordSearching'){
			let key = arg1st.key;
			if(key == 'Enter') this.handleClick('search');
		}
	}
	render(){
		const listMenu = (
			<tr className="attachments__menu">
				<td className="table-margin"></td>
				<td colSpan="6">
					<div>
						<Select selected={this.props.fieldSearching} onChange={this.handleChange.bind(this, 'fieldSearching')}>
							<Item value="default">전체목록</Item>
							<Item value="filename">파일이름</Item>
							<Item value="subject">문서제목</Item>
							<Item value="status">텍스트화</Item>
							<Item value="anonymity">익명화</Item>
						</Select>
						{(this.props.fieldSearching != 'status' && this.props.fieldSearching != 'anonymity') && [
							<input key="0" type="text" className="attachments__keyword" value={this.props.keywordSearching}
								onChange={this.handleChange.bind(this, 'keywordSearching')}
								onKeyDown={this.handleKeyDown.bind(this, 'keywordSearching')}
							/>,
							<a key="1" className="attachments__search" tabIndex="0" onClick={this.handleClick.bind(this, 'search')}><span>검색</span></a>
						]}
						{(this.props.fieldSearching == 'status') && (
							<Check type="radio" selected={this.props.keywordSearching} onChange={this.handleChange.bind(this, 'keywordSearching')}>
								<Item value="unparsed">미완료</Item>
								<Item value="parsed">완료</Item>
							</Check>
						)}
						{(this.props.fieldSearching == 'anonymity') && (
							<Check type="radio" selected={this.props.keywordSearching} onChange={this.handleChange.bind(this, 'keywordSearching')}>
								<Item value="0">미완료</Item>
								<Item value="1">완료</Item>
							</Check>
						)}
					</div>
				</td>
				<td className="table-margin"></td>
			</tr>
		);
		const listHead = (
			<tr className="attachments__head">
				<td className="table-margin"></td>
				<td className="table-padding"></td>
				<td>파일이름</td>
				<td>텍스트화</td>
				<td>익명화</td>
				<td></td>
				<td className="table-padding"></td>
				<td className="table-margin"></td>
			</tr>
		);
		const list = this.props.attachments.map((file, idxOfFiles) => {
			const isComplete = (file.status == 'unparsed' || file.status == 'parsed' || file.status == 'ing')
			return (
				<tr key={'file'+file.fileId}>
					<td className="table-margin"></td>
					<td className="table-padding"></td>
					<td className="attachments__filename">
						<span>{file.fileName}</span>
						{ isComplete && [
							<a key="name" href={file.fileUri} target="_blank"><i className="pe-7s-download pe-va"></i></a>,
							<a key="edit" onClick={this.handleClick.bind(this, 'edit text', file)}>TEXT</a>]
						}
					</td>
					<td className="attachments__toggle">
						{file.status === 'unparsed' && [
							<span key="button" className="attachments__toggle--off"
								onClick={this.handleClick.bind(this, 'toggle parsed', {idxOfFiles, fileId: file.fileId, status: 'parsed'})}
							>
								<i className="pe-7s-switch pe-va"></i>
							</span>,
							<span key="label">미완료</span>
						]}
						{file.status === 'parsed' && [
							<span key="button" className="attachments__toggle--on"
								onClick={this.handleClick.bind(this, 'toggle parsed', {idxOfFiles, fileId: file.fileId, status: 'unparsed'})}
							>
								<i className="pe-7f-switch pe-flip-horizontal pe-va"></i>
							</span>,
							<span key="label">완료</span>
						]}
						{file.status === 'ing' && (
							<span className="attachments__toggle--off">
								<i className="pe-7s-switch pe-va"></i>
							</span>)
						}
						{/*(file.status === 'uploading' || file.status === 'uploaded') && (
							<span className="attachments__toggle--ing">
								<i className="pe-7s-config pe-va pe-spin"></i>
							</span>)
						*/}
					</td>
					<td className="attachments__toggle">
						{(isComplete && file.anonymity === false) && [
							<span key="button" className="attachments__toggle--off"
								onClick={this.handleClick.bind(this, 'toggle anonymity', {idxOfFiles, fileId: file.fileId, status: true})}
							>
								<i className="pe-7s-switch pe-va"></i>
							</span>,
							<span key="label">미완료</span>
						]}
						{(isComplete && file.anonymity === true) && [
							<span key="button" className="attachments__toggle--on"
								onClick={this.handleClick.bind(this, 'toggle anonymity', {idxOfFiles, fileId: file.fileId, status: false})}
							>
								<i className="pe-7f-switch pe-flip-horizontal pe-va"></i>
							</span>,
							<span key="label">완료</span>
						]}
						{(isComplete && file.anonymity !== true && file.anonymity !== false) && (
							<span className="attachments__toggle--off">
								<i className="pe-7s-switch pe-va"></i>
							</span>
						)}
					</td>
					<td className="attachments__upload">
						{ isComplete &&
							<label>
								<i className="pe-7s-upload"></i>
								<input type="file" ref="inputFile" style={{display: 'none'}} value="" accept=".pdf, .hwp, .doc, .docx"
									onChange={this.handleChange.bind(this, 'upload', {idxOfFiles, fileId: file.fileId})}
								/>
							</label>
						}
					</td>
					<td className="table-padding"></td>
					<td className="table-margin"></td>
				</tr>
			);
		});
		const {urlOptions, page} = _wrap(() => {
			let {param1, param2, param3, param4} = this.props.params;
			if(param1 == 'page') return {urlOptions: 'page/', page: parseInt(param2)};
			if(param1 && param2){
				return {urlOptions: param1+'/'+param2+'/page/', page: (param3 == 'page' && param4 > 0 ? parseInt(param4) : 1)}
			}
			return {urlOptions: 'page/', page: 1};
		});
		return (
			<div className="attachments">
				<h1>첨부파일 목록</h1>
				<table className="attachments__list"><tbody>
					{listMenu}
					{listHead}
					{list}
				</tbody></table>
				<Pagination url={'/admin/attachments/'+urlOptions} page={page} lastPage={this.props.lastPage} />
			</div>
		);
	}
}

Attachments.propTypes = {
	fData: PropTypes.object.isRequired,
	attachments: PropTypes.array.isRequired,
	openFileTexts: PropTypes.object.isRequired,
	lastPage: PropTypes.number.isRequired,
	fieldSearching: PropTypes.string.isRequired,
	keywordSearching: PropTypes.string.isRequired,
	fetchAttachments: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	addFileToOpenFileTexts: PropTypes.func.isRequired,
	onUpload: PropTypes.func.isRequired,
	router: PropTypes.shape({
		push: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(Attachments);
