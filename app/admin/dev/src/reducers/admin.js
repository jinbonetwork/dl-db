import {
	RECEIVE_ADMIN_INFO,
	CHANGE_PROPS_IN_ADMIN,
	REQUEST_LOGIN, SUCCEED_LOGIN, SHOW_LOGIN,
	SHOW_MESSAGE, HIDE_MESSAGE, SHOW_PROCESS, HIDE_PROCESS } from '../constants';
import update from 'react-addons-update';
import {_findProp} from '../accessories/functions';

const initialState = {
	isAdmin: undefined,
	roles: {},
	loginType: '',
	id: '',
	password: '',
	message: {
		content: '', callback: null
	},
	showProc: false
};

const admin = (state = initialState, action) => {
	switch(action.type){
		case RECEIVE_ADMIN_INFO:
			const info = action.adminInfo;
			return update(state, {$merge: {
				isAdmin: (info.role ? info.role.indexOf(parseInt(_findProp(info.roles, 'administrator'))) >= 0 : false),
				roles: info.roles,
				loginType: info.sessiontype
			}});
		case CHANGE_PROPS_IN_ADMIN:
			return update(state, {[action.which]: {$set: action.value}});
		case SUCCEED_LOGIN:
			return update(state, {isAdmin: {$set: true}});
		case SHOW_LOGIN:
			return update(state, {isAdmin: {$set: false}});
		case SHOW_MESSAGE:
			return update(state, {message: {$set: {content: action.message, callback: action.callback}}});
		case HIDE_MESSAGE:
			return update(state, {message: {$set: {content: '', callback: null}}});
		case SHOW_PROCESS:
			return update(state, {showProc: {$set: true}});
		case HIDE_PROCESS:
			return update(state, {showProc: {$set: false}});
		default:
			return state;
	}
};

export default admin;
