import React, {Component, PropTypes} from 'react';
import Overlay from './Overlay';

class ErrorMessage extends Component {
	render(){
		let className = (this.props.className ? 'error-message__message '+this.props.className : 'error-message__message');
		return (
			<div className="error-message">
				<Overlay handleClick={this.props.handleClick.bind(this)} />
				<div className={className} onClick={this.props.handleClick.bind(this)}>
					{this.props.message}
				</div>
			</div>
		);
	}
}
ErrorMessage.propTypes = {
	className: PropTypes.string,
	message: PropTypes.string.isRequired,
	handleClick: PropTypes.func.isRequired
}

export default ErrorMessage;
