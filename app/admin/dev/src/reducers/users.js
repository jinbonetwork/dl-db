import {RECEIVE_USERLIST} from '../constants';
import update from 'react-addons-update'

const initialState = {
	list: [],
	lastPage: 1
};

const users = (state = initialState, action) => {
	switch (action.type) {
		case RECEIVE_USERLIST:
			return update(state, {list: {$set: action.userList}});
		default:
			return state;
	}
};

export default users;
