import React, {Component, PropTypes, Children, cloneElement} from 'react';
import Dropdown from './Dropdown';
import Item from './Item';
import {_isCommon, _pushpull} from './functions';

class DdSelect extends Component {
	constructor(){
		super();
		this.state = {
			selected: [],
			isUnfolded: false
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
			let selected = _pushpull(this.state.selected, value);
			if(this.props.onChange){
				this.props.onChange(selected);
			} else {
				this.setState({selected: selected});
			}
		}
	}
	handleFocus(which, value){
		if(this.props.onFocus) this.props.onFocus(which, value);
	}
	render(){
		const children = Children.map(this.props.children, (child) => { if(child){
			let className = (_isCommon(this.state.selected, [child.props.value]) ? 'item--checked' : '');
			let children = [];
			children.push(<i key="checkicon" className="item__checkicon pe-7s-check pe-va"></i>, child.props.children);
			return cloneElement(child, {className: className, children: children});
		}});
		return (
			<Dropdown className="ddselect" head={this.props.head} arrow={this.props.arrow} multiple={true} window={this.props.window}
				onClick={this.handleClick.bind(this)} onFocus={this.handleFocus.bind(this)}
				onResize={this.props.onResize}
			>
				{children}
			</Dropdown>
		);
	}
}
DdSelect.propTypes = {
	selected: PropTypes.array,
	head: PropTypes.element,
	arrow: PropTypes.element,
	window: PropTypes.shape({width: PropTypes.number, height: PropTypes.number}),
	onChange: PropTypes.func,
	onResize: PropTypes.func,
	onFocus: PropTypes.func
};

export default DdSelect;
