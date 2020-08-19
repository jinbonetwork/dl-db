import {INITIALIZE_USER_REGIST, USER_DUPLICATE, SUBMIT_USER_REGIST
} from '../constants';
import {refineUserFData, refineUser} from '../fieldData/userFieldData';
import update from 'react-addons-update';
import {_wrap} from '../accessories/functions';

const initialState = {
	fData: {},
	focused: {fSlug: undefined, index: undefined},
	isDuplicate: false,
	isSaving: false,
	isComplte: false,
};

const userRegist = (state = initialState, action) => {
	switch(action.type){
		case INITIALIZE_USER_REGIST:
			return update(state, {$merge: {
				focused: {fSlug: 'name', index: undefined},
				isSaving: initialState.isSaving
			}});
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
				isComplte: {$set: true}
			});
		default:
			return state;
	}
}

export default userRegist;
