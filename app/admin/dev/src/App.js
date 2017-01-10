import React, {Component} from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import {createHistory} from 'history';
import {Provider, connect} from 'react-redux';
import adminStore from './store/adminStore';
import adminActionCreators from './actions/adminActionCreators';
import Admin from './components/Admin';
import Users from './components/Users';
import Agreement from './components/Agreement';

const mapOfUsers = {
	stateToProps: (state) => ({
		fieldData: state.users.fieldData,
		list: state.users.list
	}),
	dispatchToProps: (dispatch) => ({
		fetchUserFieldData: () => dispatch(adminActionCreators.fetchUserFieldData()),
		fetchUserList: () => dispatch(adminActionCreators.fetchUserList())
	})
}
const UsersContainer = connect(mapOfUsers.stateToProps, mapOfUsers.dispatchToProps)(Users);

const mapOfAgreement = {
	stateToProps: (state) => ({
		agreement: state.agreement
	}),
	dispatchToProps: (dispatch) => ({
		fetchAgreement: () => dispatch(adminActionCreators.fetchAgreement())
	})
}
const AgreementContainer = connect(mapOfAgreement.stateToProps, mapOfAgreement.dispatchToProps)(Agreement);

render(
	<Provider store={adminStore}>
		<Router history={browserHistory}>
			<Route path="/admin" component={Admin}>
				<IndexRoute component={UsersContainer} />
				<Route path="users" component={UsersContainer} />
				<Route path="agreement" component={AgreementContainer} />
			</Route>
		</Router>
	</Provider>,
	document.getElementById('root')
);
