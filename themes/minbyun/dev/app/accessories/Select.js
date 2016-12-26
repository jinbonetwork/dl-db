import React, {Component, PropTypes, Children, cloneElement} from 'react';
import Dropdown from './Dropdown';
import {_isCommon, _pushpull} from './functions';

class Select extends Component {
	constructor(){
		super();
		this.state = {
			selected: ''
		};
	}
	componentWillMount(){
		if(this.props.selected){
			this.setState({selected: this.props.selected});
		}
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.selected){
			this.setState({selected: nextProps.selected});
		}
	}
	handleClick(which, value){
		if(which == 'item'){
			if(this.state.seleced != value){
				if(this.props.onChange){
					this.props.onChange(value);
				} else {
					this.setState({selected: value});
				}
			}
		}
	}
	render(){
		let head;
		const children = Children.map(this.props.children, (child) => { if(child){
			if(child.props.value == this.state.selected){
				head = child.props.children;
			} else {
				return child;
			}
		}});
		return (
			<Dropdown className="select" head={head} arrow={<i className="pe-7s-angle-down pe-va"></i>}
				onClick={this.handleClick.bind(this)}
				onResize={this.props.onResize}
			>
				{children}
			</Dropdown>
		);
	}
}
Select.propTypes = {
	selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	onChange: PropTypes.func,
	onResize: PropTypes.func
};

export default Select;
