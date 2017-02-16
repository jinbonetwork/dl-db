import React, {Component} from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRedirect, browserHistory} from 'react-router';
import {createHistory} from 'history';
import {Provider, connect} from 'react-redux';
import dlDbStore from './store/dlDbStore';
import dlDbActions from './actions/dlDbActions';
import DlDb from './components/DlDb';
import DocumentForm from './components/DocumentForm';
import Document from './components/Document';
import FileText from './components/FileText';
import User from './components/User';
import UserDocuments from './components/UserDocuments';
import './style/index.less';

const DlDbContainer = connect(
	(state) => ({
		role: state.dlDb.role,
		menuData: state.dlDb.menuData,
		message: state.dlDb.message,
		showProc: state.dlDb.showProc,
		docFieldData: state.dlDb.docFieldData,
		window: state.dlDb.window,
		login: state.dlDb.login,
		searchBar: state.dlDb.searchBar
	}),
	(dispatch) => ({
		fetchRootData: () => dispatch(dlDbActions.fetchRootData()),
		hideMessage: () => dispatch(dlDbActions.hideMessage()),
		onResize: (size) => dispatch(dlDbActions.resize(size)),
		onChangeLogin: (which, value) => dispatch(dlDbActions.changeLogin(which, value)),
		onLogin: (loginUrl, formData, failLogin) => dispatch(dlDbActions.login(loginUrl, formData, failLogin)),
		fetchAgreement: () => dispatch(dlDbActions.fetchAgreement()),
		onAgree: () => dispatch(dlDbActions.agreeWithAgreement()),
		onLogOut: (args) => dispatch(dlDbActions.logout(args)),
		onChangeQeury: (value) => dispatch(dlDbActions.changeSearchBarState(value)),
		changeSearchBarState: (value) => dispatch(dlDbActions.changeSearchBarState(value))
	})
)(DlDb);

const DocFormContainer = connect(
	(state) => ({
		role: state.dlDb.role,
		fData: state.dlDb.docFieldData,
		openDocs: state.dlDb.openDocs,
		window: state.dlDb.window,
		doc: state.documentForm.doc,
		focused: state.documentForm.focused,
		isSaving: state.documentForm.isSaving,
		parseState: state.documentForm.parseState
	}),
	(dispatch) => ({
		onChange: (args) => dispatch(dlDbActions.changeDocForm(args)),
		onBlur: () => dispatch(dlDbActions.focusOutDocForm()),
		showMessage: (message, callback) => dispatch(dlDbActions.showMessage(message, callback)),
		focusIn: (slug, index) => dispatch(dlDbActions.focusInDocForm(slug, index)),
		fetchDoc: (id, callback) => dispatch(dlDbActions.fetchDoc(id, callback)),
		onSubmit: (args, callback) => dispatch(dlDbActions.submitDocForm(args, callback)),
		setParseState: (args) => dispatch(dlDbActions.setParseState(args)),
		fetchParseState: (args) => dispatch(dlDbActions.fetchParseState(args)),
		renewFileStatus: (args) => dispatch(dlDbActions.renewFileStatus(args)),
		onSearchMember: (args) => dispatch(dlDbActions.searchMember(args))
	})
)(DocumentForm);

const DocContainer = connect(
	(state) => ({
		role: state.dlDb.role,
		fData: state.dlDb.docFieldData,
		openDocs: state.dlDb.openDocs,
		window: state.dlDb.window,
		dispBtnOfYesOrNo: state.document.dispBtnOfYesOrNo,
		parseState: state.document.parseState
	}),
	(dispatch) => ({
		fetchDoc: (id, callback) => dispatch(dlDbActions.fetchDoc(id, callback)),
		showMessage: (message, callback) => dispatch(dlDbActions.showMessage(message, callback)),
		setParseState: (args) => dispatch(dlDbActions.setParseState(args)),
		fetchParseState: (args) => dispatch(dlDbActions.fetchParseState(args)),
		renewFileStatus: (args) => dispatch(dlDbActions.renewFileStatus(args)),
		bookmark: (args) => dispatch(dlDbActions.bookmark(args)),
		toggleDelDocButton: (args) => dispatch(dlDbActions.toggleDelDocButton(args)),
		delelteDoc: (args) => dispatch(dlDbActions.delelteDoc(args))
	})
)(Document);

const FileTextContainer = connect(
	(state) => ({
		role: state.dlDb.role,
		fData: state.dlDb.docFieldData,
		openDocs: state.dlDb.openDocs,
		openFileTexts: state.dlDb.openFileTexts,
		fileText: state.fileText.fileText,
		isSaving: state.fileText.isSaving
	}),
	(dispatch) => ({
		fetchDoc: (id, callback) => dispatch(dlDbActions.fetchDoc(id, callback)),
		fetchFileText: (docId, fileId, callback) => dispatch(dlDbActions.fetchFileText(docId, fileId, callback)),
		onChange: (fileText) => dispatch(dlDbActions.changeFileText(fileText)),
		onSubmit: (args) => dispatch(dlDbActions.submitFileText(args)),
		toggleParsed: (args) => dispatch(dlDbActions.toggleParsedOfFile(args)),
		showMessage: (message, callback) => dispatch(dlDbActions.showMessage(message, callback))
	})
)(FileText);

const UserDocsContainer = connect(
	(state) => ({
		role: state.dlDb.role,
		fData: state.dlDb.docFieldData,
		documents: state.dlDb.documents,
		lastPage: state.userDocuments.lastPage
	}),
	(dispatch) => ({
		fetchUserDocs: (page) => dispatch(dlDbActions.fetchUserDocs(page))
	})
)(UserDocuments);

render(
	<Provider store={dlDbStore}>
		<Router history={browserHistory}>
			<Route path="/" component={DlDbContainer}>
				<Route path="document/new" component={DocFormContainer} />
				<Route path="document/:id/edit" component={DocFormContainer} />
				<Route path="document/:id" component={DocContainer} />
				<Route path="document/:docId/text/:fileId" component={FileTextContainer} />
				<Route path="user" component={User}>
					<Route path="documents(/page/:page)" component={UserDocsContainer} />
				</Route>
			</Route>
		</Router>
	</Provider>,
	document.getElementById('root')
);

/*
render((
	<Router history={browserHistory}>
		<Route component={DigitalLibraryContainer}>
			<Route path="/" component={DigitalLibrary}>
				<Route path="/login" component={Login} />
				<Route path="/user" component={User}>
					<IndexRedirect to="/user/profile" />
					<Route path="profile" component={UserProfile} />
					<Route path="bookmarks(/page/:page)" component={Bookmarks} />
					<Route path="history(/page/:page)" component={History} />
					<Route path="documents(/page/:page)" component={UserDocuments} />
				</Route>
				<Route path="/document/new" component={NewDocument} />
				<Route path="/document/:did" component={Document}>
					<Route path="text/:fid" component={FileTextEditor} />
				</Route>
				<Route path="/document/:did/edit" component={EditDocument} />
				<Route path="/search**" component={SearchResult} />
			</Route>
		</Route>
	</Router>
), document.getElementById('root'));
*/
