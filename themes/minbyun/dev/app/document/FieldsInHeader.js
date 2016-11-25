import React, {Component, PropTypes} from 'react';
import ImageWrap from './ImageWrap';
import LinkIf from '../accessories/LinkIf';
import {Table, Row, Column} from '../accessories/Table';
import {_fieldAttrs} from '../schema/docSchema';
import {_displayDate, _isCommon} from '../accessories/functions';

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
		let areYouOwner = _isCommon(['admin'], this.props.userRole) || this.props.document.owner;
		let canYouDownload = _isCommon(['download'], this.props.userRole) || areYouOwner;
		let isItDownload = (this.props.document['access'] == 33); // 33: 다운로드

		let fileList = this.props.document[this.props.fname].map((file, i) => (
			<li key={i}>
				<LinkIf tag="a" to={file.fileuri} if={isItDownload && canYouDownload} notIf="visible">{file.filename}</LinkIf>
				{(file.status != 'parsed' && areYouOwner) && <i className="docuement__attention pe-7f-attention pe-va"></i>}
				{areYouOwner &&
					<button type="button" className="document__filetext"
						onClick={this.handleClick.bind(this, 'fileText', {fid: file.fid, filename: file.filename})}>
						<span>TEXT</span>
					</button>
				}
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
