import React, {Component, PropTypes, Children} from 'react';
import Dropdown from './Dropdown';
import {_isCommon, _pushpull} from './functions';

class Select extends Component {
	handleClick(which, value){
		if(which == 'item'){
			if(this.props.selected != value){
				this.props.onChange(value);
			}
		}
	}
	render(){
		let head, items = [];
		Children.forEach(this.props.children, (child) => { if(child){
			if(child.props.value == this.props.selected){
				head = child.props.children;
			} else {
				items.push(child);
			}
		}});
		if(!head){
			head = <span>선택하세요</span>
		}
		return (
			<Dropdown className="select" head={head} arrow={<i className="pe-7s-angle-down pe-va"></i>} focus={this.props.focus}
				onClick={this.handleClick.bind(this)} onResize={this.props.onResize}
			>
				{items}
			</Dropdown>
		);
	}
}
Select.propTypes = {
	selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	focus: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
	onResize: PropTypes.func
};

export default Select;
