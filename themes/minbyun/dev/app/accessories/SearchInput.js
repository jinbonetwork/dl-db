import React, {Component, PropTypes} from 'react';
import Item from './Item';

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
		if(this.state.focused === 0) this.refs.input.focus();
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.focus) this.setState({focused: 0});
	}
	componentDidUpdate(prevProps, prevState){
		if(this.state.focused === 0) this.refs.input.focus();
	}
	search(keyword){
		this.setState({isSearching: true});
		this.props.search(keyword, (result) => {
			if(result){
				this.setState({result: result, isSearching: false});
			} else {
				this.setState({result: [], isSearching: false});
			}
		});
	}
	handleChange(event){
		this.props.onChange(event.target.value);
	}
	handleKeyUp(which, event){
		if(which == 'input' && event.key != 'Enter' && event.key != 'ArrowDown' && event.key != 'ArrowUp'){
			this.search(event.target.value);
		}
	}
	handleKeyDown(which, arg1st, arg2nd){
		if(which == 'input'){
			const event = arg1st;
			if(event.key == 'ArrowDown') this.setState({focused: 1});
			else if(event.key == 'Enter') this.search(event.target.value);
		}
		else if(which == 'item'){
			const index = arg1st;
			const key = arg2nd;
			if(key == 'ArrowDown') this.setState({focused: index+1});
			else if(key == 'ArrowUp') this.setState({focused: index-1});
		}
	}
	handleClick(which, value, item){
		if(which == 'item'){
			this.setState({value: value, result: [], focused: 0});
			if(this.props.onChange) this.props.onChange(item);
		}
		else if(which == 'search'){
			this.search(this.state.value);
		}
	}
	handleBlur(which, arg1st){
		if(which == 'input'){
			const event = arg1st;
			if(!event.relatedTarget || this.state.groupName != event.relatedTarget.getAttribute('groupname')){
				this.setState({result: [], focused: -1});
			}
		}
		else if(which == 'item'){
			const isFocusInHere = arg1st;
			if(!isFocusInHere) this.setState({result: [], focused: -1});
		}
	}
	render(){
		const result = this.state.result.map((item, index) => {
			const itemContent = [];
			for(let i = 0; i < 2; i++){
				const pn = this.props.resultFNames[i];
				itemContent.push(<span key={pn} className="searchinput__col">{item[pn]}</span>);
			}
			const indexOfItem = index + 1;
			return (
				<Item key={index} tabIndex="-1" onClick={this.handleClick.bind(this, 'item',item[this.props.resultFNames[0]], item)}
					groupName={this.state.groupName}
					focus={this.state.focused == indexOfItem}
					onKeyDown={this.handleKeyDown.bind(this, 'item', indexOfItem)}
					onBlur={this.handleBlur.bind(this, 'item')}
				>
					{itemContent}
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
		return(
			<div className="searchinput">
				<input type="text" ref="input" value={(this.props.value ? this.props.value : '')}
					onChange={this.handleChange.bind(this)}
					onKeyUp={this.handleKeyUp.bind(this, 'input')}
					onKeyDown={this.handleKeyDown.bind(this, 'input')}
					onBlur={this.handleBlur.bind(this, 'input')}
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
	search: PropTypes.func.isRequired,
	resultFNames: PropTypes.array.isRequired
};

export default SearchInput;
