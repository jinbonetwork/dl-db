import React, {Component} from 'react';

class SearchKeyword extends Component {
	render(){
		return(
			<div>
				<input type="search"
					onChange={this.handleChange.bind(this, field)}
					onKeyDown={this.handleKeyDown.bind(this, field)}
				/>
				<ul></ul>
			</div>
		);
	}
}

export default SearchKeyword;
