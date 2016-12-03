import React, {Component, PropTypes} from 'react';
import {_termsOf} from '../schema/docSchema';
import {_mapO, _pushpull} from '../accessories/functions';

class DoctypeList extends Component {
	handleClick(which, arg){
		if(which == 'doctypes'){
			this.props.onChange(which, _pushpull(this.props.doctypes, arg));
		}

	}
	render(){
		let doctypes = _mapO(_termsOf('doctype', this.props.docData), (tid, tname) => {
			let className = (this.props.doctypes.indexOf(tid) >= 0 ? 'doctype-li doctype-li--checked' : 'doctype-li');
			return <li key={tid} className={className} onClick={this.handleClick.bind(this, 'doctypes', tid)}><span>{tname}</span></li>
		});
		return (
			<div className="doclisthead">
				<ul>{doctypes}</ul>
			</div>
		);
	}
}
DoctypeList.propTypes = {
	doctypes: PropTypes.array.isRequired,
	docData: PropTypes.object,
	onChange: PropTypes.func.isRequired
};

export default DoctypeList;
