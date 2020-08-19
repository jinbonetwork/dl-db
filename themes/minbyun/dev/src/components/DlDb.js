import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import MainMenu from './MainMenu';
import Login from './Login';
import SearchBar from './SearchBar';
import Message from './Message';
import {SCREEN} from '../constants';
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
	shouldComponentUpdate(nextProps){
		if(!this.props.login.doAgree && nextProps.login.doAgree) return false;
		else return true;
	}
	componentWillUnmount(){
		jQ(window).off('resize');
	}
	handleResize(){
		this.props.onResize({width: window.innerWidth, height: window.innerHeight});
	}
	render(){
		const message = this.props.message.content && <Message {...this.props.message} hideMessage={this.props.hideMessage} />;
		const process = this.props.showProc && (
			<div className="process">
				<div></div>
				<div><i className="pe-7f-config pe-va pe-spin"></i></div>
			</div>
		);
		const overlay = this.props.showOverlay && (
			<div className="overlay"></div>
		);
		const content = _wrap(() => {
			if( ( this.props.docFieldData && this.props.login.doAgree ) || window.location.pathname.match('/user/regist') ) {
				const child = this.props.children;
				const searchBar = (
					<SearchBar mode={(child ? null : 'content')} {...this.props.searchBar} fData={this.props.docFieldData}
						window={this.props.window} onChange={this.props.onChangeQuery}
						changeSearchBarState={this.props.changeSearchBarState} showMessage={this.props.showMessage}
					/>
				);
				return [
					<div key="header" className="digital-library__header">
						<Link className="digital-library__logo" to="/">
							<img src={site_base_uri+'/themes/minbyun/images/logo.png'} />
							{(!child || this.props.window.with <= SCREEN.sMedium) && <span>민주사회를 위한 변호사모임</span>}
						</Link>
						{(child ? searchBar : <span>&nbsp;</span>)}
						<MainMenu role={this.props.role} menuData={this.props.menuData} window={this.props.window}
							onLogOut={this.props.onLogOut}
						/>
					</div>,
					<div key="content" className="digital-library__content">
						{child || searchBar}
					</div>
				];
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
				{overlay}
			</div>
		);
	}
}
DlDb.propTypes = {
	role: PropTypes.array,
	docFieldData: PropTypes.object,
	menuData: PropTypes.array.isRequired,
	message: PropTypes.shape({
		content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
		callback: PropTypes.func
	}).isRequired,
	showProc: PropTypes.bool,
	showOverlay: PropTypes.bool,
	window: PropTypes.object.isRequired,
	login: PropTypes.object.isRequired,
	searchBar: PropTypes.object.isRequired,
	fetchRootData: PropTypes.func.isRequired,
	hideMessage: PropTypes.func.isRequired,
	onResize: PropTypes.func.isRequired,
	onLogin: PropTypes.func.isRequired,
	fetchAgreement: PropTypes.func.isRequired,
	onAgree: PropTypes.func.isRequired,
	onLogOut: PropTypes.func.isRequired,
	onChangeQuery: PropTypes.func.isRequired,
	changeSearchBarState: PropTypes.func.isRequired,
	showMessage: PropTypes.func.isRequired
};

export default DlDb;
