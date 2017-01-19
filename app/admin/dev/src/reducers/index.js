import {combineReducers} from 'redux';
import admin from './admin';
import userList from './userList';
import user from './user';
import agreement from './agreement';

const rootReducer = combineReducers({
	admin,
	userList,
	user,
	agreement
});

export default rootReducer;
