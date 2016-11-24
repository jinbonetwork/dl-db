import React, {Component, PropTypes} from 'react';
import {_isCommon} from '../functions';

class Option extends Component {
	handleClick(){
		this.props.handleClick({value: this.props.value, checked: !this.props.checked});
	}
	render(){
		return (
			<li onClick={this.handleClick.bind(this)}>
				{(this.props.checked ? 'v ' : '')}
				{this.props.name}
			</li>
		);
	}
}
Option.propTypes = {
	value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
	name: PropTypes.string.isRequired,
	checked: PropTypes.bool.isRequired,
	handleClick: PropTypes.func.isRequired
};

class DoctypeSelect extends Component {
	handleClick(which, arg, event){
		if(which == 'option'){
			let newValues;
			if(arg.checked){
				newValues = this.props.values;
				newValues.push(arg.value)
			} else {
				newValues = [];
				this.props.values.forEach((v) => {
					if(v != arg.value) newValues.push(v);
				});
			}
			this.props.handleChange(newValues);
		}
	}
	render(){
		let options = [];
		for(let value in this.props.options){
			options.push(
				<Option key={value} value={value} name={this.props.options[value]}
					checked={_isCommon([value], this.props.values)}
					handleClick={this.handleClick.bind(this, 'option')}
				/>
			);
		}

		return (
			<div className="doctype-select">
				<div className="doctype-select__header">
					<span>{this.props.displayName}</span>
					<i className="pe-7s-angle-down"></i>
				</div>
				<ul>{options}</ul>
			</div>
		);
	}
}
DoctypeSelect.propTypes = {
	displayName: PropTypes.string.isRequired,
	values: PropTypes.array.isRequired,
	options: PropTypes.object.isRequired,
	handleChange: PropTypes.func.isRequired
};
export default DoctypeSelect;
