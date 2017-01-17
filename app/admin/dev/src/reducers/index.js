import {combineReducers} from 'redux';
import admin from './admin';
import users from './users';
import agreement from './agreement';

const rootReducer = combineReducers({
	admin: admin,
	users: users,
	agreement:agreement
});

export default rootReducer;
