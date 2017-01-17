import React, {Component} from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import {createHistory} from 'history';
import {Provider, connect} from 'react-redux';
import adminStore from './store/adminStore';
import adminActionCreators from './actions/adminActionCreators';
import Admin from './components/Admin';
import Users from './components/Users';
import Agreement from './components/Agreement';
import './style/admin.less';
import './style/login.less';
import './style/mainMenu.less';
import './style/users.less';
import './style/accessories.less';

const mapOfAdmin = {
	stateToProps: (state) => ({
		isAdmin: state.admin.isAdmin,
		loginType: state.admin.loginType,
		id: state.admin.id,
		password: state.admin.password,
		message: state.admin.message
	}),
	dispatchToProps: (dispatch) => ({
		fetchAdminInfo: () => dispatch(adminActionCreators.fetchAdminInfo()),
		onChange: (which, value) => dispatch(adminActionCreators.changePropsInAdmin(which, value)),
		onLogin: (loginUrl, formData, failLogin) => dispatch(adminActionCreators.login(loginUrl, formData, failLogin)),
		showMessage: (message, callback) => dispatch(adminActionCreators.showMessage(message, callback)),
		hideMessage: () => dispatch(adminActionCreators.hideMessage())
	})
}
const AdminContainer = connect(mapOfAdmin.stateToProps, mapOfAdmin.dispatchToProps)(Admin);

const mapOfUsers = {
	stateToProps: (state) => ({
		fieldData: state.users.fieldData,
		list: state.users.list,
		originalList: state.users.originalList,
		lastPage: state.users.lastPage
	}),
	dispatchToProps: (dispatch) => ({
		fetchUserFieldData: () => dispatch(adminActionCreators.fetchUserFieldData()),
		fetchUserList: (page) => dispatch(adminActionCreators.fetchUserList(page)),
		showMessage: (message, callback) => dispatch(adminActionCreators.showMessage(message, callback))
	})
}
const UsersContainer = connect(mapOfUsers.stateToProps, mapOfUsers.dispatchToProps)(Users);

const mapOfAgreement = {
	stateToProps: (state) => ({
		agreement: state.agreement
	}),
	dispatchToProps: (dispatch) => ({
		fetchAgreement: () => dispatch(adminActionCreators.fetchAgreement())
	})
}
const AgreementContainer = connect(mapOfAgreement.stateToProps, mapOfAgreement.dispatchToProps)(Agreement);

render(
	<Provider store={adminStore}>
		<Router history={browserHistory}>
			<Route path="/admin" component={AdminContainer}>
				<IndexRoute component={UsersContainer} />
				<Route path="users(/page/:page)" component={UsersContainer} />
				<Route path="agreement" component={AgreementContainer} />
			</Route>
		</Router>
	</Provider>,
	document.getElementById('root')
);
