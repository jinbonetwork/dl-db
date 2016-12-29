import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import ImageWrap from './ImageWrap';
import LinkIf from '../accessories/LinkIf';
import {Table, Row, Column} from '../accessories/Table';
import {_isAccessDownload} from '../schema/docSchema';
import {_displayDate, _isCommon} from '../accessories/functions';

class FieldsInHeader extends Component {
	date(){
		return (
			<Row>
				<Column>{this.props.docData.fAttrs[this.props.fname].displayName}</Column>
				<Column>{_displayDate(this.props.document[this.props.fname])}</Column>
			</Row>
		);
	}
	files(){
		let areYouOwner = _isCommon(['admin'], this.props.userRole) || this.props.document.owner;
		let canYouDownload = _isCommon(['download'], this.props.userRole) || areYouOwner;
		let isAccessDownload = _isAccessDownload(this.props.document['access']); // 34: 다운로드

		let fileList = this.props.document[this.props.fname].map((file, i) => (
			<li key={i}>
				<LinkIf tag="a" to={file.fileuri} if={isAccessDownload && canYouDownload} notIf="visible">{file.filename}</LinkIf>
				{(file.status != 'parsed' && areYouOwner) && <span className="document__attention"><span>&#9888;</span></span>}
				{areYouOwner &&
					<Link className="document__filetext" to={'/document/'+this.props.document.id+'/text/'+file.fid}>
						<span>TEXT</span>
					</Link>
				}
			</li>
		));
		return (
			<Row>
				<Column>
					<i className="pe-7s-download pe-va"></i> {this.props.docData.fAttrs[this.props.fname].displayName}
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
	userRole: PropTypes.array.isRequired
};

export default FieldsInHeader;
