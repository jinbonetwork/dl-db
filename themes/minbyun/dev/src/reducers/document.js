import {RECEIVE_PARSE_STATE, RENEW_FILE_STATUS, TOGGLE_DEL_DOC_BUTTON, INITIALIZE_DOC, SELECT_IMAGE, TOGGLE_REPORT_FORM,
	CHANGE_REPORT} from '../constants';
import update from 'react-addons-update';

const initialState = {
	parseState: {},
	dispBtnOfYesOrNo: false,
	selectedImage: undefined,
	isReportFormVisible: false,
	report: ''
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
			return update(state, {selectedImage: {$set: action.index}});
		case TOGGLE_REPORT_FORM:
			return update(state, {isReportFormVisible: {$apply: (val) => (!val)}});
		case CHANGE_REPORT:
			return update(state, {report: {$set: action.report}});
		default:
			return state;
	}
};

export default document;
