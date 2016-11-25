import React, {Component, PropTypes} from 'react';

class Overlay extends Component {
	handleClick(event){
		if(this.props.handleClick) this.props.handleClick();
	}
	render(){
		let className = (this.props.handleClick ? 'overlay overlay--clickable' : 'overlay');
		return (
			<div className={className} onClick={this.handleClick.bind(this)}></div>
		);
	}
}
Overlay.propTypes = {
	handleClick: PropTypes.func
}

export default Overlay;
