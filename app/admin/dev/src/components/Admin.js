import React, {Component, PropTypes} from 'react';
import MainMenu from './MainMenu';
import Login from './Login';

class Admin extends Component {
	componentDidMount(){
		this.props.fetchAdminInfo();
	}
	componentDidUpdate(prevProps, prevState){
		if(this.refs.message) this.refs.message.focus();
	}
	handleClick(which){
		if(which == 'message'){
			this.props.hideMessage();
			if(this.props.message.callback) this.props.message.callback();
		}
	}
	render(){
		const message = this.props.message.content && (
			<div className="message" onClick={this.handleClick.bind(this, 'message')}>
				<div></div>
				<div className="message__content" tabIndex="0" ref="message" onKeyDown={this.handleClick.bind(this, 'message')}>
					{this.props.message.content}
				</div>
			</div>
		);
		if(this.props.isAdmin){
			return (
				<div className="admin">
					<MainMenu />
					<div>
						{this.props.children}
					</div>
					{message}
				</div>
			);
		} else if(this.props.isAdmin === false){
			return (
				<div className="admin">
					<Login loginType={this.props.loginType} id={this.props.id} password={this.props.password}
						onChange={this.props.onChange} onLogin={this.props.onLogin} fetchAdminInfo={this.props.fetchAdminInfo} showMessage={this.props.showMessage}
					/>
					{message}
				</div>
			);
		} else {
			return null;
		}
	}
}
Admin.propTypes = {
	isAdmin: PropTypes.bool,
	loginType: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	password: PropTypes.string.isRequired,
	message: PropTypes.shape({
		content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
		callback: PropTypes.func
	}).isRequired,
	fetchAdminInfo: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	onLogin: PropTypes.func.isRequired,
	showMessage: PropTypes.func.isRequired,
	hideMessage: PropTypes.func.isRequired
};

export default Admin;
