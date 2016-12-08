import React, {Component, PropTypes} from 'react';
import TextInput from './TextInput';

class SearchInput extends Component {
	constructor(){
		super();
		this.state = {
			value: '',
			result: [],
			isSearching: false
		};
	}
	componentWillMount(){
		if(this.props.value) this.setState({value: this.props.value});
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.value) this.setState({value: nextProps.value});
	}
	componentDidUpdate(prevProps, prevState){
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
		this.setState({value: event.target.value});
		if(this.props.onChange) this.props.onChange(event.target.value);
	}
	handleKeyDown(event){
		if(event.key == 'Enter'){
			this.search(event.target.value);
		}
	}
	handleClick(which, value, item){
		if(which == 'item'){
			this.setState({value: value, result: []});
			if(this.props.onChange) this.props.onChange(item);
		}
		else if(which == 'search'){
			this.search(this.state.value);
		}
	}
	render(){
		const result = this.state.result.map((item, index) => {
			const itemContent = [];
			for(let i = 0; i < 2; i++){
				const pn = this.props.resultFNames[i];
				itemContent.push(<span key={pn} className="searchinput__col">{item[pn]}</span>);
			}
			return <li key={index} onClick={this.handleClick.bind(this, 'item',item[this.props.resultFNames[0]], item)}>
				{itemContent}
			</li>
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
		const searchButton = (!this.state.isSearching) &&
			<button className="searchinput__button" onClick={this.handleClick.bind(this, 'search')}>
				<i className="pe-7s-search pe-va"></i>
			</button>
		return(
			<div className="searchinput">
				<input type="text" value={this.state.value} onChange={this.handleChange.bind(this)} onKeyDown={this.handleKeyDown.bind(this)} />
				{spinner}
				{searchButton}
				{displayResults}
			</div>
		);
	}
}
SearchInput.propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func,
	search: PropTypes.func.isRequired,
	resultFNames: PropTypes.array.isRequired
};

export default SearchInput;
