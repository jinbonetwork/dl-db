import {RECEIVE_AGREEMENT} from '../constants';


const agreement = (state = '', action) => {
	switch(action.type){
		case RECEIVE_AGREEMENT:
			return action.agreement;
		default:
			return state;
	}
};

export default agreement;
