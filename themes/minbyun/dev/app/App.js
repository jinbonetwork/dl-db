import React, {Component} from 'react';
import {render} from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';
import {createHistory} from 'history';

import DigitalLibraryContainer from './DigitalLibraryContainer';
import DigitalLibrary from './DigitalLibrary';
import Login from './Login';
import User from './User';
import NewDocument from './NewDocument';
import EditDocument from './EditDocument';
import Document from './Document';
import SearchResult from './SearchResult';

import './style/style.less';
import './style/login.less';
import './style/digitalLibrary.less';
import './style/documentForm.less';
import './style/document.less';
import './style/searchResult.less';
import './style/searchBar.less';
import './style/accessories.less';

render((
	<Router history={browserHistory}>
		<Route component={DigitalLibraryContainer}>
			<Route path="/" component={DigitalLibrary}>
				<Route path="/login" component={Login} />
				<Route path="/user" component={User} />
				<Route path="/document/new" component={NewDocument} />
				<Route path="/document/:did" component={Document} />
				<Route path="/document/:did/edit" component={EditDocument} />
				<Route path="/search**" component={SearchResult} />
			</Route>
		</Route>
	</Router>
), document.getElementById('root'));
