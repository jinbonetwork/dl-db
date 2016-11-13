import React, {Component, PropTypes} from 'react';
import Table from '../table/Table';
import Row from '../table/Row';
import Column from '../table/Column';

class FieldsInContents extends Component {
	char(){
		let fid = (this.props.field.fid > 0 ? 'f'+this.props.field.fid : this.props.field.fid);
		let texts;
		if(this.props.field.multiple == '1'){
			texts = this.props.document[fid];
		} else {
			texts = [this.props.document[fid]];
		}
		return texts.join(', ');
	}
	textarea(){
		let fid = (this.props.field.fid > 0 ? 'f'+this.props.field.fid : this.props.field.fid);
		let texts;
		if(this.props.field.multiple == '1'){
			texts = this.props.document[fid];
		} else {
			texts = [this.props.document[fid]];
		}
		return texts.map((text, i) => <p key={i}>{text}</p>);
	}
	taxonomy(){
		let tids;
		if(this.props.field.multiple == '1'){
			tids = this.props.document['f'+this.props.field.fid];
		} else {
			tids = [this.props.document['f'+this.props.field.fid]];
		}
		let terms = tids.map((tid) => {
			let term = this.props.formData.taxonomy[this.props.field.cid].find((t) => t.tid == tid);
			return term.name;
		});
		return terms.join(', ');
	}
	group(){
		let inSubontent = [];
		this.props.formData.fields.forEach((f) => {
			if(f.parent == this.props.field.fid){
				inSubontent[f.idx] = (
					<FieldsInContents key={f.fid} field={f} formData={this.props.formData} document={this.props.document} />
				);
			}
		});
		return <Table className="inner-table">{inSubontent}</Table>;
	}
	content(){
		let content;
		switch(this.props.field.type){
			case 'char': return this.char();
			case 'taxonomy': return this.taxonomy();
			case 'textarea': return this.textarea();
			case 'group': return this.group();
			default: return '';
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
