import {RECEIVE_USER_FIELD_DATA, RECEIVE_USERLIST, RECEIVE_USER} from '../constants';
import userFieldData from '../fieldData/userFieldData';
import update from 'react-addons-update';

const initialState = {
	userFieldData: userFieldData.getInitialData(),
	originalUserList: [],
	user: userFieldData.getInitialData().empty
};

const userlist = (state = initialState, action) => {
	switch(action.type){
		case RECEIVE_USER_FIELD_DATA:
			return update(state, {userFieldData: {$set: action.userFieldData}});
		case RECEIVE_USERLIST:
			return update(state, {originalUserList: {$set: action.userList}});
		case RECEIVE_USER:
			return update(state, {user: {$set: action.user}})
		default:
			return state;
	}
};

export default userlist;
