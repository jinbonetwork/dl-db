import React, {Component, PropTypes} from 'react';
import Table from '../table/Table';
import Row from '../table/Row';
import Column from '../table/Column';

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
					if(f.parent == this.props.field.fid){
						inSubontent[f.idx] = (
							<FieldsInContents key={f.fid} field={f} formData={this.props.formData} document={this.props.document} />
						);
					}
				});
				return <Table className="inner-table">{inSubontent}</Table>;
			default:
				return '';
		}
	}
	render(){
		return (
			<Row>
				<Column className="table__label">{this.props.field.subject}</Column>
				<Column>{this.content()}</Column>
			</Row>
		);
	}
}
FieldsInContents.propTypes = {
	field: PropTypes.object.isRequired,
	document: PropTypes.object.isRequired,
	formData: PropTypes.object.isRequired
};

export default FieldsInContents;
