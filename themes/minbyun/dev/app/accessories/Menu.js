import React, {Component, PropTypes, Children, cloneElement} from 'react';
import jQ from 'jquery';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find(), findIndex() ...

class MenuItem extends Component {
	render(){
		let className = (this.props.position == 'title' ? 'menuitem menuitem--title' : 'menuitem');
		return <div className={className} onClick={this.props.handleClick}>{this.props.children}</div>
	}
}
MenuItem.propTypes = {
	position: PropTypes.string,
	handleClick: PropTypes.func,
	children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired
};

class Menu extends Component {
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
}
Menu.propTypes = {
	shape: PropTypes.string,
	className: PropTypes.string,
	children: PropTypes.arrayOf(PropTypes.element).isRequired
};

export {Menu, MenuItem};
