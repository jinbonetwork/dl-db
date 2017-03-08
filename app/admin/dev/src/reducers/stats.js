import {RECEIVE_STATS} from '../constants';
import update from 'react-addons-update';

const initialState = {
	lastPage: 1,
	numDocList: []
};

const stats = (state = initialState, action) => {
	switch (action.type){
		case RECEIVE_STATS:
			return update(state, {$merge: {
				numDocList: action.numDocList, lastPage: action.lastPage
			}});
		default:
			return state;
	}
};

export default stats;
