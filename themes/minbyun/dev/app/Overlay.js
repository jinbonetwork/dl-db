import React, {Component, PropTypes} from 'react';

class Overlay extends Component {
	handleClick(event){
		if(this.props.handleClick){
			this.props.handleClick.bind(this);
		}
	}
	render(){
		return (
			<div className="overlay" onClick={this.handleClick.bind(this)}></div>
		);
	}
}
Overlay.propTypes = {
	handleClick: PropTypes.func
}

export default Overlay;
