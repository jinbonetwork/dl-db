import React, {Component, PropTypes} from 'react';
import '../style/table.less';

class Row extends Component {
	render(){
		/*
		let children = React.Children.map(this.props.children, (child) => React.cloneElement(child, {
			columnWidth: this.props.columnWidth
		}));
		*/
		let classes = (this.props.className ? ' '+this.props.className : '');
		return (
			<div className={'table__row'+classes}>
				{this.props.children}
			</div>
		);
	}
}
Row.propTypes = {
	className: PropTypes.string
}

export default Row;
