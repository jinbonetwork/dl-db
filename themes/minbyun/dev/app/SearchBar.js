import React, {Component, PropTypes} from 'react';
import DoctypeSelect from './searchBar/DoctypeSelect';
import {_fieldAttrs} from './docSchema';

class SearchBar extends Component {
	constructor(){
		super();
		this.state = {
			doctypes: [],
			keyword: undefined,
			from: '',
			to: ''
		};
	}
	doctypeOptions(){
		let options = {};
		this.props.docData.taxonomy.doctype.forEach((value) => {
			options[value] = this.props.docData.terms[value];
		});
		return options;
	}
	handleChange(which, arg, event){
		if(which == 'doctype'){
			this.setState({doctypes: arg})
		}
	}
	render(){
		let className = (this.props.mode == 'content' ? 'serchbar searchbar--content' : 'searchbar');
		let searchBar = (
			<div>
				<DoctypeSelect displayName={_fieldAttrs['doctype'].displayName}
					values={this.state.doctypes} options={this.doctypeOptions()}
					handleChange={this.handleChange.bind(this, 'doctype')}
				/>
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
