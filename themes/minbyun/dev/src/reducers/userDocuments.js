import {RECEIVE_USER_DOCS} from '../constants';
import update from 'react-addons-update';

const initialState = {
	lastPage: 1
};

const userDocuments = (state = initialState, action) => {
	switch(action.type){
		case RECEIVE_USER_DOCS:
			return update(state, {lastPage: {$set: parseInt(action.lastPage)}});
		default:
			return state;
	}
}

export default userDocuments;
