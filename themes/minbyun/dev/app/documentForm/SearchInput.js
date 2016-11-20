import React, {Component, PropTypes} from 'react';
import axios from 'axios';
import {_fieldAttrs} from '../docSchema';

class SearchInput extends Component {
	componentWillMount(){
		this.setState({
			fieldsToPut: _fieldAttrs[_fieldAttrs[this.props.fname].parent].children,
			results: undefined
		});
	}
	handleChange(event){
		this.props.updateSingleField(this.props.fname, undefined, event.target.value);
	}
	handleKeyUp(event){
		if(event.target.value){
			this.search(event.target.value);
		} else {
			this.setState({results: undefined});
		}
	}
	search(keyword){
		axios.get(this.props.api+keyword)
		.then((response) => {
			if(response.statusText == 'OK'){
				if(response.data.error == 0){
					this.setState({results: response.data.members});
				} else {
					this.setState({results: []});
					console.error(response.data);
				}
			} else {
				this.setState({results: []});
				console.error('Server response was not OK');
			}
		})
	}
	handleClickListItem(result, event){
		let fields = {};
		this.state.fieldsToPut.forEach((f) => {
			fields[f] = result[f];
		});
		this.props.updateFields(fields);
		this.setState({results: undefined});
	}
	handleClickClose(){
		this.setState({results: undefined});
	}
	render(){
		let	displayResults = (this.state.results !== undefined && this.state.results.length > 0) && (
			<div className="searchinput__result">
				<ul>{
					this.state.results.map((result) => (
						<li className="button" key={result.id} onClick={this.handleClickListItem.bind(this, result)}>
							<span className="searchinput__col-0">{result[this.state.fieldsToPut[0]]}</span>
							<span className="searchinput__col-1">{result[this.state.fieldsToPut[1]]}</span>
						</li>
					))}
				</ul>
			</div>
		);
		return(
			<div className="searchinput">
				<input type="text" className="textinput" value={this.props.value}
					onChange={this.handleChange.bind(this)} onKeyUp={this.handleKeyUp.bind(this)}
				/>
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
	updateFields: PropTypes.func.isRequired
};

export default SearchInput;
