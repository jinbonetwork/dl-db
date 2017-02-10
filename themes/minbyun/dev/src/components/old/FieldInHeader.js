import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import ImageWrap from './ImageWrap';
import LinkIf from '../accessories/LinkIf';
import {Table, Row, Column} from '../accessories/Table';
import {_displayDate, _isCommon} from '../accessories/functions';

class FieldInHeader extends Component {
	date(){
		return (
			<Row>
				<Column>{this.props.docData.fAttrs[this.props.fname].displayName}</Column>
				<Column>{_displayDate(this.props.document[this.props.fname])}</Column>
			</Row>
		);
	}
	files(){
		const document = this.props.document;
		const fAttrs = this.props.docData.fAttrs;
		const terms = this.props.docData.terms;
		const userRole = this.props.userRole;

		let areYouOwner = _isCommon(['admin'], userRole) || document.owner;
		let canYouDownload = _isCommon(['download'], userRole) || areYouOwner;
		let isAccessDownload = fAttrs.access && !fAttrs.access.multiple && document['access'] && (terms[document['access']].slug == 'download');

		let fileList = document.file.map((file, i) => (
			<li key={i}>
				<LinkIf tag="a" to={file.fileuri} if={isAccessDownload && canYouDownload} notIf="visible">{file.filename}</LinkIf>
				{(file.status != 'parsed' && areYouOwner) && <span className="document__attention"><span>&#9888;</span></span>}
				{areYouOwner &&
					<Link className="document__filetext" to={'/document/'+document.id+'/text/'+file.fid}>
						<span>TEXT</span>
					</Link>
				}
			</li>
		));
		return (
			<Row>
				<Column>
					<i className="pe-7s-download pe-va"></i> {fAttrs[this.props.fname].displayName}
				</Column>
				<Column><ol>{fileList}</ol></Column>
			</Row>
		);
	}
	render(){
		const fname = this.props.fname;
		if(this.props.docData.fAttrs[fname]){
			switch(fname){
				case 'image': return <ImageWrap uris={[this.props.document[fname].fileuri]} />;
				case 'date': return this.date();
				case 'file': return this.files();
				default:
					console.error(fname+': 적합한 fname이 아닙니다.');
					return null;
			}
		} else {
			return null;
		}
	}
}
FieldInHeader.propTypes = {
	fname: PropTypes.string.isRequired,
	document: PropTypes.object.isRequired,
	userRole: PropTypes.array.isRequired,
	docData: PropTypes.object.isRequired
};

export default FieldInHeader;
