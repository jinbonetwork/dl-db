import {combineReducers} from 'redux';
import dlDb from './dlDb';
import documentForm from './documentForm';
import document from './document';
import fileText from './fileText';

const rootReducer = combineReducers({
	dlDb,
	documentForm,
	document,
	fileText
});

export default rootReducer;
