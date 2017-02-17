import {RECEIVE_USER_PROFILE} from '../constants';
import update from 'react-addons-update';

const initialState = {
	profile: {}
};

const userProfile = (state = initialState, action) => {
	switch(action.type){
		case RECEIVE_USER_PROFILE:
			
		default:
			return state;
	}
}

export default userProfile;
