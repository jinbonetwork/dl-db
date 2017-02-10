import {combineReducers} from 'redux';
import dlDb from './dlDb';
import documentForm from './documentForm';

const rootReducer = combineReducers({
	dlDb,
	documentForm
});

export default rootReducer;
