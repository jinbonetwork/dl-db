import {CHANGE_PROPS_IN_USER} from '../constants';
import update from 'react-addons-update';

const initialState = {
	isDelBtnYesOrNo: false
};

const user = (state = initialState, action) => {
	switch(action.type){
		case CHANGE_PROPS_IN_USER:
			return update(state, {[action.which]: {$set: action.value}});
		default:
			return state;
	}
};

export default user;
