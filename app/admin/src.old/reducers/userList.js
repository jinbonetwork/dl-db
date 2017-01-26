import {RECEIVE_USERLIST, RECEIVE_USER_FIELD_DATA, CHANGE_PROPS_IN_USERLIST} from '../constants';
import {initUsrFData} from '../fieldData/userFieldData';
import {updateUserFieldData} from './common';
import update from 'react-addons-update';
import {_copyOf, _forIn} from '../accessories/functions';

const initialState = {
	userFieldData: initUsrFData,
	list: [],
	originalList: [],
	lastPage: 1,
	selected: []
};
const refineList = (original, {fID, fProps}) => {
	return original.map((item) => ({
		id: parseInt(item[fID.id]),
		name: item[fID.name],
		class: item[fID.class],
		email: item[fID.email],
		phone: item[fID.phone],
		uid: (item[fID.uid] > 0 ? '등록' : '')
	}));
};
const userList = (state = initialState, action) => {
	switch (action.type) {
		case RECEIVE_USER_FIELD_DATA:
			let newState = updateUserFieldData(state, action);
			return update(newState, {list: {$set: refineList(state.originalList, newState.userFieldData)}});
		case RECEIVE_USERLIST:
			return update(state, {
				showProc: {$set: false},
				orginalList: {$set: action.userList},
				list: {$set: refineList(action.userList, state.userFieldData)},
				lastPage: {$set: action.lastPage}
			});
		case CHANGE_PROPS_IN_USERLIST:
			return update(state, {[action.which]: {$set: action.value}});
		default:
			return state;
	}
};

export default userList;
