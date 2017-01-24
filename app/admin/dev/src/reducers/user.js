import {RECEIVE_USER_FIELD_DATA, RECEIVE_USERLIST, RECEIVE_USER, REQUEST_SUBMIT_USERFORM} from '../constants';
import {initUsrFData, refineUser} from '../fieldData/userFieldData';
import {updateUserListOnSubmit, updateUserFieldData, updateUser, updateUserList} from './common';
import update from 'react-addons-update';

const initialState = {
	user: initUsrFData.empty,
	originalUser: {},
	userFieldData: initUsrFData,
	originalUserList: [],
};

const user = (state = initialState, action) => {
	switch(action.type){
		case RECEIVE_USER_FIELD_DATA:
			let newState = updateUserFieldData(state, action);
			return update(newState, {user: {$set: refineUser(state.originalUser, newState.userFieldData)}});
		case RECEIVE_USERLIST:
			return updateUserList(state, action);
		case RECEIVE_USER:
			return updateUser(state, action);
		case REQUEST_SUBMIT_USERFORM:
			//console.log('in user.js');
			//console.log(state);
			//console.log();
			return updateUserListOnSubmit(state, action);
		default:
			return state;
	}
};

export default user;
