import React, {Component, PropTypes} from 'react';
import Check from '../accessories/Check';
import Item from '../accessories/Item';
import CheckBox from '../accessories/CheckBox';
import Pagination from '../accessories/Pagination';
import {_mapO, _pushpull} from '../accessories/functions';

class Attachments extends Component {
	componentDidMount(){
		this.props.fetchAttachments(this.props.params.page);
	}
	componentDidUpdate(prevProps, prevState){
		if(prevProps.params.page != this.props.params.page || this.props.attachments.length == 0){
			this.props.fetchUserList(this.props.params.page);
		}
	}
	handleChange(which, arg1st, arg2nd){
		if(which == 'check'){
			let docId = arg1st, isChecked = arg2nd;
			this.props.onChange('selected', _pushpull(this.props.selected, docId));
		}
		else if(which == 'sorted by'){
			let sortedBy = arg1st;
			this.props.onChange('sortedBy', sortedBy);
		}
	}
	handleClick(which, arg1st){
		switch(which){
			case 'delete docs':
				if(!this.props.isDelBtnYesOrNo){
					this.props.onChange('isDelBtnYesOrNo', true); break;
				} else {
					this.props.deleteDocs(this.props.selected); break;
				}
			case 'cancel deleting docs':
				this.props.onChange('isDelBtnYesOrNo', false); break;
			case 'toggle parsed':
				this.props.toggleParsed(arg1st); break;
			case 'toggle anonymity':
				this.props.toggleAnonymity(arg1st); break;
			case 'edit text':
				//this.props.onChange('fileTextToEdit', arg1st);
			default:
		}
	}
	render(){
		const deleteButton = (!this.props.isDelBtnYesOrNo ?
			<a className="attachments__delete-docs" onClick={this.handleClick.bind(this, 'delete docs')}>
				<i className="pe-7s-close pe-va"></i><span>삭제</span>
			</a> :
			<span className="attachments__confirm-del-docs">
				<a onClick={this.handleClick.bind(this, 'delete docs')}>예</a>
				<a onClick={this.handleClick.bind(this, 'cancel deleting docs')}>아니오</a>
			</span>
		);
		const listMenu = (
			<tr className="attachments__menu">
				<td className="table-margin"></td>
				{/*<td colSpan="7">*/}
				<td colSpan="6">
					<div className="attachments__sort">
						<Check type="radio" selected={this.props.sortedBy} onChange={this.handleChange.bind(this, 'sorted by')}>
							<Item value="time">최신순</Item>
							<Item value="parsing">텍스트화 미완료</Item>
							<Item value="anonymity">익명화 미완료</Item>
						</Check>
					</div>
					{/*deleteButton*/}
				</td>
				<td className="table-margin"></td>
			</tr>
		);
		const listHead = (
			<tr className="attachments__head">
				<td className="table-margin"></td>
				<td className="table-padding"></td>
				{/*<td></td>*/}
				<td colSpan="2">문서 제목 및 첨부파일</td>
				<td>텍스트화</td>
				<td>익명화</td>
				<td className="table-padding"></td>
				<td className="table-margin"></td>
			</tr>
		);
		const list = this.props.attachments.map((item, idxOfList) => {
			let rowSpan = item.files.length + 1;
			let title = (
				<tr key={'title'+item.docId}>
					<td className="table-margin" rowSpan={rowSpan}></td>
					<td className="table-padding" rowSpan={rowSpan}></td>
					{/*<td rowSpan={rowSpan}>
						<CheckBox
							check={this.props.selected.indexOf(item.docId) >= 0}
							onChange={this.handleChange.bind(this, 'check', item.docId)}
						/>
					</td>*/}
					<td className="attachments__title"><a href={'/document/'+item.docId}>{item.title}</a></td>
					<td className="attachments__edit-doc"><a href={'/document/'+item.docId+'/edit'}><i className="pe-7s-note pe-va"></i></a></td>
					<td colSpan="2"></td>
					<td className="table-padding" rowSpan={rowSpan}></td>
					<td className="table-margin" rowSpan={rowSpan}></td>
				</tr>
			);
			let files = item.files.map((file, idxOfFiles) => (
				<tr key={'file'+file.fileId}>
					<td className="attachments__filename"><i className="pe-7s-file pe-va"></i><a href={file.fileUri} target="_blank">{file.fileName}</a></td>
					<td className="attachments__edit-text">
						{/*<a onClick={this.handleClick.bind(this, 'edit text', {docId: item.docId, fileId: file.fileId})}>TEXT</a>*/}
						<a href={'/document/'+item.docId+'/text/'+file.fileId}>TEXT</a>
					</td>
					<td className="attachments__toggle">
						{file.status === 'uploaded' && [
							<span key="button" className="attachments__toggle--off"
								onClick={this.handleClick.bind(this, 'toggle parsed', {idxOfList, idxOfFiles, fileId: file.fileId, status: 'parsed'})}
							>
								<i className="pe-7s-switch pe-va"></i>
							</span>,
							<span key="label">미완료</span>
						]}
						{file.status === 'parsed' && [
							<span key="button" className="attachments__toggle--on"
								onClick={this.handleClick.bind(this, 'toggle parsed', {idxOfList, idxOfFiles, fileId: file.fileId, status: 'uploaded'})}
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
						{file.status === 'uploading' && (
							<span className="attachments__toggle--ing">
								<i className="pe-7s-config pe-va pe-spin"></i>
							</span>)
						}
					</td>
					<td className="attachments__toggle">
						{file.anonymity === false && [
							<span key="button" className="attachments__toggle--off"
								onClick={this.handleClick.bind(this, 'toggle anonymity', {idxOfList, idxOfFiles, fileId: file.fileId, status: true})}
							>
								<i className="pe-7s-switch pe-va"></i>
							</span>,
							<span key="label">미완료</span>
						]}
						{file.anonymity === true && [
							<span key="button" className="attachments__toggle--on"
								onClick={this.handleClick.bind(this, 'toggle anonymity', {idxOfList, idxOfFiles, fileId: file.fileId, status: false})}
							>
								<i className="pe-7f-switch pe-flip-horizontal pe-va"></i>
							</span>,
							<span key="label">완료</span>
						]}
						{file.anonymity === undefined && (
							<span className="attachments__toggle--off">
								<i className="pe-7s-switch pe-va"></i>
							</span>
						)}
					</td>
				</tr>
			));
			let divisionLine = (
				<tr className="table-division-line" key={'divisionLine'+item.docId}>
					<td className="table-margin"></td>
					<td className="table-padding"></td>
					{/*<td colSpan="5"></td>*/}
					<td colSpan="4"></td>
					<td className="table-padding"></td>
					<td className="table-margin"></td>
				</tr>
			);
			return [title, files, divisionLine];
		});
		const page = (this.props.params.page ? parseInt(this.props.params.page) : 1);
		return (
			<div className="attachments">
				<h1>첨부파일 목록</h1>
				<table className="attachments__list"><tbody>
					{listMenu}
					{listHead}
					{list}
				</tbody></table>
				<Pagination url="/admin/attachments/page/" page={page} lastPage={this.props.lastPage} />
			</div>
		);
	}
}

Attachments.propTypes = {
	attachments: PropTypes.array.isRequired,
	lastPage: PropTypes.number.isRequired,
	selected: PropTypes.array.isRequired,
	isDelBtnYesOrNo: PropTypes.bool,
	sortedBy: PropTypes.string.isRequired,
	fetchAttachments: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default Attachments;
