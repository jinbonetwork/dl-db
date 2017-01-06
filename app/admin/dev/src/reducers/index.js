import { combineReducers } from 'redux';
import airports from './airports';
import route from './route';

const rootReducer = combineReducers({
	airports: airports,
	route: route
});

export default rootReducer;
