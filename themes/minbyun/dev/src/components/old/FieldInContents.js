import React, {Component, PropTypes} from 'react';
import {Table, Row, Column} from '../accessories/Table';
import {_isEmpty} from '../accessories/functions';

class FieldInContents extends Component {
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
				if(taxo.length) return <span>{taxo.join(', ')}</span>;
				else return null;
			case 'char': case 'email': case 'phone': case 'date':
				if(!fAttr.multiple) value = [value];
				if(fAttr.form !== 'textarea'){
					return <span>{value.join(', ')}</span>;
				} else{
					let texts = [];
					value.map((text, i) => { if(text){
						text = text.split(/\n/).map((t, j) => <div key={j}><span>{t}</span></div>);
						texts.push(<div key={i}>{text}</div>);
					}});
					if(texts.length) return texts;
					else return null;
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
					if(!_isEmpty(this.props.document[fn])){
						inSubontent.push(<FieldInContents key={fn} fname={fn} docData={this.props.docData} document={this.props.document} />);
					}
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
FieldInContents.propTypes = {
	fname: PropTypes.string.isRequired,
	docData: PropTypes.object.isRequired,
	document: PropTypes.object.isRequired
};

export default FieldInContents;
