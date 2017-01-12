import React, {Component} from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRedirect, browserHistory} from 'react-router';
import {createHistory} from 'history';
import {Provider, connect} from 'react-redux';
import adminStore from './store/adminStore';
import adminActionCreators from './actions/adminActionCreators';
import Admin from './components/Admin';
import Users from './components/Users';
import Agreement from './components/Agreement';
import './style/admin.less';

const mapOfAdmin = {
	stateToProps: (state) => ({
		isAdmin: state.admin.role,
		loginType: state.admin.loginType,
		id: state.admin.id,
		password: state.admin.password
	}),
	dispatchToProps: (dispatch) => ({
		fetchAdminInfo: () => dispatch(adminActionCreators.fetchAdminInfo())
	})
}
const AdminContainer = connect(mapOfAdmin.stateToProps, mapOfAdmin.dispatchToProps)(Admin);

const mapOfUsers = {
	stateToProps: (state) => ({
		fieldData: state.users.fieldData,
		list: state.users.list,
		originalList: state.users.originalList
	}),
	dispatchToProps: (dispatch) => ({
		fetchUserFieldData: () => dispatch(adminActionCreators.fetchUserFieldData()),
		fetchUserList: (page) => dispatch(adminActionCreators.fetchUserList(page))
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
				<IndexRedirect to="/admin/users" />
				<Route path="users(/page/:page)" component={UsersContainer} />
				<Route path="agreement" component={AgreementContainer} />
			</Route>
		</Router>
	</Provider>,
	document.getElementById('root')
);
