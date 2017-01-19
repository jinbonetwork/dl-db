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
import UserForm from './components/UserFrom';
import Agreement from './components/Agreement';
import './style/admin.less';
import './style/login.less';
import './style/mainMenu.less';
import './style/userlist.less';
import './style/accessories.less';
import './style/user.less';

const AdminContainer = connect(
	(state) => ({
		isAdmin: state.admin.isAdmin,
		loginType: state.admin.loginType,
		id: state.admin.id,
		password: state.admin.password,
		message: state.admin.message,
		showProc: state.admin.showProc
	}),
	(dispatch) => ({
		fetchAdminInfo: () => dispatch(adminActionCreators.fetchAdminInfo()),
		onChange: (which, value) => dispatch(adminActionCreators.changePropsInAdmin(which, value)),
		onLogin: (loginUrl, formData, failLogin) => dispatch(adminActionCreators.login(loginUrl, formData, failLogin)),
		hideMessage: () => dispatch(adminActionCreators.hideMessage())
	})
)(Admin);

const UserListContainer = connect(
	(state) => ({
		userFieldData: state.userList.userFieldData,
		list: state.userList.list,
		originalList: state.userList.originalList,
		lastPage: state.userList.lastPage,
		selected: state.userList.selected
	}),
	(dispatch) => ({
		fetchUserList: (page) => dispatch(adminActionCreators.fetchUserList(page)),
		onChange: (which, value) => dispatch(adminActionCreators.changePropsInUsers(which, value))
	})
)(UserList);

const UserContainer = connect(
	(state) => ({
		userFieldData: state.user.userFieldData,
		originalUserList: state.user.originalUserList,
		originalUser: state.user.originalUser,
		user: state.user.user
	}),
	(dispatch) => ({
		fetchUser: (id, list) => dispatch(adminActionCreators.fetchUser(id, list))
	})
)(User);

const UserFormContainer = connect(
	(state) => ({
		userFieldData: state.userForm.userFieldData,
		originalUserList: state.userForm.originalUserList,
		originalUser: state.userForm.originalUser,
		user: state.userForm.user
	}),
	(dispatch) => ({
		fetchUser: (id, list) => dispatch(adminActionCreators.fetchUser(id, list))
	})
)(UserForm)

const AgreementContainer = connect(
	(state) => ({
		agreement: state.agreement
	}),
	(dispatch) => ({
		fetchAgreement: () => dispatch(adminActionCreators.fetchAgreement())
	})
)(Agreement);

render(
	<Provider store={adminStore}>
		<Router history={browserHistory}>
			<Route path="/admin" component={AdminContainer}>
				<IndexRoute component={UserListContainer} />
				<Route path="userlist(/page/:page)" component={UserListContainer} />
				<Route path="user/:id" component={UserContainer}>
					<Route path="edit" component={UserFormContainer} />
				</Route>
				<Route path="user/new" component={UserFormContainer} />
				<Route path="agreement" component={AgreementContainer} />
			</Route>
		</Router>
	</Provider>,
	document.getElementById('root')
);
