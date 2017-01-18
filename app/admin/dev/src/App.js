import React, {Component} from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import {createHistory} from 'history';
import {Provider, connect} from 'react-redux';
import adminStore from './store/adminStore';
import adminActionCreators from './actions/adminActionCreators';
import Admin from './components/Admin';
import UserList from './components/UserList';
import User from './components/User';
import EditUser from './components/EditUser';
import NewUser from './components/NewUser';
import Agreement from './components/Agreement';
import './style/admin.less';
import './style/login.less';
import './style/mainMenu.less';
import './style/userlist.less';
import './style/accessories.less';

const mapOfAdmin = {
	stateToProps: (state) => ({
		isAdmin: state.admin.isAdmin,
		loginType: state.admin.loginType,
		id: state.admin.id,
		password: state.admin.password,
		message: state.admin.message,
		showProc: state.admin.showProc
	}),
	dispatchToProps: (dispatch) => ({
		fetchAdminInfo: () => dispatch(adminActionCreators.fetchAdminInfo()),
		fetchUserFieldData: () => dispatch(adminActionCreators.fetchUserFieldData()),
		onChange: (which, value) => dispatch(adminActionCreators.changePropsInAdmin(which, value)),
		onLogin: (loginUrl, formData, failLogin) => dispatch(adminActionCreators.login(loginUrl, formData, failLogin)),
		hideMessage: () => dispatch(adminActionCreators.hideMessage())
	})
};
const AdminContainer = connect(mapOfAdmin.stateToProps, mapOfAdmin.dispatchToProps)(Admin);

const mapOfUserList = {
	stateToProps: (state) => ({
		userFieldData: state.userlist.userFieldData,
		list: state.userlist.list,
		originalList: state.userlist.originalList,
		lastPage: state.userlist.lastPage,
		selected: state.userlist.selected
	}),
	dispatchToProps: (dispatch) => ({
		fetchUserList: (page) => dispatch(adminActionCreators.fetchUserList(page)),
		onChange: (which, value) => dispatch(adminActionCreators.changePropsInUsers(which, value))
	})
};
const UserListContainer = connect(mapOfUserList.stateToProps, mapOfUserList.dispatchToProps)(UserList);

/*
const mapOfUserContainer = {
	stateToProps: (state) => ({
		originalData: state.user.originalData,
		data: sate.user.data
	}),
	dispatchToProps: (dispatch) => ({
	})
};
*/

const mapOfAgreement = {
	stateToProps: (state) => ({
		agreement: state.agreement
	}),
	dispatchToProps: (dispatch) => ({
		fetchAgreement: () => dispatch(adminActionCreators.fetchAgreement())
	})
};
const AgreementContainer = connect(mapOfAgreement.stateToProps, mapOfAgreement.dispatchToProps)(Agreement);

render(
	<Provider store={adminStore}>
		<Router history={browserHistory}>
			<Route path="/admin" component={AdminContainer}>
				<IndexRoute component={UserListContainer} />
				<Route path="userlist(/page/:page)" component={UserListContainer} />
				<Route path="user/:id" component={User}>
					<Route path="edit" component={EditUser} />
				</Route>
				<Route path="user/new" component={NewUser} />
				<Route path="agreement" component={AgreementContainer} />
			</Route>
		</Router>
	</Provider>,
	document.getElementById('root')
);
