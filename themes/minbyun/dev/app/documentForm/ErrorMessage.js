import React, {Component, PropTypes} from 'react';
import Overlay from '../Overlay';

class ErrorMessage extends Component {
	render(){
		return (
			<div className="error-message">
				<Overlay handleClick={this.props.handleClick.bind(this)} />
				<div className="error-message__message" onClick={this.props.handleClick.bind(this)}>
					{this.props.message}
				</div>
			</div>
		);
	}
}
ErrorMessage.propTypes = {
	message: PropTypes.string.isRequired,
	handleClick: PropTypes.func.isRequired
}

export default ErrorMessage;
