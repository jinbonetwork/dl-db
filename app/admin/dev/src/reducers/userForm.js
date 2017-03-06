import {
	SET_USER_OF_USERFORM, CHANGE_USER_PROPS, BLUR_USERFORM,SET_FOCUS_IN_USERFORM, COMPLETE_USERFORM,
	SUBMIT_USERFORM, SHOW_PASSWORD, REQUEST_REGISTER, REGISTER
} from '../constants';
import update from 'react-addons-update';

const initialState = {
	user: {},
	focused: {fSlug: undefined, index: undefined},
	isSaving: false,
	isPwShown: false
};

const userForm = (state = initialState, action) => {
	switch(action.type){
		case CHANGE_USER_PROPS:
			let {mode, fSlug, index, value} = action.args;
			let newState = update(state, {focused: {$set: initialState.focused}});
			switch(mode){
				case 'set':
					if(index === undefined){
						return update(newState, {user: {[fSlug]: {$set: value}}});
					} else{
						return update(newState, {user: {[fSlug]: {[index]: {$set: value}}}});
					}
				case 'merge':
					return update(newState, {user: {$merge: value}});
				case 'push':
					return update(newState, {user: {[fSlug]: {$push: [value]}}});
				case 'delete':
					return update(newState, {user: {[fSlug]: {$splice: [[index, 1]]}}});
				default:
					return newState;
			}
		case SET_FOCUS_IN_USERFORM:
			return update(state, {focused: {$set: {fSlug: action.fSlug, index: action.index}}});
		case BLUR_USERFORM:
			return update(state, {focused: {$set: initialState.focused}});
		case COMPLETE_USERFORM:
			return update(state, {isSaving: {$set: true}});
		case SUBMIT_USERFORM:
			return update(state, {
				isSaving: {$set: false},
				isPwShown: {$set: false},
				user: {$merge: {password: '', confirmPw: ''}}
			});
		case SHOW_PASSWORD:
			return update(state, {isPwShown: {$set: action.state}});
		default:
			return state;
	}
};

export default userForm;
