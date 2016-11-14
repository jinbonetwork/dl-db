import React, {Component, PropTypes} from 'react';
import ImageWrap from './ImageWrap';
import Table from '../table/Table';
import Row from '../table/Row';
import Column from '../table/Column';
import func from '../functions';

class FieldsInHeader extends Component {
	images(){
		let paths;
		if(this.props.field.multiple == '1'){

			paths = this.props.document['f'+this.props.field.fid].map((img) => ('/files'+img.fileuri));
		} else {
			paths.push('/files'+this.props.document['f'+this.props.field.fid].filepath);
		}
		return <ImageWrap paths={paths} />
	}
	date(){
		let date;
		if(this.props.field.multiple == '1'){
			date = this.props.document['f'+this.props.field.fid].map((d) => func.displayDate(d));
		} else {
			date = [func.displayDate(this.props.document['f'+this.props.field.fid])];
		}
		return (
			<Row>
				<Column className="table__label">{this.props.field.subject}</Column>
				<Column>{date.join(', ')}</Column>
			</Row>
		);
	}
	files(){
		let files;
		if(this.props.field.multiple == '1'){
			files = this.props.document['f'+this.props.field.fid].map((file) => ({name: file.filename, path: file.filepath}));
		} else {
			files = [{name: this.props.document['f'+filed.fid].filename, path: this.props.document['f'+filed.fid].filepath}];
		}
		let fileList = files.map((file, i) => (
			<li key={i}>
				<span>{(i+1)+'.'}</span>
				<a href={'/files'+file.path} target="_blank">{file.name}</a>
			</li>
		));
		return (
			<Row>
				<Column className="table__label">다운로드</Column>
				<Column><ul>{fileList}</ul></Column>
			</Row>
		);
	}
	render(){
		switch(this.props.field.type){
			case 'image': return this.images();
			case 'date': return this.date();
			case 'file': return this.files();
			default: return null;
		}
	}
}
FieldsInHeader.propTypes = {
	field: PropTypes.object.isRequired,
	document: PropTypes.object.isRequired
};

export default FieldsInHeader;
