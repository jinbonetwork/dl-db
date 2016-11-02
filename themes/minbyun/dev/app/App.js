import React, {Component} from 'react';
import {render} from 'react-dom';
import {Router, Route, Link, IndexRoute, browserHistory, useRouterHistory} from 'react-router';
import {createHistory} from 'history';

import DigitalLibraryContainer from './DigitalLibraryContainer';
import DigitalLibrary from './DigitalLibrary';
import User from './User';
import NewDocument from './NewDocument';
import ServerError from './ServerError';

import './style/common.less';

/*
const history = useRouterHistory(createHistory)({
	basename: '/'
});
*/

render((
	<Router history={browserHistory}>
		<Route component={DigitalLibraryContainer}>
			<Route path="/" component={DigitalLibrary}>
				<Route path="/user" component={User} />
				<Route path="/document/new" component={NewDocument} />
				<Route path="/error" component={ServerError} />
			</Route>
		</Route>
	</Router>
), document.getElementById('root'));
