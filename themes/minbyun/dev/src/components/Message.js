import React, {Component, PropTypes} from 'react';

class Message extends Component {
	componentDidMount(){
		if(this.props.mode == 'fadeout'){
			setTimeout(this.handleClick.bind(this), 2000);
		}
	}
	handleClick(){
		this.props.hideMessage();
		if(this.props.callback) this.props.callback();
	}
	render(){
		return (
			<div className={'message' + (this.props.mode ? ' message--'+this.props.mode : '')}
				onClick={this.handleClick.bind(this, 'message')}
			>
				<div></div>
				<div className="message__content" tabIndex="0" ref="message"
					onKeyDown={this.handleClick.bind(this)}
				>
					{this.props.content}
				</div>
			</div>
		);
	}
}

Message.propTypes = {
	content: PropTypes.node.isRequired,
	mode: PropTypes.string,
	callback: PropTypes.func,
	hideMessage: PropTypes.func.isRequired
};

export default Message;
