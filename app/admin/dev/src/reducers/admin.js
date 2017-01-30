import {RECEIVE_ADMIN_INFO, RECEIVE_USER_FIELD_DATA, RECEIVE_USERLIST, ADD_USER_TO_OPEN_USERS,
	CHANGE_PROPS_IN_ADMIN, REQUEST_LOGIN, SUCCEED_LOGIN, SHOW_LOGIN,
	SHOW_MESSAGE, HIDE_MESSAGE, SHOW_PROCESS, HIDE_PROCESS,
	COMPLETE_USERFORM, SUBMIT_USERFORM,
	RECEIVE_AGREEMENT, COMPLETE_AGREEMENT, SUBMIT_AGREEMENT} from '../constants';
import {initUsrFData, refineUserFData, refineUser, refineUserList} from '../fieldData/userFieldData';
import RichTextEditor from 'react-rte';
import update from 'react-addons-update';
import {_findProp} from '../accessories/functions';

const initialState = {
	isAdmin: undefined,
	didReceiveUserFieldData: false,
	userFieldData: initUsrFData,
	openUsers: {},
	userList: [],
	openAgreement: null,
	message: {content: '', callback: null},
	showProc: false,
	loginType: '',
	id: '',
	password: '',
};

const admin = (state = initialState, action) => {
	switch(action.type){
		case RECEIVE_ADMIN_INFO:
			return update(state, {$merge: action.adminInfo});
		case RECEIVE_USER_FIELD_DATA:
			return update(state, {
				userFieldData: {$set: refineUserFData(action.orginUsrFData)},
				didReceiveUserFieldData: {$set: true}
			});
		case CHANGE_PROPS_IN_ADMIN:
			return update(state, {[action.which]: {$set: action.value}});
		case SUCCEED_LOGIN:
			return update(state, {$merge: {isAdmin: true, id: '', password: ''}});
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
		case ADD_USER_TO_OPEN_USERS:
		case SUBMIT_USERFORM:
			return update(state, {openUsers: {[action.user.id]: {$set: refineUser(action.user, state.userFieldData)}}});
		case COMPLETE_USERFORM:
			return update(state, {openUsers: {[action.user.id]: {$set: action.user}}});
		case RECEIVE_USERLIST:
			return update(state, {userList: {$set: refineUserList(action.originalUsers, state.userFieldData)}});
		case RECEIVE_AGREEMENT:
			return update(state, {openAgreement: {$set: RichTextEditor.createValueFromString(action.agreement, 'html')}});
		case COMPLETE_AGREEMENT:
		case SUBMIT_AGREEMENT:
			return update(state, {openAgreement: {$set: action.agreement}});
		default:
			return state;
	}
};

export default admin;
