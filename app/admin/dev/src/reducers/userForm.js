import { SET_USER_OF_USERFORM, CHANGE_USER_PROPS, BLUR_USERFORM,
	SET_FOCUS_IN_USERFORM, COMPLETE_USERFORM, SUBMIT_USERFORM} from '../constants';
import {initUsrFData} from '../fieldData/userFieldData';
import update from 'react-addons-update';
import {_wrap} from '../accessories/functions';

const initialState = {
	user: initUsrFData.empty,
	focused: {fSlug: undefined, index: undefined},
	isSaving: false
};

const userForm = (state = initialState, action) => {
	switch(action.type){
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
					return update(state, {user: {$merge: value}});
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
		case COMPLETE_USERFORM:
			return update(state, {isSaving: {$set: true}});
		case SUBMIT_USERFORM:
			return update(state, {isSaving: {$set: false}});
		default:
			return state;
	}
};

export default userForm;