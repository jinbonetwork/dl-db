import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {_mapO} from '../functions';

class ViewElem extends Component {
	render(){
		const {value, type, form, owner, terms, parseState, fileTextUri} = this.props;
		switch(type){
			case 'taxonomy':
				return <span className={this.props.className}>{value.map((v) => terms[v].name).join(', ')}</span>
			case 'char': case 'email': case 'phone':
				if(form !== 'textarea'){
					return <span className={this.props.className}>{value.join(', ')}</span>
				} else{
					return (
						<div className={this.props.className}>{
							value.map((text, i) => (
								<div key={i} className="view__section">{text.split(/\n+/).map((t, j) => (
									<div key={j} className="view__paragraph"><span>{t}</span></div>
								))}</div>
							))
						}</div>
					)
				}
			case 'date':
				return (
					<span className={this.props.className}>{
						value.map((val) => _mapO(val, (pn, pv) => (pv)).join('/')).join(', ')
					}</span>
				);
			case 'tag':
				return <span className={this.props.className}>{
					value[0].split(',').map((v) => '#'+v.trim()).join(' ')
				}</span>;
			case 'image':
				return (
					<div className={this.props.className}>{value.map((val, index) => (
						val.status == 'uploading' ?
							<span key={index}></span> :
							<img key={index} src={val.fileuri} />
					))}</div>
				);
			case 'file':
				return (
					<ol className={this.props.className}>{value.map((val, index) =>
						<li key={index}>
							{(owner || (role.indexOf('download') >= 0 && val.anonymity) ?
								<a className="view__filename" href={val.fileuri} target="_blank">{val.filename}</a> :
								<span className="view__filename">{val.filename}</span>)
							}
							{val.status == 'unparsed' &&
								<span className="view__unparsed"><i className="pe-7s-attention pe-va"></i></span>
							}
							{val.status != 'parsed' && val.status != 'unparsed' && (parseState[val.fid] ?
								<span>{parseState[val.fid].progress + '%'}</span> :
								<span>업로드중</span>
							)}
							{(owner && (val.status == 'unparsed' || val.status == 'parsed')) &&
								<Link className="view__file-text" to={fileTextUri+val.fid}>TEXT</Link>
							}
						</li>
					)}</ol>
				);
			default:
				console.error(fProp.type + '은/는 적합한 type이 아닙니다');
				return null;
		}
	}
}
ViewElem.propTypes = {
	className: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object]).isRequired,
	type: PropTypes.string.isRequired,
	form: PropTypes.string,
	terms: PropTypes.object,
	owner: PropTypes.bool,
	role: PropTypes.arrayOf(PropTypes.string),
	fileTextUri: PropTypes.string,
	parseState: PropTypes.object
};
ViewElem.defaultProps = {
	form: '',
	terms: {},
	role: [],
	fileTextUri: '',
	parseState: {}
}

export default ViewElem;
