import React, {Component, PropTypes} from 'react';
import {Table, Row, Column} from '../Table';

class FieldsInContents extends Component {
	content(){
		let fid = (this.props.field.fid > 0 ? 'f'+this.props.field.fid : this.props.field.fid);
		switch(this.props.field.type){
			case 'char': case 'taxonomy':
				return this.props.document[fid].join(', ');
			case 'textarea':
				return this.props.document[fid].map((text, i) => <p key={i}>{text}</p>);
			case 'group':
				let inSubontent = [];
				this.props.formData.fields.forEach((f) => {
					if(f.type != 'group' && f.parent == this.props.field.fid && this.props.document['f'+f.fid].length > 0){
						inSubontent[f.idx] = (
							<FieldsInContents key={f.fid} field={f} formData={this.props.formData} document={this.props.document} />
						);
					}
				});
				if(inSubontent.length > 0){
					return <Table className="inner-table">{inSubontent}</Table>;
				} else {
					return null;
				}
			default:
				return '';
		}
	}
	render(){
		let content = this.content();
		if(content){
			return (
				<Row>
					<Column className="table__label">{this.props.field.subject}</Column>
					<Column>{content}</Column>
				</Row>
			);
		} else {
			return null;
		}
	}
}
FieldsInContents.propTypes = {
	field: PropTypes.object.isRequired,
	document: PropTypes.object.isRequired,
	formData: PropTypes.object.isRequired
};

export default FieldsInContents;
