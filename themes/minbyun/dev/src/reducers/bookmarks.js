import {RECEIVE_BOOKMARKS} from '../constants';
import update from 'react-addons-update';

const initialState = {
	lastPage: 1
};

const bookmarks = (state = initialState, action) => {
	switch(action.type){
		case RECEIVE_BOOKMARKS:
			return update(state, {lastPage: {$set: action.lastPage}});
		default:
			return state;
	}
}

export default bookmarks;
