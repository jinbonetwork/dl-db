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
import UserRegist from './components/UserRegist';

import './style/index.less';

const DlDbContainer = connect(
	(state) => ({
		role: state.dlDb.role,
		menuData: state.dlDb.menuData,
		message: state.dlDb.message,
		showProc: state.dlDb.showProc,
		showOverlay: state.dlDb.showOverlay,
		docFieldData: state.dlDb.docFieldData,
		window: state.dlDb.window,
		login: state.dlDb.login,
		searchBar: state.dlDb.searchBar
	}),
	(dispatch) => ({
		fetchRootData: () => dispatch(dlDbActions.fetchRootData()),
		showMessage: (args) => dispatch(dlDbActions.showMessage(args)),
		hideMessage: () => dispatch(dlDbActions.hideMessage()),
		onResize: (size) => dispatch(dlDbActions.resize(size)),
		onChangeLogin: (which, value) => dispatch(dlDbActions.changeLogin(which, value)),
		onLogin: (loginUrl, formData, failLogin) => dispatch(dlDbActions.login(loginUrl, formData, failLogin)),
		findPassword: (formData) => dispatch(dlDbActions.findPassword(formData)),
		fetchAgreement: () => dispatch(dlDbActions.fetchAgreement()),
		onAgree: (afterAgree) => dispatch(dlDbActions.agreeWithAgreement(afterAgree)),
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
		parseState: state.documentForm.parseState,
		courts: state.documentForm.courts,
		userProfile: state.userProfile.openProfile,
	}),
	(dispatch) => ({
		initialize: () => dispatch(dlDbActions.initializeDocForm()),
		onChange: (args) => dispatch(dlDbActions.changeDocForm(args)),
		onBlur: () => dispatch(dlDbActions.focusOutDocForm()),
		showMessage: (args) => dispatch(dlDbActions.showMessage(args)),
		focusIn: (slug, index) => dispatch(dlDbActions.focusInDocForm(slug, index)),
		fetchDoc: (id, callback) => dispatch(dlDbActions.fetchDoc(id, callback)),
		onSubmit: (args, callback) => dispatch(dlDbActions.submitDocForm(args, callback)),
		setParseState: (args) => dispatch(dlDbActions.setParseState(args)),
		initParseState: () => dispatch(dlDbActions.setParseState()),
		fetchParseState: (args) => dispatch(dlDbActions.fetchParseState(args)),
		renewFileStatus: (args) => dispatch(dlDbActions.renewFileStatus(args)),
		onSearchMember: (args) => dispatch(dlDbActions.searchMember(args)),
		fetchCourts: () => dispatch(dlDbActions.fetchCourts()),
		fetchUserProfile: () => dispatch(dlDbActions.fetchUserProfile())
	})
)(DocumentForm);

const DocContainer = connect(
	(state) => ({
		role: state.dlDb.role,
		fData: state.dlDb.docFieldData,
		openDocs: state.dlDb.openDocs,
		window: state.dlDb.window,
		dispBtnOfYesOrNo: state.document.dispBtnOfYesOrNo,
		parseState: state.document.parseState,
		selectedImage: state.document.selectedImage,
		isReportFormVisible: state.document.isReportFormVisible,
		report: state.document.report
	}),
	(dispatch) => ({
		initialize: () => dispatch(dlDbActions.initializeDoc()),
		fetchDoc: (id, callback) => dispatch(dlDbActions.fetchDoc(id, callback)),
		showMessage: (args) => dispatch(dlDbActions.showMessage(args)),
		setParseState: (args) => dispatch(dlDbActions.setParseState(args)),
		fetchParseState: (args) => dispatch(dlDbActions.fetchParseState(args)),
		renewFileStatus: (args) => dispatch(dlDbActions.renewFileStatus(args)),
		bookmark: (args) => dispatch(dlDbActions.bookmark(args)),
		toggleDelDocButton: (args) => dispatch(dlDbActions.toggleDelDocButton(args)),
		delelteDoc: (args) => dispatch(dlDbActions.delelteDoc(args)),
		selectImage: (args) => dispatch(dlDbActions.selectImage(args)),
		toggleReportForm: () => dispatch(dlDbActions.toggleReportForm()),
		changeReport: (report) => dispatch(dlDbActions.changeReport(report)),
		sendReport: (args) => dispatch(dlDbActions.sendReport(args))
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
		showMessage: (args) => dispatch(dlDbActions.showMessage(args))
	})
)(FileText);

const UserDocsContainer = connect(
	(state) => ({
		role: state.dlDb.role,
		fData: state.dlDb.docFieldData,
		documents: state.dlDb.documents,
		window: state.dlDb.window,
		lastPage: state.userDocuments.lastPage
	}),
	(dispatch) => ({
		fetchUserDocs: (page) => dispatch(dlDbActions.fetchUserDocs(page)),
		addDocToOpenDocs: (doc) => dispatch(dlDbActions.addDocToOpenDocs(doc)),
		showMessage: (args) => dispatch(dlDbActions.showMessage(args))
	})
)(UserDocuments);

const SearchResultContainer = connect(
	(state) => ({
		role: state.dlDb.role,
		fData: state.dlDb.docFieldData,
		result: state.dlDb.searchResult,
		window: state.dlDb.window,
		distribution: state.searchResult.distribution,
		lastPage: state.searchResult.lastPage
	}),
	(dispatch) => ({
		changeQuery: (value) => dispatch(dlDbActions.changeSearchBarState(value)),
		searchDocs: (params) => dispatch(dlDbActions.searchDocs(params)),
		showMessage: (args) => dispatch(dlDbActions.showMessage(args))
	})
)(SearchResult);

const BookmarksContainer = connect(
	(state) => ({
		fData: state.dlDb.docFieldData,
		bookmarks: state.dlDb.bookmarks,
		openDocs: state.dlDb.openDocs,
		window: state.dlDb.window,
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
		window: state.dlDb.window,
		lastPage: state.history.lastPage
	}),
	(dispatch) => ({
		fetchHistory: (page) => dispatch(dlDbActions.fetchHistory(page)),
		removeHistory: (args) => dispatch(dlDbActions.removeHistory(args))
	})
)(History);

const UserRegistContainer = connect(
	(state) => ({
		window: state.dlDb.window,
		role: state.dlDb.role,
		fData: state.userRegist.fData,
		profile: state.userRegist.profile,
		focused: state.userRegist.focused,
		isDuplicate: state.userRegist.isDuplicate,
		isSaving: state.userRegist.isSaving,
		isComplete: state.userRegist.isComplete
	}),
	(dispatch) => ({
		initialize: () => dispatch(dlDbActions.initializeUserRegist()),
		fetchForm: () => dispatch(dlDbActions.fetchUserRegistForm()),
		onChange: (args) => dispatch(dlDbActions.changeUserRegist(args)),
		onBlur: () => dispatch(dlDbActions.focusOutUserRegist()),
		focusIn: (args) => dispatch(dlDbActions.focusInUserRegist(args)),
		showMessage: (args) => dispatch(dlDbActions.showMessage(args)),
		onSubmit: (args) => dispatch(dlDbActions.submitUserRegist(args))
	})
)(UserRegist);

const UserProfileContainer = connect(
	(state) => ({
		window: state.dlDb.window,
		role: state.dlDb.role,
		fData: state.userProfile.fData,
		openProfile: state.userProfile.openProfile,
		profile: state.userProfile.profile,
		focused: state.userProfile.focused,
		isSaving: state.userProfile.isSaving,
		isPwShown: state.userProfile.isPwShown
	}),
	(dispatch) => ({
		initialize: () => dispatch(dlDbActions.initializeUserProfile()),
		fetchUserProfile: () => dispatch(dlDbActions.fetchUserProfile()),
		onChange: (args) => dispatch(dlDbActions.changeUserProfile(args)),
		onBlur: () => dispatch(dlDbActions.focusOutUserProfile()),
		focusIn: (args) => dispatch(dlDbActions.focusInUserProfile(args)),
		showMessage: (args) => dispatch(dlDbActions.showMessage(args)),
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
				<Route path="regist" component={UserRegistContainer} />
				<Route path="/search**" component={SearchResultContainer} />
			</Route>
		</Router>
	</Provider>,
	document.getElementById('root')
);
