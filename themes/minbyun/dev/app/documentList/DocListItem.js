import React, {Component, PropTypes} from 'react';
import LinkIf from '../accessories/LinkIf';
import {_displayDate, _isCommon} from '../accessories/functions';

const _sideDispNames = {
	date: '작성일',
	number: '사건번호',
	commitee: '위원회',
	name: '작성자'
}

class DocListItem extends Component {
	side(){
		let side = [];
		for(let fn in _sideDispNames){
			let value;
			switch(fn){
				case 'date': value = _displayDate(this.props.document[fn]); break;
				case 'commitee': value = this.props.docData.terms[this.props.document[fn]]; break;
				case 'name': case 'number': value = this.props.document[fn]; break;
			}
			if(value){
				side.push(
					<li key={fn}>
						<span>{_sideDispNames[fn]}: </span>
						<span>{value}</span>
					</li>
				);
			}
		}
	}
	tagged(text){ if(!text) return text;
		let tagged = [];
		const keywords = this.props.keywords;
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
					<span>{'['+this.props.docData.terms[this.props.document.doctype]+']'}</span>
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
