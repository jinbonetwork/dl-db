import {combineReducers} from 'redux';
import dlDb from './dlDb';
import documentForm from './documentForm';
import document from './document';
import fileText from './fileText';
import userDocuments from './userDocuments';
import searchResult from './searchResult';
import bookmarks from './bookmarks';
import history from './history';
import userProfile from './userProfile';
import userRegist from './userRegist';

const rootReducer = combineReducers({
	dlDb,
	documentForm,
	document,
	fileText,
	userDocuments,
	searchResult,
	bookmarks,
	history,
	userProfile,
	userRegist
});

export default rootReducer;
