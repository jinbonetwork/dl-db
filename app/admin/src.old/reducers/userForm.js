import {
	RECEIVE_USER_FIELD_DATA, RECEIVE_USERLIST, RECEIVE_USER,
	CHANGE_USER_PROPS, BLUR_USERFORM, SET_FOCUS_IN_USERFORM, REQUEST_SUBMIT_USERFORM} from '../constants';
import {initUsrFData, refineUser} from '../fieldData/userFieldData';
import {updateUserListOnSubmit, updateUserFieldData, updateUser, updateUserList} from './common';
import update from 'react-addons-update';
import {_wrap} from '../accessories/functions';

const initialState = {
	user: initUsrFData.empty,
	originalUser: {},
	userFieldData: initUsrFData,
	originalUserList: [],
	focused: {fSlug: undefined, index: undefined},
	formData: null
};

const userForm = (state = initialState, action) => {
	let newState;
	switch(action.type){
		case RECEIVE_USER_FIELD_DATA:
			newState = updateUserFieldData(state, action);
			return update(newState, {user: {$set: refineUser(state.originalUser, newState.userFieldData)}});
		case RECEIVE_USERLIST:
			return updateUserList(state, action);
		case RECEIVE_USER:
			return updateUser(state, action);
		case CHANGE_USER_PROPS:
			let {mode, fSlug, index, value} = action.args;
			switch(mode){
				case 'set':
					if(index === undefined){
						return update(state, {user: {[fSlug]: {$set: value}}});
					} else{
						return update(state, {user: {[fSlug]: {[index]: {$set: value}}}});
					}
				case 'merge':
					return update(state, {user: {$merge: props}});
				case 'push':
					return update(state, {user: {[fSlug]: {$push: [value]}}});
				case 'delete':
					return update(state, {user: {[fSlug]: {$splice: [[index, 1]]}}});
				default:
					return state;
			}
		case SET_FOCUS_IN_USERFORM:
			return update(state, {focused: {$set: {fSlug: action.fSlug, index: action.index}}});
		case BLUR_USERFORM:
			return update(state, {focused: {$set: initialState.focused}});
		case REQUEST_SUBMIT_USERFORM:
			return updateUserListOnSubmit(state, action);
			/*
			newState = updateUserListOnSubmit(state, action);
			let pulledback = newState.originalUserList.find((user) => (user.id == action.user.id));
			let formData = makeFormData(action.user, state.userFieldData, pulledback);
			return update(newState, {formData: {$set: formData}});
			*/
		default:
			return state;
	}
};

export default userForm;
