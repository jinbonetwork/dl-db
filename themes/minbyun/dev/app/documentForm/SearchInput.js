import React, {Component, PropTypes} from 'react';
import axios from 'axios';

class SearchInput extends Component {
	constructor(){
		super();
		this.state = {
			results: undefined
		}
	}
	handleChange(event){
		this.props.updateSingleField(this.props.field, this.props.index, event.target.value);
	}
	handleKeyUp(event){
		if(event.target.value){
			this.search(event.target.value);
		} else {
			this.setState({results: undefined});
		}
	}
	handleChangeToUpdateFields(event){
		this.props.updateFields({['f'+this.props.field.fid]: event.target.value});
	}
	search(keyword){
		axios.get(this.props.searchApiUrl+keyword)
		.then((response) => {
			if(response.statusText == 'OK'){
				if(response.data.error == 0){
					return response.data.members;
				} else {
					this.setState({results: []});
					console.error(response.data);
				}
			} else {
				this.setState({results: []});
				console.error('Server response was not OK');
			}
		})
		.then((members) => {
			this.setState({results: members});
		});
	}
	handleClickListItem(result, event){
		let fields = {};
		this.props.resultMap.fname.forEach((fname, i) => {
			fields['f'+this.props.resultMap.fid[i]] = result[fname];
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
							<span className="searchinput__col-0">{result[this.props.resultMap.fname[0]]}</span>
							<span className="searchinput__col-1">{result[this.props.resultMap.fname[1]]}</span>
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
	value: PropTypes.string,
	index: PropTypes.number,
	field: PropTypes.object.isRequired,
	searchApiUrl: PropTypes.string.isRequired,
	resultMap: PropTypes.object.isRequired,
	updateSingleField: PropTypes.func.isRequired,
	updateFields: PropTypes.func.isRequired
};

export default SearchInput;
