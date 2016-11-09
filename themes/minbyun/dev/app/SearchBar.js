import React, {Component, PropTypes} from 'react';
import axios from 'axios';

class SearchBar extends Component {
	constructor(){
		super();
		this.state = {
			results: undefined
		}
	}
	handleChange(event){
		this.props.updateSingleField(this.props.field, this.props.index, event.target.value);
	}
	handleChangeToUpdateFields(event){
		this.props.updateFields({['f'+this.props.field.fid]: event.target.value});
	}
	handleKeyDown(event){ if(event.key == 'Enter' && event.target.value){
		/*
		axios.get(this.props.searchApiUrl+event.target.value)
		.then(({data}) => {
			console.log(data);
		})
		.catch((error) => {
			console.error(error);
		});
		*/
		let results = [
			{id: 1, name: '테스트1', class:'1기', email: 'example@email.net', phone: '010-1234-1234'},
			{id: 2, name: '테스트2', class:'2기', email: 'example@email.net', phone: '010-1234-1234'},
			{id: 3, name: '테스트3', class:'3기', email: 'example@email.net', phone: '010-1234-1234'}
		];
		this.setState({
			results: results
		});
	}}
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
		let	displayResults = (this.state.results !== undefined) && (
			<div className="searchbar__result">
				<span className="button" onClick={this.handleClickClose.bind(this)}>닫기</span>
				<ul>{
					this.state.results.length > 1 ?
						this.state.results.map((result) => (
							<li className="button" key={result.id} onClick={this.handleClickListItem.bind(this, result)}>
								<span>{result[this.props.resultMap.fname[0]]}</span>{' '}
								<span>{result[this.props.resultMap.fname[1]]}</span>
							</li>
						))
					: <span>검색결과없음</span>
				}</ul>
			</div>
		);
		return(
			<div className="searchbar">
				<input type="search" value={this.props.value}
					onChange={this.handleChange.bind(this)}
					onKeyDown={this.handleKeyDown.bind(this)}
				/>
				{displayResults}
			</div>
		);
	}
}
SearchBar.propTypes = {
	value: PropTypes.string,
	index: PropTypes.number,
	field: PropTypes.object.isRequired,
	searchApiUrl: PropTypes.string.isRequired,
	resultMap: PropTypes.object.isRequired,
	updateSingleField: PropTypes.func.isRequired,
	updateFields: PropTypes.func.isRequired

};

export default SearchBar;
