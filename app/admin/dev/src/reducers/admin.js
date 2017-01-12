import {RECEIVE_ADMIN_INFO} from '../constants';

const initialState = {
	isAdmin: false,
	loginType: '',
	id: '',
	password: ''
};

const admin = (state = initialState, action) => {
	switch(action.type){
		case RECEIVE_ADMIN_INFO:
			return state;
		default:
			return state;
	}
};

export default admin;
