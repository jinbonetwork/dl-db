import React, {Component, PropTypes} from 'react';
import Item from './Item';
import jQ from 'jquery';
import browser from 'detect-browser';
import {_mapO} from './functions';

class SearchInput extends Component {
	constructor(){
		super();
		this.groupName = 'SearchInput'+Date.now();
		this.state = {
			displayInput: false,
			keyword: '',
			result: [],
			isSearching: false,
			focused: -1,
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
			let keyword = event.target.value;
			this.setState({keyword, isSearching: true});
			if(keyword){
				this.props.onSearch(keyword, (result) => {
					if(result){
						this.setState({result: result, isSearching: false});
					} else {
						this.setState({result: [], isSearching: false});
					}
				});
			}
		}
	}
	handleKeyDown(which, arg1st, arg2nd, arg3rd){
		if(which == 'input'){
			const event = arg1st;
			if(event.key == 'ArrowDown'){ this.setState({focused: 1}); event.preventDefault(); }
			else if(event.key == 'Enter') this.handleChange(event);
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
	handleClick(which, value, item){
		if(which == 'head'){
			let keyword = this.props.value;
			this.setState({focused: 0, displayInput: true, keyword});
			this.handleChange('input', {target: {value: keyword}});
		}
		else if(which == 'item'){
			this.setState({result: [], focused: 0, displayInput: false});
			if(this.props.onChange) this.props.onChange(item);
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
	render(){
		const result = this.state.result.map((item, index) => {
			let slugs = _mapO(item, (pn, pv) => (pn));
			const indexOfItem = index + 1;
			return (
				<Item key={index} tabIndex="-1" onClick={this.handleClick.bind(this, 'item', item[slugs[0]], item)}
					groupName={this.groupName}
					focus={this.state.focused == indexOfItem}
					onKeyDown={this.handleKeyDown.bind(this, 'item', indexOfItem)}
					onBlur={this.handleBlur.bind(this, 'item')}
				>
					{slugs.length > 1 ? item[slugs[0]] + ' ('+item[slugs[1]]+')' : item[slugs[0]]}
				</Item>
			);
		});
		return(
			<div className="searchinput">
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
					value={this.props.value}
					style={(this.state.displayInput ? {display: 'none'} : null)}
					onClick={this.handleClick.bind(this, 'head')}
					onKeyDown={this.handleKeyDown.bind(this, 'head')}
					onBlur={(browser.name != 'ie' ? this.handleBlur.bind(this, 'head') : null)}
					onFocus={this.handleFocus.bind(this, 'head')}
				/>
				{this.state.isSearching &&
					<span className="searchinput__spinner">
						<i className="pe-7s-config pe-spin pe-va"></i>
					</span>
				}
				{/*!this.state.isSearching &&
					<button className="searchinput__button" tabIndex="-1" onClick={this.handleClick.bind(this, 'search')}>
						<i className="pe-7s-search pe-va"></i>
					</button>
				*/}
				{this.state.result.length > 0 &&
					<div className="searchinput__result">
						<ul>{result}</ul>
					</div>
				}
			</div>
		);
	}
}
SearchInput.propTypes = {
	value: PropTypes.string,
	focus: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
	onSearch: PropTypes.func.isRequired,
	onBlur: PropTypes.func
};
SearchInput.defaultProps = {
	value: ''
};

export default SearchInput;
