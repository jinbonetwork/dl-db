import React, {Component, PropTypes} from 'react';

class Item extends Component {
	constructor(){
		super();
		this.state = {
			checkd: false
		}
	}
	render(){
		return (
			<li></li>
		);
	}
}
Item.propTypes = {
	value: PropTypes.number.isRequired,
	name: PropTypes.string.isRequired
}


class DoctypeSelect extends Component {
	constructor(){
		super();
		this.state = {
			selected: []
		}
	}
	render(){
		let options = [];
		for(let value in this.props.options){
			options.push(<li key={value}>{this.props.options[value]}</li>);
		}

		return (
			<div className="doctype-select">
				<ul>{options}</ul>
			</div>
		);
	}
}
DoctypeSelect.propTypes = {
	options: PropTypes.object.isRequired,
	handleChange: PropTypes.func.isRequired
};
export default DoctypeSelect;
