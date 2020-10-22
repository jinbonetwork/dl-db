import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {_mapO, _wrap, _isEmpty} from '../functions';

class ViewElem extends Component {
	handleClick(which, arg1st){
		if(which == 'image'){
			let {command, index} = arg1st;
			this.props.onClick('image', {command, index});
		}
	}
	render(){
		const {value, type, form, owner, terms, parseState, fileTextUri, style, selected, className, role} = this.props;
		switch(type){
			case 'taxonomy':
				return (
					<span className={className} style={style}>
						{value.map((v) => terms[v].name).join(', ')}
					</span>
				);
			case 'char': case 'email': case 'phone':
				if(form !== 'textarea'){
					return <span className={className} style={style}>{value.join(', ')}</span>
				} else{
					return (
						<div className={className} style={style}>{
							value.map((text, i) => (
								<div key={i} className="view__section">{text.split(/\n/).map((t, j) => (
									<div key={j} className="view__paragraph"><span className={(!t ? 'empty__paragraph' : '')}>{t}</span></div>
								))}</div>
							))
						}</div>
					)
				}
			case 'date':
				return (
					<span className={className} style={style}>{
						form == 'text' ?
						value.map((val) => val).join(', ') :
						value.map((val) => _mapO(val, (pn, pv) => (pv)).join('/')).join(', ')
					}</span>
				);
			case 'tag':
				return <span className={className} style={style}>{
					value[0].split(',').map((v) => '#'+v.trim()).join(' ')
				}</span>;
			case 'image':
				return (
					<div className={className} style={style}>
						<div className="view__image-list">{value.map((val, index) => (val.status == 'uploading' ?
							<span key={index}></span> :
							<img key={index} src={val.fileuri} onClick={this.handleClick.bind(this, 'image', {command: 'select', index})} />
						))}</div>
						{(selected === 0 || selected > 0) &&
							<div className="view__an-image">
								<img src={value[selected].fileuri} onClick={this.handleClick.bind(this, 'image', {command: 'unselect'})} />
							</div>
						}
					</div>
				);
			case 'file':
				return (
					<ol className={className} style={style}>{ value.map((val, index) => (!_isEmpty(val)) &&
						<li key={index}>
							{(owner || (role.indexOf('download') >= 0 && val.anonymity) ?
								<a className="view__filename" href={val.downuri} target="_blank">{val.filename}</a> :
								<span className="view__filename">{val.filename}</span>)
							}
							{val.status == 'unparsed' &&
								<span className="view__unparsed"><i className="pe-7s-attention pe-va"></i></span>
							}
							{val.status != 'parsed' && val.status != 'unparsed' && _wrap(() => {
								let percent = (parseState[val.fid] ? parseState[val.fid].progress : 0) + '%';
								return (
									<span className="view__progress-bar">
										<span className="view__progress" style={{width: percent}}></span>
										<span className="view__percentage">{percent}</span>
									</span>
								);
							})}
							{(owner && (val.status == 'unparsed' || val.status == 'parsed')) &&
								<Link className="view__file-text" to={fileTextUri+val.fid}><span>TEXT</span></Link>
							}
						</li>
					)}</ol>
				);
			default:
				console.error(type + '은/는 적합한 type이 아닙니다');
				return null;
		}
	}
}
ViewElem.propTypes = {
	className: PropTypes.string,
	style: PropTypes.object,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object]).isRequired,
	type: PropTypes.string.isRequired,
	form: PropTypes.string,
	terms: PropTypes.object,
	owner: PropTypes.bool,
	role: PropTypes.arrayOf(PropTypes.string),
	fileTextUri: PropTypes.string,
	parseState: PropTypes.object,
	selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
	onClick: PropTypes.func
};
ViewElem.defaultProps = {
	form: '',
	terms: {},
	role: [],
	fileTextUri: '',
	parseState: {}
}

export default ViewElem;
