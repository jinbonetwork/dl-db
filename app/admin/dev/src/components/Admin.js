import React, {Component, PropTypes} from 'react';
import MainMenu from './MainMenu';
import Login from './Login';
import {_wrap} from '../accessories/functions';

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
		const process = this.props.showProc && (
			<div className="process">
				<div></div>
				<div><i className="pe-7f-config pe-va pe-spin"></i></div>
			</div>
		)
		const content = _wrap(() => {
			if(this.props.userFieldData && this.props.docFieldData){
				return [
					<MainMenu key="main-menu" />,
					<div key="children">{this.props.children}</div>
				];
			}
			else if(this.props.isAdmin === false){
				return (
					<Login loginType={this.props.loginType} id={this.props.id} password={this.props.password}
						onChange={this.props.onChange} onLogin={this.props.onLogin} fetchAdminInfo={this.props.fetchAdminInfo}
					/>
				);
			}
			else return null;
		});

		return (
			<div className="admin">
				{content}
				{message}
				{process}
			</div>
		);
	}
}
Admin.propTypes = {
	isAdmin: PropTypes.bool,
	userFieldData: PropTypes.object,
	docFieldData: PropTypes.object,
	loginType: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	password: PropTypes.string.isRequired,
	message: PropTypes.shape({
		content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
		callback: PropTypes.func
	}).isRequired,
	showProc: PropTypes.bool,
	fetchAdminInfo: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	onLogin: PropTypes.func.isRequired,
	hideMessage: PropTypes.func.isRequired
};

export default Admin;
