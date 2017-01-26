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
import './style/agreement.less';

const AdminContainer = connect(
	(state) => ({
		isAdmin: state.admin.isAdmin,
		didReceiveUserFieldData: state.admin.didReceiveUserFieldData,
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
		userFieldData: state.admin.userFieldData,
		openUsers: state.admin.openUsers,
		userList: state.admin.userList,
		originalUsers: state.userList.originalUsers,
		lastPage: state.userList.lastPage,
		selected: state.userList.selected
	}),
	(dispatch) => ({
		fetchUserList: (page) => dispatch(adminActionCreators.fetchUserList(page)),
		onChange: (which, value) => dispatch(adminActionCreators.changePropsInUsers(which, value)),
		addUserToOpenUsers: (user) => dispatch(adminActionCreators.addUserToOpenUsers(user))
	})
)(UserList);

const UserContainer = connect(
	(state) => ({
		userFieldData: state.admin.userFieldData,
		openUsers: state.admin.openUsers
	}),
	(dispatch) => ({
		fetchUser: (id) => dispatch(adminActionCreators.fetchUser(id))
	})
)(User);

const UserFormContainer = connect(
	(state) => ({
		userFieldData: state.admin.userFieldData,
		openUsers: state.admin.openUsers,
		user: state.userForm.user,
		focused: state.userForm.focused
	}),
	(dispatch) => ({
		fetchUser: (id, callback) => dispatch(adminActionCreators.fetchUser(id, callback)),
		onChange: (args) => dispatch(adminActionCreators.changeUserProps(args)),
		setFocus: (fSlug, index) => dispatch(adminActionCreators.setFocus(fSlug, index)),
		onBlur: () => dispatch(adminActionCreators.blurUserForm()),
		showMessage: (message, callback) => dispatch(adminActionCreators.showMessage(message, callback)),
		submit: (id, userFormData, callback) => dispatch(adminActionCreators.submitUserForm(id, userFormData, callback))
	})
)(UserForm);

const AgreementContainer = connect(
	(state) => ({
		editorState: state.agreement.editorState
	}),
	(dispatch) => ({
		fetchAgreement: () => dispatch(adminActionCreators.fetchAgreement()),
		onChange: (editorState) => dispatch(adminActionCreators.changeAgreement(editorState))
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
