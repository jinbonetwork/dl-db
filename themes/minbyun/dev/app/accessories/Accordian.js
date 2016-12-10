import React, {Component, PropTypes, Children, cloneElement} from 'react';

class AcdItem extends Component {
	handleClick(){
		this.props.onClick();
	}
	render(){
		let className = (this.props.isUnfolded ? 'acditem acditem--unfolded' : 'acditem');
		return (
			<div className={className}>
				<div className="acditem__head" onClick={this.handleClick.bind(this)}>
					{this.props.head}
				</div>
				<div className="acditem__children">
					{this.props.children}
				</div>
			</div>
		);
	}
}
AcdItem.propTypes = {
	head: PropTypes.element,
	isUnfolded: PropTypes.bool,
	onClick: PropTypes.func
}

class Accordian extends Component {
	constructor(){
		super();
		this.state = {
			unfoldedItem: -1
		};
	}
	handleClick(index){
		this.setState({unfoldedItem: index});
	}
	render(){
		const children = Children.map(this.props.children, (child, index) => { if(child && child.type == AcdItem){
			let isUnfolded = (this.state.unfoldedItem == index ? true : false); console.log(this.state.unfoldedItem, index);
			return cloneElement(child, {isUnfolded: isUnfolded, onClick: this.handleClick.bind(this, index)});
		}});
		return (
			<div className="accordian">
				{children}
			</div>
		);
	}
}

export {Accordian, AcdItem};
