import React, {Component, PropTypes} from 'react';

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
};

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

export {Table, Row, Column};
