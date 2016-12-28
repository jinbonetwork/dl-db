import React, {Component, PropTypes} from 'react';

class Overlay extends Component {
	handleClick(event){
		if(this.props.onClick) this.props.onClick();
	}
	render(){
		let className = (this.props.onClick ? 'overlay overlay--clickable' : 'overlay');
		return (
			<div className={className} onClick={this.handleClick.bind(this)}></div>
		);
	}
}
Overlay.propTypes = {
	onClick: PropTypes.func
}

export default Overlay;
