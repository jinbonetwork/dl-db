import React, {Component, PropTypes} from 'react';
import Item from './Item';
import jQ from 'jquery';
import browser from 'detect-browser';
import {_mapO} from './functions';

class SearchInput extends Component {
	constructor(){
		super();
		this.state = {
			groupName: 'SearchInput'+Date.now(),
			result: [],
			isSearching: false,
			focused: -1
		};
	}
	componentWillMount(){
		if(this.props.focus) this.setState({focused: 0});
	}
	componentDidMount(){
		this.refs.input.setAttribute('groupname', this.state.groupName);
		if(this.state.focused === 0) this.refs.input.focus();
		if(browser.name == 'ie'){
			jQ(this.refs.input).focusout((event) => {this.handleBlur('input', event);});
		}
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.focus) this.setState({focused: 0});
	}
	componentDidUpdate(prevProps, prevState){
		if(this.state.focused === 0) this.refs.input.focus();
	}
	search(keyword){ if(keyword){
		this.setState({isSearching: true});
		this.props.onSearch(keyword, (result) => {
			if(result){
				this.setState({result: result, isSearching: false});
			} else {
				this.setState({result: [], isSearching: false});
			}
		});
	}}
	handleChange(event){
		this.props.onChange(event.target.value);
	}
	handleKeyUp(which, event){
		if(which == 'input' && event.key != 'Enter' && event.key != 'ArrowDown' && event.key != 'ArrowUp'){
			this.search(event.target.value);
		}
	}
	handleKeyDown(which, arg1st, arg2nd, arg3rd){
		if(which == 'input'){
			const event = arg1st;
			if(event.key == 'ArrowDown'){ this.setState({focused: 1}); event.preventDefault(); }
			else if(event.key == 'Enter') this.search(event.target.value);
		}
		else if(which == 'item'){
			const [index, key, event] = [arg1st, arg2nd, arg3rd];
			if(key == 'ArrowDown'){ this.setState({focused: index+1}); event.preventDefault(); }
			else if(key == 'ArrowUp'){ this.setState({focused: index-1}); event.preventDefault(); }
		}
	}
	handleClick(which, value, item){
		if(which == 'item'){
			this.setState({value: value, result: [], focused: 0});
			if(this.props.onChange) this.props.onChange(item);
		}
		else if(which == 'search'){
			this.search(this.props.value);
		}
	}
	handleBlur(which, arg1st){
		if(which == 'input'){
			const event = arg1st;
			if(!event.relatedTarget || this.state.groupName != event.relatedTarget.getAttribute('groupname')){
				this.setState({result: [], focused: -1});
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
					groupName={this.state.groupName}
					focus={this.state.focused == indexOfItem}
					onKeyDown={this.handleKeyDown.bind(this, 'item', indexOfItem)}
					onBlur={this.handleBlur.bind(this, 'item')}
				>
					{item[slugs[0]] + ' ('+item[slugs[1]]+')'}
				</Item>
			);
		});
		const displayResults = ((this.state.result.length > 0) &&
			<div className="searchinput__result">
				<ul>{result}</ul>
			</div>
		);
		const spinner = (this.state.isSearching &&
			<span className="searchinput__spinner">
				<i className="pe-7s-config pe-spin pe-va"></i>
			</span>
		);
		const searchButton = (!this.state.isSearching) && (
			<button className="searchinput__button" tabIndex="-1" onClick={this.handleClick.bind(this, 'search')}>
				<i className="pe-7s-search pe-va"></i>
			</button>
		);
		const handleInputBlur = (browser.name != 'ie' ? this.handleBlur.bind(this, 'input') : null);
		return(
			<div className="searchinput">
				<input type="text" ref="input" value={(this.props.value ? this.props.value : '')}
					onChange={this.handleChange.bind(this)}
					onKeyUp={this.handleKeyUp.bind(this, 'input')}
					onKeyDown={this.handleKeyDown.bind(this, 'input')}
					onBlur={handleInputBlur}
				/>
				{spinner}
				{searchButton}
				{displayResults}
			</div>
		);
	}
}
SearchInput.propTypes = {
	value: PropTypes.string,
	focus: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
	onBlur: PropTypes.func,
	onSearch: PropTypes.func.isRequired,
};

export default SearchInput;
