import React, {Component, PropTypes} from 'react';
import {TextArea, Input} from 'react-text-input';
import {_mapO, _wrap} from '../accessories/functions';

class FileText extends Component {
	componentDidMount(){
		const {docId, fileId} = this.props.params;
		const openFileText = this.props.openFileTexts[fileId];
		if(!openFileText){
			['text', 'file'].forEach((which) => {
				this.props.fetchFileText(which, docId, fileId, () => {
					this.props.onChange(this.props.openFileTexts[fileId]);
				});
			});
		} else { //openFileText가 존재한다면, openFileText.fileName은 반드시 존재한다.
			if(!openFileText.text){
				this.props.fetchFileText('text', docId, fileId, () => {
					this.props.onChange(this.props.openFileTexts[fileId]);
				});
			} else {
				this.props.onChange(openFileText);
			}
		}
	}
	handleChange(event){
		this.props.onChange({text: event.target.value});
	}
	handleClick(which, arg1st){
		if(which == 'submit'){
			const {docId, fileId, text} = this.props.fileText;
			let formData = new FormData(); formData.append('text', text);
			this.props.onSubmit(docId, fileId, text, formData);
		}
		else if(which == 'status'){
			const status = arg1st;
			this.props.toggleParsed(this.props.fileText.fileId, status);
		}
	}
	render(){
		return (
			<div className="filetext">
				<div className="filetext__title"><span>{this.props.fileText.fileName}</span></div>
				<ul className="filetext__header">{
					_mapO(this.props.fileText.header, (pn, pv) => (
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
							{(this.props.fileText.status == 'uploaded') && [
								<a key="switch" tabIndex="0" onClick={this.handleClick.bind(this, 'status', 'parsed')}>
									<i className="pe-7s-switch pe-va"></i>
								</a>,
								<span className="filetext__parsed-state" key="state">미완료</span>
							]}
							{(this.props.fileText.status == 'parsed') && [
								<a key="switch" tabIndex="0" onClick={this.handleClick.bind(this, 'status', 'uploaded')}>
									<i className="pe-7f-switch pe-flip-horizontal pe-va"></i>
								</a>,
								<span className="filetext__parsed-state" key="state">완료</span>
							]}
							{(this.props.fileText.status === 'ing') && (
								<span ><i className="pe-7s-switch pe-va"></i></span>
							)}
						</div>
					</div>
				</div>
				<TextArea className="filetext__textarea"
					value={this.props.fileText.text}
					onChange={this.handleChange.bind(this)}
				/>
			</div>
		);
	}
}
FileText.propTypes = {
	openFileTexts: PropTypes.object.isRequired,
	fileText: PropTypes.object.isRequired,
	isSaving: PropTypes.bool,
	fetchFileText: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	toggleParsed: PropTypes.func.isRequired
};
export default FileText;
