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
import FileText from './components/FileText';
import Stats from './components/Stats';
import NotFound from './components/NotFound';
import './style/index.less';

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
		hideMessage: () => dispatch(adminActionCreators.hideMessage()),
		onLogOut: (args) => dispatch(adminActionCreators.logout(args))
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
		fetchUserList: (params, options) => dispatch(adminActionCreators.fetchUserList(params, options)),
		onChange: (which, value) => dispatch(adminActionCreators.changePropsInUserList(which, value)),
		addUserToOpenUsers: (user) => dispatch(adminActionCreators.addUserToOpenUsers(user)),
		delete: (ids, formData, callback) => dispatch(adminActionCreators.deleteUsers(ids, formData, callback))
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
		onChange: (which, value) => dispatch(adminActionCreators.changePropsInUser(which, value)),
		delete: (id, formData, callback) => dispatch(adminActionCreators.deleteUsers(id, formData, callback))
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
		showMessage: (args) => dispatch(adminActionCreators.showMessage(args)),
		submit: (user, formData, oldUser, callback) => dispatch(adminActionCreators.submitUserForm(user, formData, oldUser, callback)),
		showPassword: (state) => dispatch(adminActionCreators.showPassword(state))
	})
)(UserForm);

const AttachmentsContainer = connect(
	(state) => ({
		fData: state.admin.docFieldData,
		attachments: state.admin.attachments,
		openFileTexts: state.admin.openFileTexts,
		lastPage: state.attachments.lastPage,
		fieldSearching: state.attachments.fieldSearching,
		keywordSearching: state.attachments.keywordSearching,
		parseState: state.attachments.parseState
	}),
	(dispatch) => ({
		fetchAttachments: (page) => dispatch(adminActionCreators.fetchAttachments(page)),
		onChange: (which, value) => dispatch(adminActionCreators.changePropsInAttachments(which, value)),
		toggleParsed: ({idxOfFiles, fileId, status}) => dispatch(adminActionCreators.toggleParsed(idxOfFiles, fileId, status)),
		toggleAnonymity: ({idxOfFiles, fileId, status}) => dispatch(adminActionCreators.toggleAnonymity(idxOfFiles, fileId, status)),
		addFileToOpenFileTexts: (fileId, file) => dispatch(adminActionCreators.addFileToOpenFileTexts(fileId, file)),
		onUpload: (args) => dispatch(adminActionCreators.upload(args)),
		fetchParseState: (args) => dispatch(adminActionCreators.fetchParseState(args)),
		renewAttachState: (args) => dispatch(adminActionCreators.renewAttachState(args)),
		setParseState: (args) => dispatch(adminActionCreators.setParseState(args)),
		showMessage: (args) => dispatch(adminActionCreators.showMessage(args)),
		hideMessage: () => dispatch(adminActionCreators.hideMessage())
	})
)(Attachments);

const FileTextContainer = connect(
	(state) => ({
		openFileTexts: state.admin.openFileTexts,
		fileText: state.fileText.fileText,
		isSaving: state.fileText.isSaving
	}),
	(dispatch) => ({
		fetchFileText: (which, docId, fileId, callback) => dispatch(adminActionCreators.fetchFileText(which, docId, fileId, callback)),
		onChange: (fileText) => dispatch(adminActionCreators.changeFileText(fileText)),
		onSubmit: (docId, fileId, text, formData, oldText) => dispatch(adminActionCreators.submitFileText(docId, fileId, text, formData, oldText)),
		toggleParsed: (fileId, status) => dispatch(adminActionCreators.toggleParsedOfFile(fileId, status)),
	})
)(FileText);

const AgreementContainer = connect(
	(state) => ({
		openAgreement: state.admin.openAgreement,
		agreement: state.agreement.agreement,
		isSaving: state.agreement.isSaving
	}),
	(dispatch) => ({
		fetchAgreement: (callback) => dispatch(adminActionCreators.fetchAgreement(callback)),
		onChange: (agreement) => dispatch(adminActionCreators.changeAgreement(agreement)),
		onSubmit: (agreement, formData, oldAgreement) => dispatch(adminActionCreators.submitAgreement(agreement, formData, oldAgreement))
	})
)(Agreement);

const StatsContainer = connect(
	(state) => ({
		numDocList: state.stats.numDocList,
		lastPage: state.stats.lastPage
	}),
	(dispatch) => ({
		fetchStats: (args) => dispatch(adminActionCreators.fetchStats(args))
	})
)(Stats);

render(
	<Provider store={adminStore}>
		<Router history={browserHistory}>
			<Route path="/admin" component={AdminContainer}>
				<IndexRoute component={UserListContainer} />
				<Route path="userlist(/:param1/:param2)(/:param3/:param4)" component={UserListContainer} />
				<Route path="user/new" component={UserFormContainer} />
				<Route path="user/:id" component={UserContainer} />
				<Route path="user/:id/edit" component={UserFormContainer} />
				<Route path="attachments(/:param1/:param2)(/:param3/:param4)" component={AttachmentsContainer} />
				<Route path="filetext/:docId/:fileId" component={FileTextContainer} />
				<Route path="agreement" component={AgreementContainer} />
				<Route path="stats(/page/:page)" component={StatsContainer} />
				<Route path="*" component={NotFound} />
			</Route>
		</Router>
	</Provider>,
	document.getElementById('root')
);
