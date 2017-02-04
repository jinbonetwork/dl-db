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
import Attachments from './components/Attachments';
import Agreement from './components/Agreement';
import NotFound from './components/NotFound';
import './style/admin.less';
import './style/login.less';
import './style/mainMenu.less';
import './style/userlist.less';
import './style/accessories.less';
import './style/user.less';
import './style/userForm.less';
import './style/agreement.less';
import './style/attachments.less';

const AdminContainer = connect(
	(state) => ({
		isAdmin: state.admin.isAdmin,
		userFieldData: state.admin.userFieldData,
		docFieldData: state.admin.docFieldData,
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
		selected: state.userList.selected,
		isDelBtnYesOrNo: state.userList.isDelBtnYesOrNo,
		fieldSearching: state.userList.fieldSearching,
		keywordSearching: state.userList.keywordSearching
	}),
	(dispatch) => ({
		fetchUserList: (params) => dispatch(adminActionCreators.fetchUserList(params)),
		onChange: (which, value) => dispatch(adminActionCreators.changePropsInUserList(which, value)),
		addUserToOpenUsers: (user) => dispatch(adminActionCreators.addUserToOpenUsers(user))
	})
)(UserList);

const UserContainer = connect(
	(state) => ({
		userFieldData: state.admin.userFieldData,
		openUsers: state.admin.openUsers,
		isDelBtnYesOrNo: state.user.isDelBtnYesOrNo
	}),
	(dispatch) => ({
		fetchUser: (id) => dispatch(adminActionCreators.fetchUser(id)),
		onChange: (which, value) => dispatch(adminActionCreators.changePropsInUser(which, value))
	})
)(User);

const UserFormContainer = connect(
	(state) => ({
		userFieldData: state.admin.userFieldData,
		openUsers: state.admin.openUsers,
		user: state.userForm.user,
		focused: state.userForm.focused,
		isSaving: state.userForm.isSaving,
		isPwShown: state.userForm.isPwShown
	}),
	(dispatch) => ({
		fetchUser: (id, callback) => dispatch(adminActionCreators.fetchUser(id, callback)),
		onChange: (args) => dispatch(adminActionCreators.changeUserProps(args)),
		setFocus: (fSlug, index) => dispatch(adminActionCreators.setFocus(fSlug, index)),
		onBlur: () => dispatch(adminActionCreators.blurUserForm()),
		showMessage: (message, callback) => dispatch(adminActionCreators.showMessage(message, callback)),
		submitForm: (user, formData) => dispatch(adminActionCreators.submitUserForm(user, formData)),
		submitNewForm: (user, formData, callback) => dispatch(adminActionCreators.submitNewUserForm(user, formData, callback)),
		showPassword: (state) => dispatch(adminActionCreators.showPassword(state))
	})
)(UserForm);

const AttachmentsContainer = connect(
	(state) => ({
		attachments: state.admin.attachments,
		lastPage: state.attachments.lastPage,
		selected: state.attachments.selected,
		isDelBtnYesOrNo: state.attachments.isDelBtnYesOrNo,
		sortedBy: state.attachments.sortedBy
	}),
	(dispatch) => ({
		fetchAttachments: (page) => dispatch(adminActionCreators.fetchAttachments(page)),
		onChange: (which, value) => dispatch(adminActionCreators.changePropsInAttachments(which, value)),
		toggleParsed: ({idxOfList, idxOfFiles, fileId, status}) => dispatch(adminActionCreators.toggleParsed(idxOfList, idxOfFiles, fileId, status)),
		toggleAnonymity: ({idxOfList, idxOfFiles, fileId, status}) => dispatch(adminActionCreators.toggleAnonymity(idxOfList, idxOfFiles, fileId, status))
	})
)(Attachments);

const AgreementContainer = connect(
	(state) => ({
		openAgreement: state.admin.openAgreement,
		agreement: state.agreement.agreement,
		isSaving: state.agreement.isSaving
	}),
	(dispatch) => ({
		fetchAgreement: (callback) => dispatch(adminActionCreators.fetchAgreement(callback)),
		onChange: (agreement) => dispatch(adminActionCreators.changeAgreement(agreement)),
		onSubmit: (agreement, formData) => dispatch(adminActionCreators.submitAgreement(agreement, formData))
	})
)(Agreement);

render(
	<Provider store={adminStore}>
		<Router history={browserHistory}>
			<Route path="/admin" component={AdminContainer}>
				<IndexRoute component={UserListContainer} />
				<Route path="userlist(/:param1/:param2)(/:param3/:param4)" component={UserListContainer} />
				<Route path="user/new" component={UserFormContainer} />
				<Route path="user/:id" component={UserContainer} />
				<Route path="user/:id/edit" component={UserFormContainer} />
				<Route path="attachments(/page/:page)" component={AttachmentsContainer} />
				<Route path="agreement" component={AgreementContainer} />
				<Route path="*" component={NotFound} />
			</Route>
		</Router>
	</Provider>,
	document.getElementById('root')
);
