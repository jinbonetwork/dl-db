import React, {Component, PropTypes, Children, cloneElement} from 'react';
import jQ from 'jquery';

class DdItem extends Component {
	handleClick(){
		if(this.props.onClick) this.props.onClick();
	}
	render(){
		let className = (this.props.className ? 'dditem '+this.props.className : 'dditem');
		return <li className={className} onClick={this.handleClick.bind(this)}>{this.props.children}</li>
	}
}
DdItem.propTypes = {
	className: PropTypes.string,
	onClick: PropTypes.func
};

class DdHead extends Component {
	handleClick(){
		if(this.props.onClick) this.props.onClick();
	}
	render(){
		let arrow, children = [];
		Children.forEach(this.props.children, (child) => { if(child){
			if(child.type == DdArrow) arrow = child;
			else children.push(child);
		}});
		let className = (this.props.className ? 'ddhead '+this.props.className : 'ddhead');
		return (
			<div className={className} onClick={this.handleClick.bind(this)}>{children}{arrow}</div>
		);
	}
}
DdHead.propTypes = {
	className: PropTypes.string,
	onClick: PropTypes.func
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
			width: null
		};
	}
	componentDidMount(){
		this.setSize();
	}
	componentWillMount(nextProps){
		if(this.props.hasOwnProperty('isUnfolded')){
			this.setState({isUnfolded: this.props.isUnfolded});
		}
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.hasOwnProperty('isUnfolded')){
			this.setState({isUnfolded: nextProps.isUnfolded});
		}
	}
	componentDidUpdate(prevProps, prevState){
		this.setSize();
		if(!this.props.hasOwnProperty('isUnfolded')){
			if(prevState.isUnfolded && this.state.isUnfolded) this.setState({isUnfolded: false});
		}
	}
	setSize(){
		if(!this.refs.invisible) return;
		const rect = this.refs.invisible.getBoundingClientRect();
		const width = rect.width + 1;
		if(width != this.state.width){
			this.setState({width: width});
			if(this.props.onResize){
				let extraWidth = jQ(this.refs.headwrap).outerWidth() - jQ(this.refs.headwrap).width();
				this.props.onResize({width: width + extraWidth});
			}
		}
	}
	handleClick(which){
		this.setState({isUnfolded: !this.state.isUnfolded});
	}
	render(){
		let className = (this.props.className ? 'dropdown '+this.props.className : 'dropdown');
		className += (this.state.isUnfolded ? ' dropdown--unfolded' : '');

		let head, items = [];
		Children.forEach(this.props.children, (child, index) => { if(child){
			if(child.type == DdHead){
				head = cloneElement(child, {width: this.state.width});
			}
			else if(child.type == DdItem){
				items.push(child);
			}
		}});

		return (
			<div className={className}>
				<div className="dropdown__headwrap" ref="headwrap" onClick={this.handleClick.bind(this, 'head')}>
					<div className="dropdown__head" style={{width: this.state.width}}>
						{head}
					</div>
				</div>
				<div className="dropdown__innerwrap">
					<div className="dropdown__items">
						<ul style={{width: this.state.width}}>{items}</ul>
					</div>
				</div>
				<div className="dropdown__invisible" ref="invisible">
					<div>{head}</div>
					<ul>{items}</ul>
				</div>
			</div>
		);
	}
}
Dropdown.propTypes = {
	className: PropTypes.string,
	isUnfolded: PropTypes.bool,
	handleClick: PropTypes.func,
	onResize: PropTypes.func
};

export {Dropdown, DdHead, DdItem, DdArrow};
