import {RECEIVE_HISTORY} from '../constants';
import update from 'react-addons-update';

const initialState = {
	lastPage: 1
};

const history = (state = initialState, action) => {
	switch(action.type){
		case RECEIVE_HISTORY:
			return update(state, {lastPage: {$set: action.lastPage}});
		default:
			return state;
	}
}

export default history;
