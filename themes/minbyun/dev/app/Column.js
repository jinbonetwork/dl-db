import React, {Component, PropTypes} from 'react';
import './style/table.less';

class Column extends Component {
	render(){
		let classes = (this.props.className ? ' '+this.props.className : '');
		return (
			<div className={'table__col'+classes}>
				{this.props.children}
			</div>
		);
	}
}
Column.propTypes = {
	className: PropTypes.string
}

export default Column;
