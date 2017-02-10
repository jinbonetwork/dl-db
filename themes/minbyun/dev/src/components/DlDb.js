import React, {Component, PropTypes} from 'react';
//import MainMenu from './MainMenu';
import Login from './Login';
import jQ from 'jquery';
import {_wrap} from '../accessories/functions';

class DlDb extends Component {
	componentDidMount(){
		this.handleResize();
		jQ(window).on('resize', this.handleResize.bind(this));
		this.props.fetchRootData();
	}
	componentDidUpdate(prevProps, prevState){
		if(this.refs.message) this.refs.message.focus();
	}
	componentWillUnmount(){
		jQ(window).off('resize');
	}
	handleResize(){
		this.props.onResize({width: window.innerWidth, height: window.innerHeight});
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
			if(this.props.docFieldData && this.props.login.doAgree){
				/*
				return [
					<MainMenu key="main-menu" />,
					<div key="children">{this.props.children}</div>
				];
				*/
				return <div>content</div>;
			}
			else if(this.props.login.type && !this.props.login.doAgree){
				return (
					<Login {...this.props.login} window={this.props.window}
						onChange={this.props.onChangeLogin} onLogin={this.props.onLogin} fetchAgreement={this.props.fetchAgreement}
						onAgree={this.props.onAgree}
					/>
				);
			}
			else return null;
		});
		return (
			<div className="digital-library">
				{content}
				{message}
				{process}
			</div>
		);
	}
}
DlDb.propTypes = {
	role: PropTypes.array,
	login: PropTypes.object.isRequired,
	docFieldData: PropTypes.object,
	message: PropTypes.shape({
		content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
		callback: PropTypes.func
	}).isRequired,
	showProc: PropTypes.bool,
	window: PropTypes.object.isRequired,
	fetchRootData: PropTypes.func.isRequired,
	hideMessage: PropTypes.func.isRequired,
	onResize: PropTypes.func.isRequired,
	onLogin: PropTypes.func.isRequired,
	fetchAgreement: PropTypes.func.isRequired,
	onAgree: PropTypes.func.isRequired
	/*
	onChange: PropTypes.func.isRequired,
	onLogin: PropTypes.func.isRequired,
	*/
};

export default DlDb;
