import React, {Component, PropTypes} from 'react';
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
	}
	handleClick(which, arg1st){
		switch(which){
			case 'delete docs':
				if(!this.props.isDelBtnYesOrNo){
					this.props.onChange('isDelBtnYesOrNo', true); break;
				} else {
					break;
				}
			case 'cancel deleting docs':
				this.props.onChange('isDelBtnYesOrNo', false); break;
			default:
		}
	}
	render(){
		const deletButton = (!this.props.isDelBtnYesOrNo ?
			<button className="attachments__delete-docs" onClick={this.handleClick.bind(this, 'delete docs')}>
				<i className="pe-7s-less pe-va"></i><span>삭제</span>
			</button> :
			<div className="attachments__confirm-del-docs">
				<button onClick={this.handleClick.bind(this, 'delete docs')}>예</button>
				<button onClick={this.handleClick.bind(this, 'cancel deleting docs')}>아니오</button>
			</div>
		);
		const listMenu = null;
		const listHead = (
			<tr>
				<td className="table-margin"></td>
				<td className="table-padding"></td>
				<td></td>
				<td>문서 제목 및 첨부파일</td>
				<td>텍스트화</td>
				<td>익명화</td>
				<td className="table-padding"></td>
				<td className="table-margin"></td>
			</tr>
		);
		const list = this.props.attachments.map((item) => {
			let rowSpan = item.files.length + 2;
			let title = (
				<tr key={'title'+item.docId}>
					<td className="table-margin" rowSpan={rowSpan}></td>
					<td className="table-padding" rowSpan={rowSpan}></td>
					<td rowSpan={rowSpan}>
						<CheckBox
							check={this.props.selected.indexOf(item.docId) >= 0}
							onChange={this.handleChange.bind(this, 'check', item.docId)}
						/>
					</td>
					<td>
						<a href={'/document/'+item.docId}>{item.title}</a>
						<a href={'/document/'+item.docId+'/edit'}><i className="pe-7s-note pe-va"></i></a>
					</td>
					<td colSpan="2"></td>
					<td className="table-padding" rowSpan={rowSpan}></td>
					<td className="table-margin" rowSpan={rowSpan}></td>
				</tr>
			);
			let files = item.files.map((file) => (
				<tr key={'file'+file.fileId}>
					<td>
						<a href={file.fileUri} target="_blank">{file.fileName}</a>
						<span>TEXT</span>
					</td>
					<td>
						{file.parsed === false && <span><i className="pe-7s-switch pe-va"></i></span>}
						{file.parsed === true && <span><i className="pe-7f-switch pe-flip-horizontal pe-va"></i></span>}
						{file.parsed === undefined && <span><i className="pe-7s-config pe-va pe-spin"></i></span>}
					</td>
					<td><span><i className="pe-7s-switch pe-va"></i></span></td>
				</tr>
			));
			let divisionLine = (<tr key={'divisionLine'+item.docId} className="table-division-line" colSpan="8"></tr>);
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
	fetchAttachments: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default Attachments;
