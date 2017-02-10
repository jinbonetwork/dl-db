import { SHOW_MESSAGE, HIDE_MESSAGE, RECEIVE_USER_FIELD_DATA, RECEIVE_DOC_FIELD_DATA, RECEIVE_ROOT_DATA,
	SHOW_PROCESS, HIDE_PROCESS, CHANGE_LOGIN, RESIZE, SUCCEED_LOGIN, RECEIVE_AGREEMENT, AGREE_WITH_AGREEMENT,
	LOGOUT, CHANGE_SEARCHBAR_STATE
} from '../constants';
import {refineUserFData, refineUser, refineUserList} from '../fieldData/userFieldData';
import {refineDocFData, refineDocList} from '../fieldData/docFieldData';
import {refineFileList, refineFile} from '../fieldData/fileFieldData';
import update from 'react-addons-update';
import {_mapO, _mapOO} from '../accessories/functions';

const initialState = {
	docFieldData: undefined,
	userFieldData: undefined,
	role: undefined,
	menuData: [],
	openDocs: [],
	message: {content: '', callback: undefined},
	showProc: false,
	window: {width: 0, height: 0},
	login: {
		type: '', id: '', password: '', didLogIn: false, doAgree: false, agreement: ''
	},
	searchBar: {
		doctypes: [], keyword: '', from: '', to: '',
		keywordMarginLeft: null,
		isPeriodVisible: false,
		isPeriodFocused: false,
		isHelperVisible: false,
		isKeywordFocused: false,
		count: '00000'
	}
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
				login: {$merge: {
					type: action.rootData.sessiontype,
					didLogIn: (action.rootData.role ? true : false),
					doAgree: (action.rootData.agreement == 1)}
				}
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
		case SUCCEED_LOGIN:
			return update(state, {
				role: {$set: action.role.map((r) => (action.roles[r]))},
				login: {$merge: {id: '', password: '', didLogIn: true, doAgree: (action.agreement == 1)}}
			});
		case RECEIVE_AGREEMENT:
			return update(state, {login: {agreement: {$set: action.agreement}}});
		case AGREE_WITH_AGREEMENT:
			return update(state, {login: {doAgree: {$set: true}}});
		case LOGOUT:
			return update(state, {$apply: (curState) =>
				update(initialState, {menuData: {$set: curState.menuData}, login: {type: {$set: curState.login.type}}})
			});
		case CHANGE_SEARCHBAR_STATE:
			return update(state, {searchBar: {$merge: action.value}});
		default:
			return state;
	}
}

export default dlDb;
