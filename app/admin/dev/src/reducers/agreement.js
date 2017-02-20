import {RECEIVE_AGREEMENT, CHANGE_AGREEMENT, COMPLETE_AGREEMENT, SUBMIT_AGREEMENT} from '../constants';
import RichTextEditor from 'react-rte';
import 'es6-shim';
import update from 'react-addons-update';

const initialState = {
	agreement: RichTextEditor.createEmptyValue(),
	isSaving: false
};

const agreement = (state = initialState, action) => {
	switch(action.type){
		case CHANGE_AGREEMENT:
			return update(state, {agreement: {$set: action.agreement}});
		case COMPLETE_AGREEMENT:
			return update(state, {isSaving: {$set: true}});
		case SUBMIT_AGREEMENT:
			return update(state, {isSaving: {$set: false}});
		default:
			return state;
	}
};

export default agreement;
