import React, {Component, PropTypes, Children, cloneElement} from 'react';
import Item from '../accessories/Item';
import {_wrap, _pushpull, _isCommon} from '../accessories/functions';

class Check extends Component {
	handleClick(value){
		if(this.props.type != 'radio'){
			let selected = _pushpull(this.props.selected, value);
			this.props.onChange(selected);
		} else {
			if(value != this.props.selected){
				this.props.onChange(value);
			}
		}
	}
	render(){
		const selected = this.props.selected;
		const className = (this.props.className ? 'check '+this.props.className : 'check');
		const children = Children.map(this.props.children, (child) => { if(child){
			const className = _wrap(() => {
				if(	(this.props.type == 'radio' && selected == child.props.value) ||
					(this.props.type == 'check' && _isCommon([child.props.value], selected))
				) return 'item--checked'; else return '';
			});
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
	selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]).isRequired,
	checkIcon: PropTypes.element,
	uncheckIcon: PropTypes.element,
	type: PropTypes.oneOf(['radio', 'check']),
	onChange: PropTypes.func.isRequired
};
Check.defaultProps = {
	type: 'check',
	checkIcon: <i className="pe-7f-check pe-va"></i>,
	uncheckIcon: <i className="pe-7s-less pe-va"></i>
};

export default Check;
