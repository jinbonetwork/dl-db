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
	search(keyword){
		this.setState({isSearching: true});
		this.props.search(keyword, (result) => {
			if(result){
				this.setState({result: result, isSearching: false});
			}
		});
	}

	handleChange(value){
		this.setState({value: value});
		if(value){
			this.setState({value: value, isSearching: true});
			this.search(value);
		} else {
			this.setState({value: value, isSearching: false});
		}
	}
	/*
	handleChange(event){ console.log('change');
		this.setState({value: event.target.value});
	}
	handleKeyUp(event){
		console.log(event.key, event.target.value);
		if(this.state.value){
			this.search(this.state.value);
		}
	}
	*/
	handleClick(searchFName, item){
		this.setState({result: []});
		if(this.props.onChange){
			this.props.onChange(item);
		}
	}
	render(){
		const result = this.state.result.map((item, index) => {
			const itemContent = [];
			for(let i = 0; i < 2; i++){
				const pn = this.props.resultFNames[i];
				itemContent.push(<span key={pn} className="searchinput__col">{item[pn]}</span>);
			}
			return <li key={index} onClick={this.handleClick.bind(this, item[this.props.resultFNames[0]], item)}>
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
		return(
			<div className="searchinput">
				<TextInput value={this.state.value} onChange={this.handleChange.bind(this)} />
				{/*<input type="text" value={this.state.value} onChange={this.handleChange.bind(this)} onKeyUp={this.handleKeyUp.bind(this)} />*/}
				{spinner}
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
