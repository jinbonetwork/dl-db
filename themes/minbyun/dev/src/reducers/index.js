import {combineReducers} from 'redux';
import dlDb from './dlDb';
import documentForm from './documentForm';
import document from './document';
import fileText from './fileText';
import userDocuments from './userDocuments';

const rootReducer = combineReducers({
	dlDb,
	documentForm,
	document,
	fileText,
	userDocuments
});

export default rootReducer;
