import {refineUser} from '../fieldData/userFieldData';
import update from 'react-addons-update';

export const updateUserFieldData = (state, action) => {
	return update(state, {userFieldData: {$set: action.userFieldData}});
};

export const updateUserList = (state, action) => {
	return update(state, {originalUserList: {$set: action.userList}});
};

export const updateUser = (state, action) => {
	return update(state, {$merge: {
		originalUser: action.user,
		user: refineUser(action.user, state.userFieldData)
	}});
};

export const updateUserListOnSubmit = (state, action) => {
	//let usrIndex = state.originalUserList.findIndex((usr) => (usr.id == action.user.id));
	//console.log(state.originalUserList[usrIndex]);
	//console.log(state.user);
	//console.log(state.originalUserList);
	//return state;
	/*
	let pulledback = pullbackDoc(action.user, state.userFieldData, userData.pullbackDoc);
	let usrIndex = state.originalUserList.findIndex((usr) => (usr.id == action.user.id));
	if(usrIndex >= 0){
		return update(state, {originalUserList: {[usrIndex]: {$set: pulledback}}});
	} else {
		return update(state, {originalUserList: {$push: [pulledback]}});
	}
	*/
	return state;
};
