import {RECEIVE_AGREEMENT, CHANGE_AGREEMENT} from '../constants';
import {EditorState} from 'draft-js';
import update from 'react-addons-update';

const initialState = {
	editorState: EditorState.createEmpty()
};

const agreement = (state = initialState, action) => {
	switch(action.type){
		case RECEIVE_AGREEMENT:
			return state;
		case CHANGE_AGREEMENT:
			return update(state, {editorState: {$set: action.editorState}});
		default:
			return state;
	}
};

export default agreement;
