import React, {Component, PropTypes} from 'react';
import {_fieldAttrs} from '../schema/docSchema';

class SearchInput extends Component {
	componentWillMount(){
		this.setState({
			fieldsToPut: _fieldAttrs[_fieldAttrs[this.props.fname].parent].children,
			results: undefined
		});
	}
	handleChange(event){
		this.props.updateSingleField(this.props.fname, undefined, event.target.value);
		if(event.target.value){
			this.search(event.target.value);
		} else {
			this.setState({results: undefined});
		}
	}
	search(keyword){
		keyword = encodeURIComponent(keyword);
		this.props.fetchData('get', this.props.api+keyword, (data) => {
			this.setState({results: data.members});
		});
	}
	handleClick(result){
		let fields = {};
		this.state.fieldsToPut.forEach((f) => {
			fields[f] = result[f];
		});
		this.props.updateFields(fields);
		this.setState({results: undefined});
	}
	render(){
		let	displayResults = (this.state.results !== undefined && this.state.results.length > 0) && (
			<div className="searchinput__result">
				<ul>{
					this.state.results.map((result) => (
						<li className="button" key={result.id} onClick={this.handleClick.bind(this, result)}>
							<span className="searchinput__col-0">{result[this.state.fieldsToPut[0]]}</span>
							<span className="searchinput__col-1">{result[this.state.fieldsToPut[1]]}</span>
						</li>
					))}
				</ul>
			</div>
		);
		return(
			<div className="searchinput">
				<input type="text" value={this.props.value} onChange={this.handleChange.bind(this)}/>
				{displayResults}
			</div>
		);
	}
}
SearchInput.propTypes = {
	value: PropTypes.string.isRequired,
	fname: PropTypes.string.isRequired,
	api: PropTypes.string.isRequired,
	updateSingleField: PropTypes.func.isRequired,
	updateFields: PropTypes.func.isRequired,
	fetchData: PropTypes.func.isRequired
};

export default SearchInput;
