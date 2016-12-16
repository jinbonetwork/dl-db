import React, {Component, PropTypes} from 'react';
import Overlay from './Overlay';

class Message extends Component {
	handleClick(){
		if(this.props.onClick) this.props.onClick();
	}
	handleKeyDown(){
		if(this.props.onKeyDown) this.props.onKeyDown();
	}
	render(){
		let className = (this.props.className ? 'message '+this.props.className: 'message');
		return (
			<div>
				<Overlay onClick={this.handleClick.bind(this)} />
				<button type="button" className={className} autoFocus={true} onClick={this.handleClick.bind(this)} onKeyDown={this.handleKeyDown.bind(this)}>
					{this.props.children}
				</button>
			</div>
		);
	}
}
Message.propTypes = {
	className: PropTypes.string,
	onClick: PropTypes.func,
	onKeyDown: PropTypes.func
}

export default Message;
