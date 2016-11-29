import React, {Component, PropTypes} from 'react';
import 'babel-polyfill'; // for update(), find(), findIndex() ...

class Option extends Component {
	render(){
		return (
			<li>
				{this.props.children}
			</li>
		);
	}
}
Option.propTypes = {
	children: PropTypes.string.isRequired
};

class Select extends Component {
	handleChange(event){

	}
	render(){
		let displayValue = this.props.children && React.Children.map(this.props.children, (child) => {
			if(child && child.props.value == this.props.value){
				return child.props.children;
			}
		});
		displayValue = (displayValue ? displayValue[0] : null);

		return (
			<div className="select">
				<div className="select__value_wrap">
					<input type="text" style={{display: 'none'}} value={this.props.value} onChange={this.handleChange.bind(this)} />
					<span className="select__displayValue">{displayValue}</span>
					<span className="select__arrorw">v</span>
				</div>
				<ul>{this.props.children}</ul>
			</div>
		);
	}
}
Select.propTypes = {
	value: PropTypes.string,
	handleChange: PropTypes.func
};

export default Select;
