import React, {Component, PropTypes, Children, cloneElement} from 'react';
import jQ from 'jquery';
import browser from 'detect-browser';

class Dropdown extends Component {
	constructor(){
		super();
		this.state = {
			groupName: 'dropdown'+Date.now(),
			isUnfolded: false,
			width: null,
			focused: -1
		};
	}
	componentDidMount(){
		this.refs.head.setAttribute('groupname', this.state.groupName);
		this.setSize();
		if(browser.name == 'ie'){
			jQ(this.refs.head).focusout((event) => {this.handleBlur('head', event);});
		}
	}
	componentWillReceiveProps(nextProps){
		this.setSize();
	}
	componentDidUpdate(prevProps, prevState){
		if(this.state.focused === 0){
			this.refs.head.focus();
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
	handleClick(which, arg1st){
		if(which == 'head'){
			this.setState({isUnfolded: !this.state.isUnfolded});
		}
		else if(which == 'item'){
			const value = arg1st;
			if(!this.props.multiple) this.setState({isUnfolded: false, focused: 0});
		}
		if(this.props.onClick) this.props.onClick(which, arg1st);
	}
	handleFocus(which, arg1st){
		if(this.props.onFocus) this.props.onFocus(which, arg1st);
	}
	handleBlur(which, arg1st){
		if(which == 'head'){
			const event = arg1st;
			if(!event.relatedTarget || this.state.groupName != event.relatedTarget.getAttribute('groupname')){
				this.setState({isUnfolded: false, focused: -1});
			}
		}
		else if(which == 'item'){
			const isUnfolded = arg1st;
			if(!isUnfolded) this.setState({isUnfolded: false, focused: -1});
		}
	}
	handleKeyDown(which, arg1st, arg2nd, arg3nd){
		if(which == 'head'){
			const event = arg1st;
			if(event.key == 'Enter') this.setState({isUnfolded: !this.state.isUnfolded});
			else if(event.key == 'ArrowDown'){ this.setState({isUnfolded: true, focused: 1}); event.preventDefault(); }
		}
		else if(which == 'item'){
			const index = arg1st, key = arg2nd, event = arg3nd;
			if(key == 'ArrowDown'){ this.setState({focused: index+1}); event.preventDefault(); }
			else if(key == 'ArrowUp'){ this.setState({focused: index-1}); event.preventDefault(); }
		}
	}
	render(){
		let className = (this.props.className ? 'dropdown '+this.props.className : 'dropdown');
		className += (this.state.isUnfolded ? ' dropdown--unfolded' : '');

		const head = (
			<div className='ddhead'>
				{this.props.head}
				<div className="ddarrow">{this.props.arrow}</div>
			</div>
		);

		let indexOfItem = 0;
		const items = Children.map(this.props.children, (child) => { if(child){
			const focus = (this.state.focused == ++indexOfItem);
			return cloneElement(child, {
				tabIndex: -1,
				focus: focus,
				groupName: this.state.groupName,
				onBlur: this.handleBlur.bind(this, 'item'),
				onFocus: this.handleFocus.bind(this, 'item', child.props.value),
				onClick: this.handleClick.bind(this, 'item', child.props.value),
				onKeyDown: this.handleKeyDown.bind(this, 'item', indexOfItem)
			});
		}});

		const headWidth = (this.props.hasOwnProperty('headWidth') ? this.props.headWidth : this.state.width);
		const itemWidth = (this.props.hasOwnProperty('itemWidth') ? this.props.itemWidth : this.state.width);

		const handleHeadBlur = (browser.name != 'ie' ? this.handleBlur.bind(this, 'head') : null);

		return (
			<div className={className}>
				<div className="dropdown__headwrap" ref="headwrap">
					<div className="dropdown__head" ref="head" tabIndex="0" style={{width: headWidth}}
						onBlur={handleHeadBlur} onClick={this.handleClick.bind(this, 'head')} onFocus={this.handleFocus.bind(this, 'head')}
						onKeyDown={this.handleKeyDown.bind(this, 'head')}
					>
						{head}
					</div>
				</div>
				<div className="dropdown__innerwrap">
					<div className="dropdown__items">
						<div className="dropdown__items-top-border" style={{width: itemWidth}}></div>
						<ul style={{width: itemWidth}}>{items}</ul>
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
	head: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
	arrow: PropTypes.element,
	headWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	itemWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	window: PropTypes.shape({width: PropTypes.number, height: PropTypes.number}),
	multiple: PropTypes.bool,
	onResize: PropTypes.func,
	onClick: PropTypes.func,
	onFocus: PropTypes.func
};

export default Dropdown;
