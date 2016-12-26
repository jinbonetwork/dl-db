import React, {Component, PropTypes, Children, cloneElement} from 'react';
import Item from '../accessories/Item';

class Check extends Component {
	constructor(){
		super();
		this.state = {
			selected: null
		};
	}
	componentWillMount(){
		if(this.props.selected) this.setState({selected: this.props.selected});
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.selected) this.setState({selected: nextProps.selected});
	}
	handleClick(value){
		if(this.props.multiple){
			let selected = _pushpull(this.state.selected, value);
			if(this.props.onChange){
				this.props.onChange(selected);
			} else {
				this.setState({selected: selected});
			}
		} else {
			if(value != this.state.selected){
				if(this.props.onChange){
					this.props.onChange(value);
				} else {
					this.setState({selected: value});
				}
			}
		}
	}
	render(){
		let className = (this.props.className ? 'check '+this.props.className : 'check');
		const selected = (this.props.multiple ? this.state.selected : [this.state.selected]);
		const children = Children.map(this.props.children, (child) => { if(child){
			const className = (selected.indexOf(child.props.value) >= 0 ? 'item--checked' : '');
			const children = [
				<span key="checkicon" className="item__checkicon">{this.props.checkIcon}</span>,
				<span key="uncheckicon" className="item__uncheckicon">{this.props.uncheckIcon}</span>
			];
			children.push(child.props.children);
			return cloneElement(child, {
				className: className, children: children, onClick: this.handleClick.bind(this, child.props.value)
			});
		}});
		return (
			<div className={className}>
				<ul>{children}</ul>
			</div>
		);
	}
}
Check.propTypes = {
	className: PropTypes.string,
	selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
	checkIcon: PropTypes.element,
	uncheckIcon: PropTypes.element,
	multiple: PropTypes.bool,
	onChange: PropTypes.func
}

export default Check;
