import {INITIALIZE_USER_REGIST, INITIALIZE_USER_REGIST_FIELD, CHANGE_USER_REGIST, FOCUSOUT_USER_REGIST, FOCUSIN_USER_REGIST, COMPLETE_USER_REGIST, USER_DUPLICATE, SUBMIT_USER_REGIST
} from '../constants';
import {refineUserFData, refineUser} from '../fieldData/userFieldData';
import update from 'react-addons-update';
import {_wrap} from '../accessories/functions';

const initialState = {
	fData: {},
	profile: {},
	focused: {fSlug: undefined, index: undefined},
	isDuplicate: false,
	isSaving: false,
	isComplete: false,
};

const userRegist = (state = initialState, action) => {
	switch(action.type){
		case INITIALIZE_USER_REGIST:
			return update(state, {$merge: {
				focused: {fSlug: 'name', index: undefined},
				isComplete: initialState.isComplete,
				isSaving: initialState.isSaving
			}});
		case INITIALIZE_USER_REGIST_FIELD:
			return update(state, {$merge: _wrap(() => {
				const fData = refineUserFData({fields: action.fields, taxonomy: action.taxonomy});
				const profile = refineUser(action.profile, fData);
				return {fData, profile};
			})});
		case CHANGE_USER_REGIST:
			switch(action.args.mode){
				case 'set':
					if(action.args.index === undefined){
						return update(state, {profile: {[action.args.fSlug]: {$set: action.args.value}}
						});
					} else{
						return update(state, {profile: {[action.args.fSlug]: {[action.args.index]: {$set: action.args.value}}}});
					}
				case 'merge':
					return update(state, {profile: {$merge: action.args.value}});
				case 'push':
					return update(state, {profile: {[action.args.fSlug]: {$push: [action.args.value]}}});              
				case 'delete':
					return update(state, {profile: {[action.args.fSlug]: {$splice: [[action.args.index, 1]]}}});
				default:
					return state;
			}
		case FOCUSOUT_USER_REGIST:
			return update(state, {focused: {$set: initialState.focused}});
		case FOCUSIN_USER_REGIST:
			return update(state, {focused: {$set: {fSlug: action.fSlug, index: action.index}}});
		case USER_DUPLICATE:
			return update(state, {
				isDuplicate: {$set: true}
			});
		case COMPLETE_USER_REGIST:
			return update(state, {
				isSaving: {$set: true}
			});
		case SUBMIT_USER_REGIST:
			return update(state, {
				isSaving: {$set: false},
				isComplete: {$set: true}
			});
		default:
			return state;
	}
}

export default userRegist;
