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
import UserForm from './components/UserForm';
import Agreement from './components/Agreement';
import './style/admin.less';
import './style/login.less';
import './style/mainMenu.less';
import './style/userlist.less';
import './style/accessories.less';
import './style/user.less';
import './style/userForm.less';

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
		lastPage: state.userList.lastPage,
		selected: state.userList.selected
	}),
	(dispatch) => ({
		fetchUserList: (page) => dispatch(adminActionCreators.fetchUserList(page)),
		onChange: (which, value) => dispatch(adminActionCreators.changePropsInUsers(which, value)),
		getUserFromList: (id) => dispatch(adminActionCreators.getUserFromList(id))
	})
)(UserList);

const UserContainer = connect(
	(state) => ({
		userFieldData: state.user.userFieldData,
		originalUserList: state.user.originalUserList,
		user: state.user.user
	}),
	(dispatch) => ({
		fetchUser: (id, list) => dispatch(adminActionCreators.fetchUser(id, list))
	})
)(User);

const UserFormContainer = connect(
	(state) => ({
		user: state.userForm.user,
		userFieldData: state.userForm.userFieldData,
		originalUserList: state.userForm.originalUserList,
		focused: state.userForm.focused,
		formData: state.userForm.formData
	}),
	(dispatch) => ({
		fetchUser: (id, list) => dispatch(adminActionCreators.fetchUser(id, list)),
		onChange: (args) => dispatch(adminActionCreators.changeUserProps(args)),
		setFocus: (fSlug, index) => dispatch(adminActionCreators.setFocus(fSlug, index)),
		onBlur: () => dispatch(adminActionCreators.blurUserForm()),
		showMessage: (message, callback) => dispatch(adminActionCreators.showMessage(message, callback)),
		submit: (id, userFormData, callback) => dispatch(adminActionCreators.submitUserForm(id, userFormData, callback))
	})
)(UserForm);

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
				<Route path="user/new" component={UserFormContainer} />
				<Route path="user/:id" component={UserContainer} />
				<Route path="user/:id/edit" component={UserFormContainer} />
				<Route path="agreement" component={AgreementContainer} />
			</Route>
		</Router>
	</Provider>,
	document.getElementById('root')
);
