import React, {Component, PropTypes} from 'react';
import Item from './Item';
import jQ from 'jquery';
import browser from 'detect-browser';
import {_mapO} from './functions';
import 'babel-polyfill';

class SrchSelect extends Component {
	constructor(){
		super();
		this.groupName = 'SrchSelect'+Date.now();
		this.state = {
			displayInput: false,
			keyword: '',
			result: [],
			focused: -1,
			width: null,
			focusHead: false
		};
	}
	componentWillMount(){
		if(this.props.focus) this.setState({focused: 0});
	}
	componentDidMount(){
		this.refs.input.setAttribute('groupname', this.groupName);
		this.refs.head.setAttribute('groupname', this.groupName);
		if(browser.name == 'ie'){
			jQ(this.refs.input).focusout((event) => {this.handleBlur('input', event);});
			jQ(this.refs.head).focusout((event) => {this.handleBlur('head', event);});
		}
		if(this.state.focused === 0){
			if(this.state.displayInput) this.refs.input.focus();
			else this.refs.head.focus();
		}
		this.setWidth();
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.focus) this.setState({focused: 0});
	}
	componentDidUpdate(prevProps, prevState){
		if(this.state.focused === 0){
			if(this.state.displayInput) this.refs.input.focus();
			else this.refs.head.focus();
		}
	}
	handleChange(which, event){
		if(which == 'input'){
			let result = [];
			let keyword = event.target.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
			if(keyword) this.props.options.forEach((op) => {if(op.dispValue.match(keyword)) result.push(op);});
			this.setState({keyword: event.target.value, result: result});
		}
		else if(which == 'head'){
			event.preventDefault();
		}
	}
	handleKeyDown(which, arg1st, arg2nd, arg3rd){
		if(which == 'input'){
			const event = arg1st;
			if(event.key == 'ArrowDown'){ this.setState({focused: 1}); event.preventDefault(); }
			else if(event.key == 'Enter') this.handleChange('input', event);
		}
		else if(which == 'head'){
			const event = arg1st;
			if(event.key == 'Enter') this.handleClick('head');
		}
		else if(which == 'item'){
			const [index, key, event] = [arg1st, arg2nd, arg3rd];
			if(key == 'ArrowDown'){ this.setState({focused: index+1}); event.preventDefault(); }
			else if(key == 'ArrowUp'){ this.setState({focused: index-1}); event.preventDefault(); }
		}
	}
	handleClick(which, arg1st){
		if(which == 'head'){
			let keyword = this.props.options.find((op) => (op.value == this.props.selected)).dispValue;
			this.setState({focused: 0, displayInput: true, keyword});
			this.handleChange('input', {target: {value: keyword}});
		}
		else if(which == 'arrow'){
			this.handleClick('head', arg1st);
		}
		else if(which == 'item'){
			const item = arg1st;
			this.setState({result: [], focused: 0, displayInput: false});
			this.props.onChange(item.value);
		}
	}
	handleFocus(which){
		if(which == 'head'){
			this.setState({focusHead: true});
		}
	}
	handleBlur(which, arg1st){
		if(which == 'input'){
			const event = arg1st;
			if(!event.relatedTarget || this.groupName != event.relatedTarget.getAttribute('groupname')){
				this.setState({result: [], focused: -1, displayInput: false, focusHead: false});
				if(this.props.onBlur) this.props.onBlur();
			}
		}
		else if(which == 'head'){
			const event = arg1st;
			if(!event.relatedTarget || this.groupName != event.relatedTarget.getAttribute('groupname')){
				this.setState({focusHead: false, focused: -1});
				if(this.props.onBlur) this.props.onBlur();
			}
		}
		else if(which == 'item'){
			const isFocusInHere = arg1st;
			if(!isFocusInHere) this.setState({result: [], focused: -1});
			if(this.props.onBlur) this.props.onBlur();
		}
	}
	setWidth(){
		this.setState({width: this.refs.invisible.getBoundingClientRect().width});
	}
	getStyle(which){
		switch(which){
			case 'invisible':
				return {
					position: 'fixed',
					top: 0, left: 0,
					height: 0,
					visibility: 'hidden'
				};
			default: return null;
		}
	}
	render(){
		const result = this.state.result.map((item, index) => {
			const indexOfItem = index + 1;
			return (
				<Item key={index} tabIndex="-1" onClick={this.handleClick.bind(this, 'item', item)}
					groupName={this.groupName}
					focus={this.state.focused == indexOfItem}
					onKeyDown={this.handleKeyDown.bind(this, 'item', indexOfItem)}
					onBlur={this.handleBlur.bind(this, 'item')}
				>
					{item.dispValue}
				</Item>
			);
		});
		return(
			<div className="srchselect">
				<div className={this.state.focused != 0 && !this.state.focusHead ? 'srchselect__headwrap' : 'srchselect__headwrap srchselect__headwrap--focused'}>
					<div className="srchselect__head" style={{width: this.state.width}}>
						<input type="text" ref="input"
							value={this.state.keyword}
							style={(this.state.displayInput ? null : {display: 'none'})}
							onChange={this.handleChange.bind(this, 'input')}
							onClick={this.handleClick.bind(this, 'input')}
							onKeyDown={this.handleKeyDown.bind(this, 'input')}
							onBlur={(browser.name != 'ie' ? this.handleBlur.bind(this, 'input') : null)}
							onFocus={this.handleFocus.bind(this, 'input')}
						/>
						<input type="text" readOnly={true} ref="head"
							value={this.props.options.find((op) => (op.value == this.props.selected)).dispValue}
							style={(this.state.displayInput ? {display: 'none'} : null)}
							onClick={this.handleClick.bind(this, 'head')}
							onKeyDown={this.handleKeyDown.bind(this, 'head')}
							onBlur={(browser.name != 'ie' ? this.handleBlur.bind(this, 'head') : null)}
							onFocus={this.handleFocus.bind(this, 'head')}
						/>
					</div>
					<span className="srchselect__arrow" onClick={this.handleClick.bind(this, 'arrow')}>
						{this.props.arrow}
					</span>
				</div>
				{(this.state.result.length > 0) &&
					<div>
						<div>
							<ul className="srchselect__resultwrap">{result}</ul>
						</div>
					</div>
				}
				<ul ref="invisible" style={this.getStyle('invisible')}>
					{this.props.options.map((op) => <li key={op.value}>{op.dispValue}</li>)}
				</ul>
			</div>
		);
	}
}
SrchSelect.propTypes = {
	selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	options: PropTypes.arrayOf(PropTypes.object).isRequired,
	arrow: PropTypes.element,
	onChange: PropTypes.func.isRequired,
	onBlur: PropTypes.func
};
SrchSelect.defaultProps = {
	arrow: <i className="pe-7s-angle-down pe-va"></i>
}

export default SrchSelect;
