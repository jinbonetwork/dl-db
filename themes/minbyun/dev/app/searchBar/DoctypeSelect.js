import React, {Component, PropTypes} from 'react';
import {_isCommon} from '../functions';

class Option extends Component {
	handleClick(){
		this.props.handleClick({value: this.props.value, checked: !this.props.checked});
	}
	render(){
		let className = (this.props.checked ? 'option option--checked': 'option');
		return (
			<li className={className} onClick={this.handleClick.bind(this)}>
				<i className="pe-7s-check pe-va"></i>
				<span>{this.props.name}</span>
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
	constructor(){
		super();
		this.state = {
			isFolded: true
		};
	}
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
		else if(which == 'header'){
			this.setState({isFolded: !this.state.isFolded});
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
		let className = (this.state.isFolded ? 'doctype-select': 'doctype-select  doctype-select--unfolded');
		return (
			<div className={className}>
				<div className="doctype-select__header" onClick={this.handleClick.bind(this, 'header')}>
					<span>{this.props.displayName}</span>
					<i className="pe-7s-angle-down pe-va"></i>
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
