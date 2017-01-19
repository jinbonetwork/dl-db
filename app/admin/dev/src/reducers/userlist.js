import {RECEIVE_USERLIST, RECEIVE_USER_FIELD_DATA, REFINE_USERLIST, CHANGE_PROPS_IN_USERLIST} from '../constants';
import userFieldData from '../fieldData/userFieldData';
import update from 'react-addons-update';
import {_copyOf, _forIn} from '../accessories/functions';

const initialState = {
	userFieldData: userFieldData.getInitialData(),
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
const userlist = (state = initialState, action) => {
	switch (action.type) {
		case RECEIVE_USER_FIELD_DATA:
			return update(state, {userFieldData: {$set: action.userFieldData}});
		case RECEIVE_USERLIST:
			return update(state, {
				showProc: {$set: false},
				orginalList: {$set: action.userList},
				list: {$set: refineList(action.userList, state.userFieldData)},
				lastPage: {$set: action.lastPage}
			});
		case REFINE_USERLIST:
			return update(state, {list: {$set: refineList(state.originalList, action.userFieldData)}});
		case CHANGE_PROPS_IN_USERLIST:
			return update(state, {[action.which]: {$set: action.value}});
		default:
			return state;
	}
};

export default userlist;
