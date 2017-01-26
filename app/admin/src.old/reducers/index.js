import {combineReducers} from 'redux';
import admin from './admin';
import userList from './userList';
import user from './user';
import userForm from './userForm';
import agreement from './agreement';

const rootReducer = combineReducers({
	admin,
	userList,
	user,
	userForm,
	agreement
});

export default rootReducer;
