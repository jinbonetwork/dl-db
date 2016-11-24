import React, {Component, PropTypes} from 'react';
import DoctypeSelect from './searchBar/DoctypeSelect';

class SearchBar extends Component {
	constructor(){
		super();
		this.state = {
			doctype: [],
			keyword: undefined,
			from: '',
			to: ''
		};
	}
	doctypeOptions(){
		let options = {};
		this.props.docData.taxonomy.doctype.forEach((value) => {
			data[value] = this.props.docData.terms[value];
		});
		return options;
	}
	handleChange(which, arg, event){
		if(which == 'doctype'){
		}
	}
	render(){
		let className = (this.props.mode == 'content' ? 'serchbar searchbar--content' : 'searchbar');
		let searchBar = (
			<div>
				<DoctypeSelect options={this.doctypeOptions()} handleChange={this.handleChange.bind(this, 'doctype')} />
			</div>
		);
		return(
			<div className={className}>
				{searchBar}
			</div>
		);
	}
}
SearchBar.propTypes = {
	mode: PropTypes.string,
	docData: PropTypes.object.isRequired
}

export default SearchBar;
