import { SHOW_MESSAGE, HIDE_MESSAGE, RECEIVE_USER_FIELD_DATA, RECEIVE_DOC_FIELD_DATA, RECEIVE_ROOT_DATA,
	SHOW_PROCESS, HIDE_PROCESS, CHANGE_LOGIN, RESIZE, SUCCEED_LOGIN
} from '../constants';
import {refineUserFData, refineUser, refineUserList} from '../fieldData/userFieldData';
import {refineDocFData, refineDocList} from '../fieldData/docFieldData';
import {refineFileList, refineFile} from '../fieldData/fileFieldData.js';
import update from 'react-addons-update';
import {_mapO} from '../accessories/functions';

const initialState = {
	docFieldData: undefined,
	userFieldData: undefined,
	role: undefined,
	menuData: [],
	searchQuery: {doctypes: [], keyword: '', from: '', to: ''},
	openedDocs: [],
	message: {content: '', callback: undefined},
	showProc: false,
	login: {type: '', id: '', password: '', agreement: undefined},
	window: {width: 0, height: 0}
};

const refinMenuData = (data) => {
	return _mapO(data, (key, value) => {
		const items = value.sub.map((item) => { return {
			displayName: item.name,
			url: item.url
		}});
		return {
			displayName: value.name,
			items: items
		}
	})
};

const dlDb = (state = initialState, action) => {
	switch(action.type){
		case RECEIVE_ROOT_DATA:
			return update(state, {
				role: {$set: (action.rootData.role ? action.rootData.role.map((r) => (action.rootData.roles[r])) : null)},
				menuData: {$set: refinMenuData(action.rootData.menu)},
				login: {$merge: {type: action.rootData.sessiontype, agreement: (action.rootData.agreement == 1)}}
			});
		case RECEIVE_DOC_FIELD_DATA:
			return update(state, {docFieldData: {$set: refineDocFData(action.originDocFData)}});
		case SHOW_MESSAGE:
			return update(state, {message: {$set: {content: action.message, callback: action.callback}}});
		case HIDE_MESSAGE:
			return update(state, {message: {$set: {content: '', callback: null}}});
		case SHOW_PROCESS:
			return update(state, {showProc: {$set: true}});
		case HIDE_PROCESS:
			return update(state, {showProc: {$set: false}});
		case RESIZE:
			return update(state, {window: {$merge: action.size}});
		case CHANGE_LOGIN:
			return update(state, {login: {[action.which]: {$set: action.value}}});
		default:
			return state;
	}
}

export default dlDb;
