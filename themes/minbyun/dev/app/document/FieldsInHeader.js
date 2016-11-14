import React, {Component, PropTypes} from 'react';
import ImageWrap from './ImageWrap';
import Table from '../table/Table';
import Row from '../table/Row';
import Column from '../table/Column';
import func from '../functions';

class FieldsInHeader extends Component {
	images(){
		let paths = this.props.value.map((img) => (img.fileuri));
		if(paths.length == 0) return null;
		return <ImageWrap paths={paths} />
	}
	date(){
		let date = this.props.value.map((d) => func.displayDate(d));
		return (
			<Row>
				<Column className="table__label">{this.props.subject}</Column>
				<Column>{date.join(', ')}</Column>
			</Row>
		);
	}
	files(){
		let fileList = this.props.value.map((file, i) => (
			<li key={i}>
				<span>{(i+1)+'.'}</span>
				{file.link && <a href={file.fileuri} target="_blank">{file.filename}</a>}
				{!file.link && <span>{file.filename}</span>}
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
		switch(this.props.type){
			case 'image': return this.images();
			case 'date': return this.date();
			case 'file': return this.files();
			default: return null;
		}
	}
}
FieldsInHeader.propTypes = {
	type: PropTypes.string.isRequired,
	value: PropTypes.array.isRequired,
	subject: PropTypes.string.isRequired
};

export default FieldsInHeader;
