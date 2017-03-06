import {RECEIVE_ATTACHMENTS, CHANGE_PROPS_IN_ATTACHMENTS, TOGGLE_PARSED, RECEIVE_PARSE_STATE} from '../constants';
import update from 'react-addons-update';

const initialState = {
	lastPage: 1,
	fieldSearching: 'default',
	keywordSearching: '',
	parseState: {}
};

const attachments = (state = initialState, action) => {
	switch (action.type){
		case RECEIVE_ATTACHMENTS:
			return update(state, {lastPage: {$set: action.lastPage}});
		case CHANGE_PROPS_IN_ATTACHMENTS:
			return update(state, {[action.which]: {$set: action.value}});
		case RECEIVE_PARSE_STATE:
			return update(state, {parseState: {$set: action.parseState}});
		default:
			return state;
	}
};

export default attachments;
