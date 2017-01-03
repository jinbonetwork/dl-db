import React, {Component, PropTypes} from 'react';
import Check from '../accessories/Check';
import Item from '../accessories/Item';
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
		const fAttrs = this.props.docData.fAttrs;
		const sFname = this.props.docData.sFname;
		const doctypes = (fAttrs.doctype) && _mapO(_termsOf('doctype', this.props.docData), (tid, tname) => {
			const isTermChecked = (this.props.doctypes.indexOf(tid) >= 0);
			let className = (isTermChecked ? 'doctype-li doctype-li--checked' : 'doctype-li');
			let count;
			if(isTermChecked || this.props.doctypes.length == 0){
				count = (this.props.distribution[tid] ? this.props.distribution[tid] : 0);
				count = '('+count+')';
			}
			return (
				<li key={tid} className={className} onClick={this.handleClick.bind(this, 'doctypes', tid)}>
					<span>{tname} {count}</span>
				</li>
			);
		});
		const option = (fAttrs.date) && (
			<Check multiple={false} selected={this.props.orderby} onChange={this.handleChange.bind(this, 'orderby')}
				checkIcon={<i className="pe-7f-check pe-va"></i>} uncheckIcon={<i className="pe-7s-less pe-va"></i>}
			>
				<Item value="score"><span className="doclisthead__orderby">관련도순</span></Item>
				<Item value={sFname['date']}><span className="doclisthead__orderby">최신순</span></Item>
			</Check>
		);
		if(doctypes || option){
			return (
				<div className="doclisthead">
					<ul>{doctypes}</ul>
					{option}
				</div>
			);
		} else {
			return null;
		}
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
