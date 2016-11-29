import React, {Component, PropTypes, Children, cloneElement} from 'react';
import jQ from 'jquery';

class DdItem extends Component {
	render(){
		return <li className="dditem" onClick={this.props.handleClick}>{this.props.children}</li>
	}
}
DdItem.propTypes = {
	handleClick: PropTypes.func
};

class DdHead extends Component {
	constructor(){
		super();
		this.state = {
			minWidth: null
		};
	}
	componentDidMount(){
		this.handleResize();
		jQ(window).on('resize', this.handleResize.bind(this));
	}
	componentWillUnmount(){
		jQ(window).off('resize');
	}
	handleResize(){
		const rect = this.refs.head.getBoundingClientRect();
		if(this.state.minWidth != rect.width){
			this.setState({minWidth: rect.width});
			if(this.props.setMinWidth) this.props.setMinWidth(rect.width);
		}
	}
	render(){
		let arrow, children = [];
		Children.forEach(this.props.children, (child) => {
			if(child.type == DdArrow) arrow = child;
			else children.push(child);
		});
		return (
			<div className="ddhead" ref="head" style={{width: this.props.width, minWidth: this.state.minWidth}}>
				{children}
				{arrow}
			</div>
		);
	}
}
DdHead.propTypes = {
	width: PropTypes.number,
	setMinWidth: PropTypes.func
};

class DdArrow extends Component {
	render(){
		return <div className="ddarrow">{this.props.children}</div>
	}
}

class Dropdown extends Component {
	constructor(){
		super();
		this.state = {
			isUnfolded: false,
			headWidth: null,
			minWidth: null
		};
	}
	componentDidMount(){
		this.handleResize();
		jQ(window).on('resize', this.handleResize.bind(this));
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.hasOwnProperty('isUnfolded') && nextProps.isUnfolded != this.state.isUnfolded){
			this.setState({isUnfolded: nextProps.isUnfolded});
		}
	}
	componentWillUnmount(){
		jQ(window).off('resize');
	}
	handleResize(){
		let itemsRect = this.refs.items.getBoundingClientRect(); console.log(itemsRect.width);
		if(itemsRect.width != this.state.headWidth){
			this.setState({headWidth: itemsRect.width});
		}
	}
	handleClick(which){
		this.setState({isUnfolded: !this.state.isUnfolded});
		if(this.props.handleClick(!this.state.isUnfolded));
	}
	setMinWidth(minWidth){
		this.setState({minWidth: minWidth});
	}
	render(){
		let className = (this.props.className ? 'dropdown '+this.props.className : 'dropdown');
		className += (this.state.isUnfolded ? ' dropdown--unfolded' : '');

		let head, items = [];
		Children.forEach(this.props.children, (child, index) => { if(child){
			if(child.type == DdHead){
				head = cloneElement(child, {width: this.state.headWidth, setMinWidth: this.setMinWidth.bind(this)});
			}
			else if(child.type == DdItem){
				items.push(cloneElement(child, {key: index, handleClick: this.handleClick.bind(this, 'item')}));
			}
		}});

		return (
			<div className={className}>
				<div className="dropdown__headwrap" onClick={this.handleClick.bind(this, 'head')}>
					{head}
				</div>
				<div className="dropdown__innerwrap">
					<div>
						<div>
							<div className="dropdown__items">
								<ul ref="items" style={{minWidth: this.state.minWidth}}>{items}</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
Dropdown.propTypes = {
	className: PropTypes.string,
	isUnfolded: PropTypes.bool,
	handleClick: PropTypes.func,
	children: PropTypes.arrayOf(PropTypes.element).isRequired
};

export {Dropdown, DdHead, DdItem, DdArrow};
