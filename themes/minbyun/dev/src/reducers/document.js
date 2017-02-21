import { RECEIVE_PARSE_STATE, RENEW_FILE_STATUS, TOGGLE_DEL_DOC_BUTTON, INITIALIZE_DOC, SELECT_IMAGE} from '../constants';
import update from 'react-addons-update';

const initialState = {
	parseState: {},
	dispBtnOfYesOrNo: false,
	selectedImage: undefined,
};

const document = (state = initialState, action) => {
	switch(action.type){
		case INITIALIZE_DOC:
			return update(state, {$set: initialState});
		case RECEIVE_PARSE_STATE:
			return update(state, {parseState: {$set: (action.parseState ? action.parseState : initialState.parseState)}});
		case TOGGLE_DEL_DOC_BUTTON:
			return update(state, {dispBtnOfYesOrNo: {$apply: (val) => (!val)}});
		case SELECT_IMAGE:
			return update(state, {selectedImage: {$set: action.index}})
		default:
			return state;
		}
};

export default document;
