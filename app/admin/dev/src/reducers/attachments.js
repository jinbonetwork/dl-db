import {RECEIVE_ATTACHMENTS, CHANGE_PROPS_IN_ATTACHMENTS, TOGGLE_PARSED} from '../constants';
import update from 'react-addons-update';

const initialState = {
	lastPage: 1,
	selected: [],
	isDelBtnYesOrNo: false,
	sortedBy: 'time'
};

const attachments = (state = initialState, action) => {
	switch (action.type){
		case RECEIVE_ATTACHMENTS:
			return update(state, {lastPage: {$set: action.lastPage}});
		case CHANGE_PROPS_IN_ATTACHMENTS:
			return update(state, {[action.which]: {$set: action.value}});
		default:
			return state;
	}
};

export default attachments;
