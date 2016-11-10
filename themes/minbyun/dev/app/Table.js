import React, {Component, PropTypes} from 'react';
import './style/table.less';

class Table extends Component {
	render(){
		/*
		let children = React.Children.map(this.props.children, (child) => React.cloneElement(child, {
			columnWidth: 500
		}));
		*/
		let classes = (this.props.className ? ' '+this.props.className : '');
		return (
			<div className={'table'+classes}>
				{this.props.children}
			</div>
		);
	}
}
Table.propTypes = {
	className: PropTypes.string
}

export default Table;
