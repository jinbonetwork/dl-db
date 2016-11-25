import React, {Component, PropTypes} from 'react';

class Option extends Component {
	render(){
		return (
			<li>
				{this.props.children}
			</li>
		);
	}
}
Option.propTypes = {
	children: PropTypes.string.isRequired
};

export default Option;
