import React, {Component} from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRedirect, browserHistory} from 'react-router';
import {createHistory} from 'history';

import DigitalLibraryContainer from './DigitalLibraryContainer';
import DigitalLibrary from './DigitalLibrary';
import Login from './Login';
import User from './User';
import UserProfile from './user/UserProfile';
import Bookmarks from './user/Bookmarks';
import History from './user/History';
import UserDocuments from './user/UserDocuments';
import NewDocument from './NewDocument';
import EditDocument from './EditDocument';
import FileTextEditor from './FileTextEditor';
import Document from './Document';
import SearchResult from './SearchResult';

import './style/style.less';
import './style/login.less';
import './style/digitalLibrary.less';
import './style/documentForm.less';
import './style/document.less';
import './style/searchBar.less';
import './style/accessories.less';
import './style/user.less';
import './style/documentList.less';

render((
	<Router history={browserHistory}>
		<Route component={DigitalLibraryContainer}>
			<Route path="/" component={DigitalLibrary}>
				<Route path="/login" component={Login} />
				<Route path="/user" component={User}>
					<IndexRedirect to="/user/profile" />
					<Route path="profile" component={UserProfile} />
					<Route path="bookmarks" component={Bookmarks} />
					<Route path="history" component={History} />
					<Route path="documents" component={UserDocuments}>
						<IndexRedirect to="/user/documents/page/1" />
						<Route path="page/:page" component={UserDocuments} />
					</Route>
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
