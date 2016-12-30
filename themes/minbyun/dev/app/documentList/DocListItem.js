import React, {Component, PropTypes} from 'react';
import LinkIf from '../accessories/LinkIf';
import {_displayDate, _isCommon} from '../accessories/functions';

class DocListItem extends Component {
	sideDispNames(){
		const fAttrs = this.props.docData.fAttrs;
		return {
			date: '작성일',
			number: fAttrs.number.displayName,
			committee: fAttrs.committee.displayName,
			name: fAttrs.name.displayName
		}
	}
	side(){
		const sideDispNames = this.sideDispNames();
		let side = [];
		for(let fn in sideDispNames){ if(this.props.document[fn]){
			side.push(
				<li key={fn}>
					<span>{sideDispNames[fn]}: </span>
					<span>{this.tagged(this.props.document[fn])}</span>
				</li>
			);
		}}
		return side;
	}
	tagged(text){
		const keywords = this.props.keywords;
		if(!keywords || !text) return text;

		let tagged = [];
		let matches = text.match(new RegExp(keywords, 'gm')); if(!matches) return text;
		let texts = text.split(new RegExp(keywords));
		matches.forEach((kw, index) => {
			tagged.push(<span key={index}>{texts[index]}</span>, <span key={'kw'+index} className="doclist-item__accented">{kw}</span>);
		});
		tagged.push(<span key={tagged.length}>{texts[texts.length-1]}</span>);
		return tagged;
	}
	render(){
		const side = this.side();
		const title = this.tagged(this.props.document.title);
		const content = this.tagged(this.props.document.content);

		return (
			<div className="doclist-item">
				<div className="doclist-item__header">
					<span>{'['+this.props.document.doctype+']'}</span>
					<LinkIf className="doclist-item__title" to={'/document/'+this.props.document.id} if={_isCommon(['admin', 'view'], this.props.userRole)} isVisible={true}>
						{title}
					</LinkIf>
				</div>
				<div className="doclist-item__content">
					<ul className="doclist-item__side">{side}</ul>
					<p>{content}</p>
				</div>
			</div>
		);
	}
}
DocListItem.propTypes = {
	document: PropTypes.object.isRequired,
	userRole: PropTypes.array.isRequired,
	docData: PropTypes.object,
	keywords: PropTypes.string
}
export default DocListItem;
