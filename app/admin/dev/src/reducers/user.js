import {RECEIVE_USER_FIELD_DATA, RECEIVE_USERLIST, RECEIVE_USER, REFINE_USERDATA} from '../constants';
import userFieldData from '../fieldData/userFieldData';
import update from 'react-addons-update';

const initialState = {
	userFieldData: userFieldData.getInitialData(),
	originalUserList: [],
	originalUser: {},
	user: userFieldData.getInitialData().empty
};

const user = (state = initialState, action) => {
	switch(action.type){
		case RECEIVE_USER_FIELD_DATA:
			return update(state, {userFieldData: {$set: action.userFieldData}});
		case RECEIVE_USERLIST:
			return update(state, {originalUserList: {$set: action.userList}});
		case RECEIVE_USER:
			return update(state, {$merge: {
				originalUser: action.user,
				user: userFieldData.refineUser(action.user, state.userFieldData)
			}});
		case REFINE_USERDATA:
			return update(state, {user: {$set: userFieldData.refineUser(state.originalUser, action.userFieldData)}});
		default:
			return state;
	}
};

export default user;
