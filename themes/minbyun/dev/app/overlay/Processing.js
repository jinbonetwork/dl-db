import React, {Component, PropTypes} from 'react';
import Overlay from './Overlay';

class Processing extends Component {
	render(){
		return (
			<div className="processing">
				<Overlay />
				<i className="pe-7f-config pe-4x pe-spin"></i>
			</div>
		);
	}
}

export default Processing;
