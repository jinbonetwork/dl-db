import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import {TextArea, Input} from 'react-text-input';
import {extracFileData} from '../fieldData/docFieldData';
import {_mapO, _wrap, _isCommon} from '../accessories/functions';

class FileText extends Component {
	componentDidMount(){
		if(!_isCommon([this.props.role], ['administrator', 'view'])){
			this.props.showMessage('권한이 없습니다.', this.props.router.goBack); return;
		}
		const {docId, fileId} = this.props.params;
		if(this.props.openDocs[docId]){
			this.getFile();
		} else {
			this.props.fetchDoc(docId, () => this.getFile());
		}
	}
	getFile(){
		const {docId, fileId} = this.props.params;
		if(!this.props.openDocs[docId].owner){this.props.showMessage('권한이 없습니다.', this.props.router.goBack); return;}
		//extract file infomation ////
		let files = extracFileData(this.props.openDocs[docId], this.props.fData).file;
		let theFile = files.find((f) => (f.fid == fileId));
		if(!theFile || (theFile.status != 'parsed' && theFile.status != 'unparsed')){
			this.props.showMessage('파일 텍스트가 존재하지 않습니다.', this.props.router.goBack); return;
		}
		this.props.onChange(theFile);
		// get the file text ////
		if(this.props.openFileTexts[fileId]){
			this.props.onChange(this.props.openFileTexts[fileId]);
		} else {
			this.props.fetchFileText(docId, fileId, () => this.props.onChange(this.props.openFileTexts[fileId]));
		}
	}
	handleChange(event){
		this.props.onChange({text: event.target.value});
	}
	handleClick(which, arg1st){
		const {docId, fileId} = this.props.params;
		if(which == 'submit'){
			let formData = new FormData(); formData.append('text', this.props.fileText.text);
			this.props.onSubmit({docId, fileId, text: this.props.fileText.text, formData, oldText: this.props.openFileTexts[fileId].text});
		}
		else if(which == 'status'){
			this.props.toggleParsed({docId, fileId, oldStatus: this.props.fileText.status});
		}
	}
	render(){
		const {fileText} = this.props;
		return (
			<div className="filetext">
				<div className="filetext__title"><span>{fileText.filename}</span></div>
				<ul className="filetext__header">{
					_mapO(fileText.header, (pn, pv) => (
						<li key={pn}>
							<span>{pn}</span>
							<span>: </span>
							<span>{pv}</span>
						</li>
					))
				}</ul>
				<div className="filetext__buttons">
					<div className="filetext__border-of-buttons">
						<a className="filetext__submit" tabIndex="0" onClick={this.handleClick.bind(this, 'submit')}>
							<span>{(!this.props.isSaving ? '수정하기' : '수정중')}</span>
						</a>
						<div className="filetext__parsed">
							<span className="filetext__parsed-label">텍스트화</span>
							{(fileText.status == 'unparsed') && [
								<a key="switch" tabIndex="0" onClick={this.handleClick.bind(this, 'status')}>
									<i className="pe-7s-switch pe-va"></i>
								</a>,
								<span className="filetext__parsed-state" key="state">미완료</span>
							]}
							{(fileText.status == 'parsed') && [
								<a key="switch" tabIndex="0" onClick={this.handleClick.bind(this, 'status')}>
									<i className="pe-7f-switch pe-flip-horizontal pe-va"></i>
								</a>,
								<span className="filetext__parsed-state" key="state">완료</span>
							]}
							{(fileText.status != 'unparsed' && fileText.status != 'parsed') && (
								<span ><i className="pe-7s-switch pe-va"></i></span>
							)}
						</div>
					</div>
				</div>
				<TextArea className="filetext__textarea"
					value={fileText.text}
					onChange={this.handleChange.bind(this)}
				/>
			</div>
		);
	}
}
FileText.propTypes = {
	role: PropTypes.array.isRequired,
	fData: PropTypes.object.isRequired,
	openDocs: PropTypes.object.isRequired,
	openFileTexts: PropTypes.object.isRequired,
	fileText: PropTypes.object.isRequired,
	isSaving: PropTypes.bool,
	fetchDoc: PropTypes.func.isRequired,
	fetchFileText: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	toggleParsed: PropTypes.func.isRequired,
	showMessage: PropTypes.func.isRequired,
	router: PropTypes.shape({
		push: PropTypes.func.isRequired,
		goBack: PropTypes.func.isRequired
	}).isRequired
};
export default withRouter(FileText);
