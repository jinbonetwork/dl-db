import {combineReducers} from 'redux';
import dlDb from './dlDb';
import documentForm from './documentForm';
import document from './document';

const rootReducer = combineReducers({
	dlDb,
	documentForm,
	document,
});

export default rootReducer;
