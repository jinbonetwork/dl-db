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
import SearchResult from './components/SearchResult';
import Bookmarks from './components/Bookmarks';
import History from './components/History';
import UserProfile from './components/UserProfile';
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
		showMessage: (message, callback) => dispatch(dlDbActions.showMessage(message, callback)),
		hideMessage: () => dispatch(dlDbActions.hideMessage()),
		onResize: (size) => dispatch(dlDbActions.resize(size)),
		onChangeLogin: (which, value) => dispatch(dlDbActions.changeLogin(which, value)),
		onLogin: (loginUrl, formData, failLogin) => dispatch(dlDbActions.login(loginUrl, formData, failLogin)),
		fetchAgreement: () => dispatch(dlDbActions.fetchAgreement()),
		onAgree: () => dispatch(dlDbActions.agreeWithAgreement()),
		onLogOut: (args) => dispatch(dlDbActions.logout(args)),
		onChangeQuery: (value) => dispatch(dlDbActions.changeSearchBarState(value)),
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
		fetchUserDocs: (page) => dispatch(dlDbActions.fetchUserDocs(page)),
		addDocToOpenDocs: (doc) => dispatch(dlDbActions.addDocToOpenDocs(doc)),
		showMessage: (message, callback) => dispatch(dlDbActions.showMessage(message, callback))
	})
)(UserDocuments);

const SearchResultContainer = connect(
	(state) => ({
		role: state.dlDb.role,
		fData: state.dlDb.docFieldData,
		result: state.dlDb.searchResult,
		distribution: state.searchResult.distribution,
		lastPage: state.searchResult.lastPage
	}),
	(dispatch) => ({
		changeQuery: (value) => dispatch(dlDbActions.changeSearchBarState(value)),
		searchDocs: (params) => dispatch(dlDbActions.searchDocs(params)),
		showMessage: (message, callback) => dispatch(dlDbActions.showMessage(message, callback))
	})
)(SearchResult);

const BookmarksContainer = connect(
	(state) => ({
		fData: state.dlDb.docFieldData,
		bookmarks: state.dlDb.bookmarks,
		openDocs: state.dlDb.openDocs,
		lastPage: state.bookmarks.lastPage
	}),
	(dispatch) => ({
		fetchBookmarks: (page) => dispatch(dlDbActions.fetchBookmarks(page)),
		removeBookmark: (args) => dispatch(dlDbActions.removeBookmark(args))
	})
)(Bookmarks);

const HistoryContainer = connect(
	(state) => ({
		history: state.dlDb.history,
		fData: state.dlDb.docFieldData,
		lastPage: state.history.lastPage,
	}),
	(dispatch) => ({
		fetchHistory: (page) => dispatch(dlDbActions.fetchHistory(page))
	})
)(History);

const UserProfileContainer = connect(
	(state) => ({
		window: state.dlDb.window,
		fData: state.userProfile.fData,
		openProfile: state.userProfile.openProfile,
		profile: state.userProfile.profile,
		focused: state.userProfile.focused,
		isSaving: state.userProfile.isSaving,
		isPwShown: state.userProfile.isPwShown
	}),
	(dispatch) => ({
		fetchUserProfile: () => dispatch(dlDbActions.fetchUserProfile()),
		onChange: (args) => dispatch(dlDbActions.changeUserProfile(args)),
		onBlur: () => dispatch(dlDbActions.focusOutUserProfile()),
		focusIn: (args) => dispatch(dlDbActions.focusInUserProfile(args)),
		showMessage: (message, callback) => dispatch(dlDbActions.showMessage(message, callback)),
		onSubmit: (args) => dispatch(dlDbActions.submitUserProfile(args)),
		togglePassWordForm: () => dispatch(dlDbActions.togglePassWordForm())
	})
)(UserProfile);

render(
	<Provider store={dlDbStore}>
		<Router history={browserHistory}>
			<Route path="/" component={DlDbContainer}>
				<Route path="document/new" component={DocFormContainer} />
				<Route path="document/:id/edit" component={DocFormContainer} />
				<Route path="document/:id" component={DocContainer} />
				<Route path="document/:docId/text/:fileId" component={FileTextContainer} />
				<Route path="user" component={User}>
					<Route path="profile" component={UserProfileContainer} />
					<Route path="bookmarks(/page/:page)" component={BookmarksContainer} />
					<Route path="history(/page/:page)" component={HistoryContainer} />
					<Route path="documents(/page/:page)" component={UserDocsContainer} />
				</Route>
				<Route path="/search**" component={SearchResultContainer} />
			</Route>
		</Router>
	</Provider>,
	document.getElementById('root')
);
