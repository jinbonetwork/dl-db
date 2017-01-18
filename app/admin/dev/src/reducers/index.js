import {combineReducers} from 'redux';
import admin from './admin';
import userlist from './userlist';
import user from './user';
import agreement from './agreement';

const rootReducer = combineReducers({
	admin,
	userlist,
	user,
	agreement
});

export default rootReducer;
