import React, {Component, PropTypes} from 'react';
import {Table, Row, Column} from '../accessories/Table';

class FieldsInContents extends Component {
	content(){
		let value = this.props.document[this.props.fname];
		const fAttr = this.props.docData.fAttrs[this.props.fname];
		switch(fAttr.type){
			case 'taxonomy':
				if(!fAttr.multiple) value = [value];
				const taxo = [];
				value.forEach((v) => {
					let term = this.props.docData.terms[v];
					if(term) taxo.push(term.name);
				});
				if(taxo.length) return taxo.join(', ');
				else return null;
			case 'char': case 'email': case 'phone': case 'date':
				if(!fAttr.multiple) value = [value];
				if(fAttr.form !== 'textarea'){
					return value.join(', ');
				} else{
					return value.map((text, i) => {
						text = text.split(/\n/).map((t, j) => <div key={j}>{t}</div>);
						return <div key={i}>{text}</div>
					});
				}
			case 'tag':
				if(value){
					const tags = value.split(',').map((v) => '#'+v.trim());
					return <span>{tags.join(' ')}</span>;
				} else {
					return null;
				}
			case 'group':
				let inSubontent = [];
				fAttr.children.forEach((fn) => {
					inSubontent.push(<FieldsInContents key={fn} fname={fn} docData={this.props.docData} document={this.props.document} />);
				});
				if(inSubontent.length > 0){
					return <Table className="inner-table">{inSubontent}</Table>;
				} else {
					return null;
				}
			default: return null;
		}
	}
	render(){
		let content = this.content();
		if(content){
			return (
				<Row>
					<Column>{this.props.docData.fAttrs[this.props.fname].displayName}</Column>
					<Column>{content}</Column>
				</Row>
			);
		} else {
			return null;
		}
	}
}
FieldsInContents.propTypes = {
	fname: PropTypes.string.isRequired,
	docData: PropTypes.object.isRequired,
	document: PropTypes.object.isRequired
};

export default FieldsInContents;
