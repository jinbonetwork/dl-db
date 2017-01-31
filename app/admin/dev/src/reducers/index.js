import {combineReducers} from 'redux';
import admin from './admin';
import userList from './userList';
import user from './user';
import userForm from './userForm';
import agreement from './agreement';
import attachments from './attachments';

const rootReducer = combineReducers({
	admin,
	userList,
	user,
	userForm,
	agreement,
	attachments
});

export default rootReducer;
