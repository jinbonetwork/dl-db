import React, {Component, PropTypes} from 'react';

class SearchBar extends Component {
	render(){
		let className = (this.props.mode == 'content' ? 'serchbar searchbar--content' : 'searchbar');
		return(
			<div className={className}>
			</div>
		);
	}
}
SearchBar.propTypes = {
	mode: PropTypes.string
}

export default SearchBar;
