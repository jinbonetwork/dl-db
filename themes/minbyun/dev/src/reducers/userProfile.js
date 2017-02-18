import {RECEIVE_USER_PROFILE, CHANGE_USER_PROFILE, FOCUSOUT_USER_PROFILE, FOCUSIN_USER_PROFILE, COMPLETE_USER_PROFILE,
	SUBMIT_USER_PROFILE, TOGGLE_PASSWORD_FORM, INITIALIZE_USER_PROFILE
} from '../constants';
import {refineUserFData, refineUser} from '../fieldData/userFieldData';
import update from 'react-addons-update';
import {_wrap} from '../accessories/functions';

const initialState = {
	fData: {},
	openProfile: {},
	profile: {},
	focused: {fSlug: undefined, index: undefined},
	isSaving: false,
	isPwShown: false
};

const userProfile = (state = initialState, action) => {
	switch(action.type){
		case INITIALIZE_USER_PROFILE:
			return update(state, {$merge: {
				focused: initialState.focused,
				isSaving: initialState.isSaving,
				isPwShown: initialState.isPwShown
			}});
		case RECEIVE_USER_PROFILE:
			return update(state, {$merge: _wrap(() => {
				const fData = refineUserFData({fields: action.fields, taxonomy: action.taxonomy});
				const profile = refineUser(action.profile, fData);
				return {fData, profile, openProfile: profile};
			})});
		case CHANGE_USER_PROFILE:
			switch(action.args.mode){
				case 'set':
					if(action.args.index === undefined){
						return update(state, {profile: {[action.args.fSlug]: {$set: action.args.value}}});
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
		case FOCUSOUT_USER_PROFILE:
			return update(state, {focused: {$set: initialState.focused}});
		case FOCUSIN_USER_PROFILE:
			return update(state, {focused: {$set: {fSlug: action.fSlug, index: action.index}}});
		case COMPLETE_USER_PROFILE:
			return update(state, {$merge: {
				openProfile: (action.oldProfile ? action.oldProfile : update(state.profile, {$merge: {password: '', confirmPw: ''}})),
				isSaving: true
			}});
		case SUBMIT_USER_PROFILE:
			return update(state, {
				isSaving: {$set: false},
				isPwShown: {$set: false},
				profile: {$merge: {password: '', confirmPw: ''}}
			});
		case TOGGLE_PASSWORD_FORM:
			return update(state, {
				isPwShown: {$apply: (val) => (!val)},
				profile: {$merge: {password: '', confirmPw: ''}}
			});
		default:
			return state;
	}
}

export default userProfile;
