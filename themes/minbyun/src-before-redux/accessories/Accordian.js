import React, {Component, PropTypes, Children, cloneElement} from 'react';

class AcdItem extends Component {
	render(){
		let className = (this.props.isUnfolded ? 'acditem acditem--unfolded' : 'acditem');
		return (
			<div className={className}>
				<div className="acditem__head" onClick={this.props.onClick}>
					{this.props.head}
				</div>
				<div className="acditem__children" onClick={this.props.onClickOfChildren}>
					{this.props.children}
				</div>
			</div>
		);
	}
}
AcdItem.propTypes = {
	head: PropTypes.element,
	isUnfolded: PropTypes.bool,
	onClick: PropTypes.func,
	onClickOfChildren: PropTypes.func
}

class Accordian extends Component {
	constructor(){
		super();
		this.state = {
			unfoldedItem: -1
		};
	}
	handleClick(which, index){
		if(which == 'head'){
			if(index != this.state.unfoldedItem) this.setState({unfoldedItem: index});
			else this.setState({unfoldedItem: -1});
		}
		this.props.onClick(which);
	}
	render(){
		const children = Children.map(this.props.children, (child, index) => { if(child && child.type == AcdItem){
			let isUnfolded = (this.state.unfoldedItem == index ? true : false);
			return cloneElement(child, {
				isUnfolded: isUnfolded,
				onClick: this.handleClick.bind(this, 'head', index),
				onClickOfChildren: this.handleClick.bind(this, 'children')
			});
		}});
		return (
			<div className="accordian">
				{children}
			</div>
		);
	}
}
Accordian.propTypes = {
	onClick: PropTypes.func
};

export {Accordian, AcdItem};
