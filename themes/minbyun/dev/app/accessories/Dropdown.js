import React, {Component, PropTypes, Children, cloneElement} from 'react';
import jQ from 'jquery';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find(), findIndex() ...

class DdItem extends Component {
	render(){
		return <li className="dditem">{this.props.children}</li>
	}
}
DdItem.propTypes = {
};

class DdHead extends Component {
	render(){
		return (
			<div className="ddhead" style={{width: this.props.width}}>
				{this.props.children}
			</div>
		);
	}
}
DdHead.propTypes = {
	width: PropTypes.number
};

class Dropdown extends Component {
	/*
	componentWillMount(){
		if(this.props.shape == 'drop-down'){
			this.setState({
				isUnfolded: false,
				style: {
					wrap: {width: null}
				}
			});
		}
	}
	componentDidMount(){
		let itemsRect = this.refs.items.getBoundingClientRect();
		this.setState({style: update(this.state.style, {wrap: {width: {$set: itemsRect.width}}})});
	}
	handleClick(which){
		if(which == 'title'){
			this.setState({isUnfolded: !this.state.isUnfolded});
		}
	}
	render(){
		let className = (this.props.className ? 'menu '+this.props.className : 'menu');
		className += (this.props.shape == 'drop-down' ? ' menu--dropdown' : '');

		if(this.props.shape == 'drop-down'){
			let title, items = [];
			title = this.props.children[0] && cloneElement(this.props.children[0], {
				position: 'title', handleClick: this.handleClick.bind(this, 'title')
			});
			Children.forEach(this.props.children, (child, index) => { if(child){
				if(index >= 1) items.push(child);
			}});
			//const items = this.props.children;
			className += (this.state.isUnfolded ? ' menu--unfolded' : '');
			return (
				<div className={className} style={this.state.style.wrap}>
					<div className="menu__items-wrap" ref="items">
						{title}
						<div className="menu__items">{items}</div>
					</div>
				</div>
			);
		} else {
			return <div className={className}>{this.props.children}</div>
		}
	}
	*/
	constructor(){
		super();
		this.state = {
			isUnfolded: false,
			headWidth: null,
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
		let itemsRect = this.refs.items.getBoundingClientRect();
		if(itemsRect.width != this.state.headWidth){
			this.setState({headWidth: itemsRect.width});
		}
	}
	handleClick(){
		this.setState({isUnfolded: !this.state.isUnfolded});
	}
	render(){
		let className = (this.props.className ? 'dropdown '+this.props.className : 'dropdown');
		className += (this.state.isUnfolded ? ' dropdown--unfolded' : '');

		let head, items = [];
		Children.forEach(this.props.children, (child) => { if(child){
			if(child.type == DdHead){
				head = cloneElement(child, {width: this.state.headWidth});
			}
			else if(child.type == DdItem){
				items.push(child);
			}
		}});

		return (
			<div className={className}>
				<div className="dropdown__headwrap" onClick={this.handleClick.bind(this)}>
					{head}
				</div>
				<div className="dropdown__innerwrap">
					<div>
						<div>
							<div className="dropdown__items">
								<ul ref="items">{items}</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
Dropdown.propTypes = {
	shape: PropTypes.string,
	className: PropTypes.string,
	children: PropTypes.arrayOf(PropTypes.element).isRequired
};

export {Dropdown, DdHead, DdItem};
