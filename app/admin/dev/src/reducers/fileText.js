import {CHANGE_FILETEXT} from '../constants';
import update from 'react-addons-update';

const initialState = {
	fileText: {},
	isSaving: false,
};

const fileText = (state = initialState, action) => {
	switch(action.type){
		case CHANGE_FILETEXT:
			return update(state, {fileText: {$set: action.fileText}});
		default:
			return state;
	}
};

export default fileText;
