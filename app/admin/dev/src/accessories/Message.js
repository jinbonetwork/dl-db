import React, {Component, PropTypes} from 'react';
import Overlay from './Overlay';

class Message extends Component {
	componentDidMount(){
		this.refs.message.focus();
	}
	handleClick(){
		if(this.props.onClick) this.props.onClick();
	}
	handleKeyDown(){
		this.handleClick();
	}
	render(){
		let className = (this.props.className ? 'message '+this.props.className: 'message');
		return (
			<div>
				<Overlay onClick={this.handleClick.bind(this)} />
				<div tabIndex="0" ref="message" className={className} onClick={this.handleClick.bind(this)} onKeyDown={this.handleKeyDown.bind(this)}>
					{this.props.children}
				</div>
			</div>
		);
	}
}
Message.propTypes = {
	className: PropTypes.string,
	onClick: PropTypes.func
}

export default Message;
