import {combineReducers} from 'redux';
import dlDb from './dlDb';
import documentForm from './documentForm';
import document from './document';
import fileText from './fileText';
import userDocuments from './userDocuments';
import searchResult from './searchResult';

const rootReducer = combineReducers({
	dlDb,
	documentForm,
	document,
	fileText,
	userDocuments,
	searchResult
});

export default rootReducer;
