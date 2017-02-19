import { RECEIVE_PARSE_STATE, RENEW_FILE_STATUS, TOGGLE_DEL_DOC_BUTTON, INITIALIZE_DOC} from '../constants';
import update from 'react-addons-update';

const initialState = {
	parseState: {},
	dispBtnOfYesOrNo: false
};

const document = (state = initialState, action) => {
	switch(action.type){
		case INITIALIZE_DOC:
			return update(state, {$set: initialState});
		case RECEIVE_PARSE_STATE:
			return update(state, {parseState: {$set: (action.parseState ? action.parseState : initialState.parseState)}});
		case TOGGLE_DEL_DOC_BUTTON:
			return update(state, {dispBtnOfYesOrNo: {$apply: (val) => (!val)}});
		default:
			return state;
		}
};

export default document;
