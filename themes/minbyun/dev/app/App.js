import React, {Component} from 'react';
import {render} from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';
import {createHistory} from 'history';

import DigitalLibraryContainer from './DigitalLibraryContainer';
import DigitalLibrary from './DigitalLibrary';
import User from './User';
import NewDocument from './NewDocument';
import ServerError from './ServerError';

import TestSomething from './TestSomething';

render((
	<Router history={browserHistory}>
		<Route component={DigitalLibraryContainer}>
			<Route path="/" component={DigitalLibrary}>
				<Route path="/user" component={User} />
				<Route path="/document/new" component={NewDocument} />
				<Route path="/test" component={TestSomething} />
				<Route path="/error" component={ServerError} />
			</Route>
		</Route>
	</Router>
), document.getElementById('root'));
