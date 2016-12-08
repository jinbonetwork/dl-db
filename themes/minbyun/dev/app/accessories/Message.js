import React, {Component, PropTypes} from 'react';
import Overlay from './Overlay';

class Message extends Component {
	render(){
		let className = (this.props.handleClick ? 'message message--clickable': 'message');
		if(this.props.className) className += ' '+this.props.className;
		return (
			<div>
				<Overlay handleClick={this.props.handleClick.bind(this)} />
				<div className={className} onClick={this.props.handleClick.bind(this)}>
					{this.props.children}
				</div>
			</div>
		);
	}
}
Message.propTypes = {
	className: PropTypes.string,
	handleClick: PropTypes.func.isRequired
}

export default Message;
