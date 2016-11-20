import React, {Component, PropTypes} from 'react';
import {Table, Row, Column} from '../Table';
import {_fieldAttrs} from '../docSchema';

class FieldsInContents extends Component {
	content(){
		let value = this.props.document[this.props.fname];
		let fAttr = _fieldAttrs[this.props.fname];
		switch(fAttr.type){
			case 'taxonomy':
				if(!fAttr.multiple) value = [value];
				return value.map((v) => this.props.docData.terms[v]).join(', ');
			case 'char': case 'date':
				if(!fAttr.multiple) value = [value];
				if(fAttr.form !== 'textarea'){
					return value.join(', ');
				} else{
					return value.map((text, i) => <p key={i}>{text}</p>);
				}
			case 'group':
				let inSubontent = [];
				fAttr.children.forEach((fn) => {
					inSubontent.push(<FieldsInContents key={fn} fname={fn} document={this.props.document} />);
				});
				if(inSubontent.length > 0){
					return <Table className="inner-table">{inSubontent}</Table>;
				} else {
					return null;
				}
			default: return '';
		}
	}
	render(){
		let content = this.content();
		if(content){
			return (
				<Row>
					<Column className="table__label">{_fieldAttrs[this.props.fname].displayName}</Column>
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
	docData: PropTypes.object,
	document: PropTypes.object
};

export default FieldsInContents;
