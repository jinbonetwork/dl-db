import {combineReducers} from 'redux'
import users from './users';
import agreement from './agreement'

const rootReducer = combineReducers({
	users: users,
	agreement: agreement
});

export default rootReducer;
