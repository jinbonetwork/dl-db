import React, {Component, PropTypes} from 'react';
import LinkIf from '../accessories/LinkIf';
import {_isCommon, _forIn, _isEmpty} from '../accessories/functions';

class DocListItem extends Component {
	sideDispNames(){
		const fAttrs = this.props.docData.fAttrs;
		return {
			date: (fAttrs.date ? '작성일' : null),
			number: (fAttrs.number ? fAttrs.number.displayName : null),
			committee: (fAttrs.committee ? fAttrs.committee.displayName : null),
			name: (fAttrs.name ? fAttrs.name.displayName : null)
		}
	}
	side(){
		const document = this.props.document;
		const sideDispNames = this.sideDispNames();
		if(!_isEmpty(sideDispNames)){
			let side = [];
			_forIn(sideDispNames, (fn, dispName) => { if(dispName && document[fn]){
				side.push(
					<li key={fn}>
						<span>{dispName}: </span>
						<span>{this.tagged(document[fn])}</span>
					</li>
				);
			}});
			return side;
		} else {
			return null;
		}
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
		const document = this.props.document, fAttrs = this.props.docData.fAttrs;
		const side = this.side();
		const doctype = (fAttrs.doctype && document.doctype ? <span>{'['+document.doctype+']'}</span> : null);
		const title = this.tagged(document.title);
		const content = this.tagged(document.content);

		return (
			<div className="doclist-item">
				<div className="doclist-item__header">
					{doctype}
					<LinkIf className="doclist-item__title" to={'/document/'+document.id}
						if={_isCommon(['admin', 'view'], this.props.userRole)} isVisible={true}
					>
						{title}
					</LinkIf>
				</div>
				<div className="doclist-item__content">
					{side && <ul className="doclist-item__side">{side}</ul>}
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