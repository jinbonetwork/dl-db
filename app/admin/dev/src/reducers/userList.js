import {RECEIVE_USERLIST, CHANGE_PROPS_IN_USERLIST} from '../constants';
import update from 'react-addons-update';
import {_copyOf, _forIn} from '../accessories/functions';

const initialState = {
	originalUsers: [],
	lastPage: 1,
	selected: [],
	isDelBtnYesOrNo: false
};

const userList = (state = initialState, action) => {
	switch (action.type){
		case RECEIVE_USERLIST:
			return update(state, {$merge: {
				originalUsers: action.originalUsers, lastPage: action.lastPage}
			});
		case CHANGE_PROPS_IN_USERLIST:
			return update(state, {[action.which]: {$set: action.value}});
		default:
			return state;
	}
};

export default userList;
