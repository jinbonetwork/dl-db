import {RECEIVE_SEARCH_RESULT} from '../constants';
import update from 'react-addons-update';

const initialState = {
	distribution: {},
	lastPage: 1
};

const searchResult = (state = initialState, action) => {
	switch(action.type){
		case RECEIVE_SEARCH_RESULT:
			return update(state, {$merge: {
				distribution: (action.distribution ? action.distribution : initialState.distribution),
				lastPage: parseInt(action.lastPage ? action.lastPage : initialState.lastPage)}
			});
		default:
			return state;
	}
}

export default searchResult;
