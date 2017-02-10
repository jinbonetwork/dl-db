import {
	RECEIVE_ADMIN_INFO, RECEIVE_USER_FIELD_DATA, RECEIVE_USERLIST, RECEIVE_DOC_FIELD_DATA,
	ADD_USER_TO_OPEN_USERS, CHANGE_PROPS_IN_ADMIN, REQUEST_LOGIN, SUCCEED_LOGIN, SHOW_LOGIN,
	SHOW_MESSAGE, HIDE_MESSAGE, SHOW_PROCESS, HIDE_PROCESS, COMPLETE_USERFORM, SUBMIT_USERFORM,
	RECEIVE_AGREEMENT, COMPLETE_AGREEMENT, SUBMIT_AGREEMENT, RECEIVE_ATTACHMENTS,
	REQUEST_TOGGLING_PARSED, TOGGLE_PARSED, REQUEST_TOGGLING_ANONYMITY, TOGGLE_ANONYMITY,
	DELETE_USERS, RECEIVE_FILETEXT, ADD_FILE_TO_OPEN_FILETEXTS, COMPLETE_FILETEXT, SUBMIT_FILETEXT,
	TOGGLE_PARSED_OF_FILE
} from '../constants';
import {refineUserFData, refineUser, refineUserList} from '../fieldData/userFieldData';
import {refineDocFData, refineDocList} from '../fieldData/docFieldData';
import {refineFileList, refineFile} from '../fieldData/fileFieldData.js';
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
	openFileTexts: {},
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
		case DELETE_USERS:
			let userIds = (Array.isArray(action.userIds) ? action.userIds : [action.userIds]);
			return update(state, {openUsers: {$apply: (opUsr) => {
				userIds.forEach((id) => {opUsr[id] = undefined});
				return opUsr;
			}}});
		case COMPLETE_USERFORM:
			return update(state, {openUsers: {[action.user.id]: {$set: action.user}}});
		case RECEIVE_USERLIST:
			return update(state, {userList: {$set: refineUserList(action.originalUsers, state.userFieldData)}});
		case RECEIVE_ATTACHMENTS:
			return update(state, {attachments: {$set: refineFileList(action.original)}});
		case REQUEST_TOGGLING_PARSED:
			return update(state, {attachments: {[action.idxOfFiles]: {status: {$set: 'ing'}}}});
		case TOGGLE_PARSED:
			return update(state, {attachments: {[action.idxOfFiles]: {status: {$set: action.status}}}});
		case REQUEST_TOGGLING_ANONYMITY:
			return update(state, {attachments: {[action.idxOfFiles]: {anonymity: {$set: undefined}}}});
		case TOGGLE_ANONYMITY:
			return update(state, {attachments: {[action.idxOfFiles]: {anonymity: {$set: action.status}}}});
		case RECEIVE_FILETEXT:
			let dataToSaveInOpenFileTexts = (action.which == 'file' ? refineFile(action.data) : action.data);
			if(state.openFileTexts[action.fileId]){
				return update(state, {openFileTexts: {[action.fileId]: {$merge: dataToSaveInOpenFileTexts}}});
			} else {
				return update(state, {openFileTexts: {[action.fileId]: {$set: dataToSaveInOpenFileTexts}}});
			}
		case ADD_FILE_TO_OPEN_FILETEXTS:
			return update(state, {openFileTexts: {[action.fileId]: {$set: action.file}}});
		case COMPLETE_FILETEXT:
			return update(state, {openFileTexts: {[action.fileId]: {text: {$set: action.text}}}});
		case TOGGLE_PARSED_OF_FILE:
			return update(state, {openFileTexts: {[action.fileId]: {status: {$set: action.status}}}});
		case RECEIVE_AGREEMENT:
			let agreement = (action.agreement ?
				RichTextEditor.createValueFromString(action.agreement, 'html') :
				RichTextEditor.createEmptyValue()
			);
			return update(state, {openAgreement: {$set: agreement}});
		case COMPLETE_AGREEMENT:
			return update(state, {openAgreement: {$set: action.agreement}});
		default:
			return state;
	}
};

export default admin;
