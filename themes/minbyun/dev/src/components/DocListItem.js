import React, {Component, PropTypes} from 'react';
import LinkIf from '../accessories/LinkIf';
import update from 'react-addons-update';
import {_isCommon, _forIn, _isEmpty} from '../accessories/functions';

class DocListItem extends Component {
	handleClick(){
		if(_isCommon(['administrator', 'view'], this.props.role)){
			this.props.onClickTitle();
		} else {
			this.props.showMessage('권한이 없습니다.');
		}
	}
	sideDispNames(){
		const fProps = this.props.fData.fProps;
		return {
			date: (fProps.date ? '작성일' : null),
			number: (fProps.number ? fProps.number.dispName : null),
			committee: (fProps.committee ? fProps.committee.dispName : null),
			name: (fProps.name ? fProps.name.dispName : null)
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
		const document = this.props.document, fProps = this.props.fData.fProps;
		const side = this.side();
		const doctype = (fProps.doctype && document.doctype ? <span>{'['+document.doctype+']'}</span> : null);
		const title = this.tagged(document.title);
		const content = this.tagged( document.content.length > 200 ?
			document.content.substring(0, 199)+' ...' : document.content
		);
		return (
			<div className="doclist-item">
				<div className="doclist-item__header">
					{doctype}
					<span className={'doclist-item__title'} onClick={this.handleClick.bind(this)}>
						{title}
					</span>
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
	role: PropTypes.array.isRequired,
	fData: PropTypes.object.isRequired,
	keywords: PropTypes.string,
	onClickTitle: PropTypes.func.isRequired,
	showMessage: PropTypes.func.isRequired
};
DocListItem.defaultProps = {
	keywords: ''
}
export default DocListItem;
