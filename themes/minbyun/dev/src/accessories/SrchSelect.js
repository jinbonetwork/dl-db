import React, {Component, PropTypes} from 'react';
import Item from './Item';
import jQ from 'jquery';
import browser from 'detect-browser';
import {_mapO} from './functions';

class SrchSelect extends Component {
	constructor(){
		super();
		this.groupName = 'SrchSelect'+Date.now();
		this.state = {
			displayInput: false,
			keyword: '',
			result: [],
			focused: -1
		};
	}
	componentWillMount(){
		if(this.props.focus) this.setState({focused: 0});
	}
	componentDidMount(){
		this.refs.input.setAttribute('groupname', this.groupName);
		if(browser.name == 'ie'){
			jQ(this.refs.input).focusout((event) => {this.handleBlur('input', event);});
		}
		if(this.state.focused === 0){
			if(this.state.displayInput) this.refs.input.focus();
			else this.refs.head.focus();
		}
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
			let keyword = event.target.value.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi, '');
			if(keyword) this.props.options.forEach((op) => {if(op.dispValue.match(keyword)) result.push(op);});
			this.setState({keyword: event.target.value, result: result});
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
	handleClick(which, value){
		if(which == 'item'){
			const item = value;
			this.setState({result: [], focused: 0, displayInput: false});
			this.props.onChange(item.value);
		}
		else if(which == 'head'){
			this.setState({focused: 0, displayInput: true, keyword: ''});
		}
	}
	handleBlur(which, arg1st){
		if(which == 'input'){
			const event = arg1st;
			if(!event.relatedTarget || this.groupName != event.relatedTarget.getAttribute('groupname')){
				this.setState({result: [], focused: -1, displayInput: false});
				if(this.props.onBlur) this.props.onBlur();
			}
		}
		else if(which == 'item'){
			const isFocusInHere = arg1st;
			if(!isFocusInHere) this.setState({result: [], focused: -1});
			if(this.props.onBlur) this.props.onBlur();
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
				<div className="srchselect__headwrap">
					<input type="text" ref="input" value={this.state.keyword} style={(this.state.displayInput ? null : {display: 'none'})}
						onChange={this.handleChange.bind(this, 'input')}
						onKeyDown={this.handleKeyDown.bind(this, 'input')}
						onBlur={(browser.name != 'ie' ? this.handleBlur.bind(this, 'input') : null)}
					/>
					<span tabIndex="0" ref="head" style={(this.state.displayInput ? {display: 'none'} : null)}
						onClick={this.handleClick.bind(this, 'head')}
						onKeyDown={this.handleKeyDown.bind(this, 'head')}
					>
						{this.props.options.find((op) => (op.value == this.props.selected)).dispValue}
					</span>
				</div>
				{(this.state.result.length > 0) &&
					<div className="srchselect__result">
						<ul>{result}</ul>
					</div>
				}
				<div className="srchselect__invisible">
					<ul>{this.props.options.map((op) => <li key={op.value}>{op.dispValue}</li>)}</ul>
				</div>
			</div>
		);
	}
}
SrchSelect.propTypes = {
	selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	options: PropTypes.arrayOf(PropTypes.object).isRequired,
	onChange: PropTypes.func.isRequired,
	onBlur: PropTypes.func
};

export default SrchSelect;
