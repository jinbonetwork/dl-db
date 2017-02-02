import {
	RECEIVE_ADMIN_INFO, RECEIVE_USER_FIELD_DATA, RECEIVE_USERLIST, RECEIVE_DOC_FIELD_DATA,
	ADD_USER_TO_OPEN_USERS, CHANGE_PROPS_IN_ADMIN, REQUEST_LOGIN, SUCCEED_LOGIN, SHOW_LOGIN,
	SHOW_MESSAGE, HIDE_MESSAGE, SHOW_PROCESS, HIDE_PROCESS, COMPLETE_USERFORM, SUBMIT_USERFORM,
	RECEIVE_AGREEMENT, COMPLETE_AGREEMENT, SUBMIT_AGREEMENT, RECEIVE_ATTACHMENTS,
	REQUEST_TOGGLING_PARSED, TOGGLE_PARSED, REQUEST_TOGGLING_ANONYMITY, TOGGLE_ANONYMITY
} from '../constants';
import {refineUserFData, refineUser, refineUserList} from '../fieldData/userFieldData';
import {refineDocFData, refineDocList} from '../fieldData/docFieldData';
import RichTextEditor from 'react-rte';
import update from 'react-addons-update';
import {_findProp} from '../accessories/functions';

const initialState = {
	isAdmin: undefined,
	userFieldData: null,
	docFieldData: null,
	originDocFData: null,
	openUsers: {},
	userList: [],
	attachments: [],
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
			return update(state, {userFieldData: {$set: refineUserFData(action.orginUsrFData)}});
		case RECEIVE_DOC_FIELD_DATA:
			return update(state, {$merge: {
				originDocFData: action.originDocFData,
				docFieldData: refineDocFData(action.originDocFData)
			}});
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
		case RECEIVE_ATTACHMENTS:
			return update(state, {attachments: {$set: refineDocList(action.original, state.docFieldData)}});
		case REQUEST_TOGGLING_PARSED:
			return update(state, {attachments: {
				[action.idxOfList]: {files: {[action.idxOfFiles]: {status: {$set: 'ing'}}}}
			}});
		case TOGGLE_PARSED:
			return update(state, {attachments: {
				[action.idxOfList]: {files: {[action.idxOfFiles]: {status: {$set: action.status}}}}
			}});
		case REQUEST_TOGGLING_ANONYMITY:
			return update(state, {attachments: {
				[action.idxOfList]: {files: {[action.idxOfFiles]: {anonymity: {$set: undefined}}}}
			}});
		case TOGGLE_ANONYMITY:
			return update(state, {attachments: {
				[action.idxOfList]: {files: {[action.idxOfFiles]: {anonymity: {$set: action.status}}}}
			}});
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
