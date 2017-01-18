import {combineReducers} from 'redux';
import admin from './admin';
import userlist from './userlist';
import agreement from './agreement';

const rootReducer = combineReducers({
	admin,
	userlist,
	agreement
});

export default rootReducer;
