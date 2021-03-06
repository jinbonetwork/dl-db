import { CHANGE_DOCFORM, FOCUSIN_DOCFORM, FOCUSOUT_DOCFORM, COMPLETE_DOCFORM, SUBMIT_DOCFORM, RECEIVE_PARSE_STATE, INITIALIZE_DOCFORM,
	RENEW_FILE_STATUS, RECEIVE_COURTS
} from '../constants';
import update from 'react-addons-update';

const initialState = {
	doc: {},
	focused: {fSlug: undefined, index: undefined},
	isSaving: false,
	parseState: {},
	courts: []
};

const documentForm = (state = initialState, action) => {
	switch(action.type){
		case INITIALIZE_DOCFORM:
			return update(state, {$merge: {
				focused: {fSlug: 'doctype', index: undefined},
				isSaving: initialState.isSaving,
				parseState: initialState.parseState
			}});
		case CHANGE_DOCFORM:
			let {mode, fSlug, index, value} = action.args;
			switch(mode){
				case 'set':
					if(index === undefined){
						return update(state, {doc: {[fSlug]: {$set: value}}});
					} else{
						return update(state, {doc: {[fSlug]: {[index]: {$set: value}}}});
					}
				case 'merge':
					return update(state, {doc: {$merge: value}});
				case 'push':
					return update(state, {doc: {[fSlug]: {$push: [value]}}});
				case 'delete':
					return update(state, {doc: {[fSlug]: {$splice: [[index, 1]]}}});
				default:
					return state;
			}
		case FOCUSIN_DOCFORM:
			return update(state, {focused: {$set: {fSlug: action.fSlug, index: action.index}}});
		case FOCUSOUT_DOCFORM:
			return update(state, {focused: {$set: initialState.focused}});
		case COMPLETE_DOCFORM:
			return update(state, {isSaving: {$set: action.isSaving}});
		case SUBMIT_DOCFORM:
			return update(state, {isSaving: {$set: false}});
		case RECEIVE_PARSE_STATE:
			return update(state, {parseState: {$set: (action.parseState ? action.parseState : initialState.parseState)}});
		case RENEW_FILE_STATUS:
			return update(state, {doc: {$merge: action.filesWithNewStatus}});
		case RECEIVE_COURTS:
			return update(state, {courts: {$set: action.courts}});
		default:
			return state;
	}
}

export default documentForm;
