import {combineReducers} from 'redux';
import admin from './admin';
import users from './users';
import agreement from './agreement'

const rootReducer = combineReducers({
	admin,
	users,
	agreement
});

export default rootReducer;
