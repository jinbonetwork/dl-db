import React, {Component, PropTypes} from 'react';
import {Radio, RdItem} from '../accessories/Radio';
import {_termsOf, _sFname} from '../schema/docSchema';
import {_mapO, _pushpull} from '../accessories/functions';

class DoctypeList extends Component {
	handleClick(which, arg){
		if(which == 'doctypes'){
			this.props.onChange(which, _pushpull(this.props.doctypes, arg));
		}
	}
	handleChange(which, arg){
		if(which == 'orderby'){
			this.props.onChange(which, arg);
		}
	}
	render(){
		const doctypes = _mapO(_termsOf('doctype', this.props.docData), (tid, tname) => {
			let className = (this.props.doctypes.indexOf(tid) >= 0 ? 'doctype-li doctype-li--checked' : 'doctype-li');
			let count = (this.props.distribution[tid] ? this.props.distribution[tid] : 0);
			return (
				<li key={tid} className={className} onClick={this.handleClick.bind(this, 'doctypes', tid)}>
					<span>{tname} ({count})</span>
				</li>
			);
		});
		return (
			<div className="doclisthead">
				<ul>{doctypes}</ul>
				<Radio selected={this.props.orderby} onChange={this.handleChange.bind(this, 'orderby')}>
					<RdItem value="score"><span className="doclisthead__orderby">관련도순</span></RdItem>
					<RdItem value={_sFname['date']}><span className="doclisthead__orderby">최신순</span></RdItem>
				</Radio>
			</div>
		);
	}
}
DoctypeList.propTypes = {
	doctypes: PropTypes.array.isRequired,
	orderby: PropTypes.string.isRequired,
	docData: PropTypes.object,
	distribution: PropTypes.object.isRequired,
	onChange: PropTypes.func.isRequired
};

export default DoctypeList;
