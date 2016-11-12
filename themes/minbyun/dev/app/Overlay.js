import React, {Component, PropTypes} from 'react';

class Overlay extends Component {
	render(){
		return (
			<div className="overlay" onClick={this.props.handleClick.bind(this)}></div>
		);
	}
}
Overlay.propTypes = {
	handleClick: PropTypes.func
}

export default Overlay;
