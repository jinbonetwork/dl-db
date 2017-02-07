import {
	CHANGE_FILETEXT, COMPLETE_FILETEXT, SUBMIT_FILETEXT, REQUEST_TOGGLING_PARSED_OF_FILE, TOGGLE_PARSED_OF_FILE
} from '../constants';
import update from 'react-addons-update';

const initialState = {
	fileText: {},
	isSaving: false,
};

const fileText = (state = initialState, action) => {
	switch(action.type){
		case CHANGE_FILETEXT:
			return update(state, {fileText: {$merge: action.fileText}});
		case COMPLETE_FILETEXT:
			return update(state, {isSaving: {$set: true}});
		case SUBMIT_FILETEXT:
			return update(state, {isSaving: {$set: false}});
		case REQUEST_TOGGLING_PARSED_OF_FILE:
			return update(state, {fileText: {status: {$set: 'ing'}}});
		case TOGGLE_PARSED_OF_FILE:
			return update(state, {fileText: {status: {$set: action.status}}});
		default:
			return state;
	}
};

export default fileText;
