import React, {Component, PropTypes} from 'react';
import ImageWrap from './ImageWrap';
import {Table, Row, Column} from '../Table';
import {_fieldAttrs} from '../docSchema';
import {_displayDate, _isCommon} from '../functions';

class FieldsInHeader extends Component {
	handleClick(what, args, event){
		if(what == 'fileText'){
			this.props.callBacks.setFileTextEditor(args.fid, args.filename);
		}
	}
	date(){
		return (
			<Row>
				<Column className="table__label">{_fieldAttrs[this.props.fname].displayName}</Column>
				<Column>{_displayDate(this.props.document[this.props.fname])}</Column>
			</Row>
		);
	}
	files(){
		let canYouDownload = _isCommon([1, 5], this.props.userRole);
		let areYouAdmin = _isCommon([1], this.props.userRole);
		let canYouWrite = _isCommon([1, 3], this.props.userRole);
		let isItAnchor = (this.props.document['access'] == 33); // 33: 다운로드

		let fileList = this.props.document[this.props.fname].map((file, i) => (
			<li key={i}>
				{(isItAnchor && canYouDownload) && <a href={file.fileuri} target="_blank">{file.filename}</a>}
				{((isItAnchor && !canYouDownload) || !isItAnchor) && <span>{file.filename}</span>}
				{(file.status != 'parsed' && areYouAdmin) && <i className="docuement__attention pe-7f-attention pe-va"></i>}
				<button type="button" className="document__filetext"
					onClick={this.handleClick.bind(this, 'fileText', {fid: file.fid, filename: file.filename})}>
					<span>TEXT</span>
				</button>
			</li>
		));
		return (
			<Row>
				<Column className="table__label">
					<i className="pe-7s-download pe-va"></i> {_fieldAttrs[this.props.fname].displayName}
				</Column>
				<Column><ol>{fileList}</ol></Column>
			</Row>
		);
	}
	render(){
		switch(this.props.fname){
			case 'image': return <ImageWrap uris={[this.props.document[this.props.fname].fileuri]} />;
			case 'date': return this.date();
			case 'file': return this.files();
			default: return null;
		}
	}
}
FieldsInHeader.propTypes = {
	fname: PropTypes.string.isRequired,
	document: PropTypes.object.isRequired,
	userRole: PropTypes.array.isRequired,
	callBacks: PropTypes.objectOf(PropTypes.func).isRequired
};

export default FieldsInHeader;
