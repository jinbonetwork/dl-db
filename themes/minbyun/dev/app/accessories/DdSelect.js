import React, {Component, PropTypes, Children, cloneElement} from 'react';
import {Dropdown, DdHead, DdItem, DdArrow} from './Dropdown';
import {_isCommon} from './functions';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find(), findIndex() ...

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
			let selected = [];
			this.state.selected.forEach((v) => {
				if(v != value) selected.push(v);
			});
			if(selected.length === this.state.selected.length){
				selected.push(value);
			}
			if(this.props.onChange){
				this.props.onChange(selected);
			} else {
				this.setState({selected: selected});
			}
		}
		else if(which == 'head'){
			this.setState({isUnfolded: !this.state.isUnfolded});
		}

	}
	render(){
		let children = Children.map(this.props.children, (child) => { if(child){
			if(child.type == DdItem){
				let className = (_isCommon(this.state.selected, [child.props.value]) ? 'dditem--checked' : '');
				let children = [];
				children.push(<i key="checkicon" className="dditem__checkicon pe-7s-check pe-va"></i>, child.props.children);
				return cloneElement(child, {
					className: className,
					onClick: this.handleClick.bind(this, 'item', child.props.value),
					children: children
				});
			} else if(child.type == DdHead){
				return cloneElement(child, {onClick: this.handleClick.bind(this, 'head')})
			} else {
				return child;
			}
		}});
		return (
			<Dropdown className="ddselect" isUnfolded={this.state.isUnfolded} onResize={this.props.onResize}>
				{children}
			</Dropdown>
		);
	}
}
DdSelect.propTypes = {
	selected: PropTypes.array,
	onChange: PropTypes.func,
	onResize: PropTypes.func
};

export default DdSelect;
