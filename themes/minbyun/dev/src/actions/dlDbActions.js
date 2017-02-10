import { SHOW_MESSAGE, HIDE_MESSAGE, RECEIVE_USER_FIELD_DATA, RECEIVE_DOC_FIELD_DATA, RECEIVE_ROOT_DATA,
	SHOW_PROCESS, HIDE_PROCESS, CHANGE_LOGIN, RESIZE, SUCCEED_LOGIN, RECEIVE_AGREEMENT, AGREE_WITH_AGREEMENT
} from '../constants';
import api from '../api/dlDbApi';

const dispatchError = (dispatch, error) => {
	if(error.code !== -9999){
		dispatch({type: SHOW_MESSAGE, message: error.message});
	} else {
		dispatch({
			type: SHOW_MESSAGE,
			message: '서버와의 연결이 끊어졌습니다. 다시 로그인해주세요.',
			callback: () => dispatch({type: SHOW_LOGIN})
		});
	}
};
const dispatchUserFieldData = (dispatch) => {
	api.fetchUserFieldData(
		(orginUsrFData) => dispatch({type: RECEIVE_USER_FIELD_DATA, orginUsrFData}),
		(error) => dispatchError(dispatch, error)
	);
};
const dispatchDocFieldData = (dispatch) => {
	api.fetchDocFieldData(
		(originDocFData) => dispatch({type: RECEIVE_DOC_FIELD_DATA, originDocFData}),
		(error) => dispatchError(dispatch, error)
	);
};
const actionCreators = {
	fetchRootData(){
		return (dispatch) => {
			api.fetchRootData((rootData) => {
				dispatch({type: RECEIVE_ROOT_DATA, rootData});
				if(rootData.role){
					dispatchDocFieldData(dispatch);
					//dispatchUserFieldData(dispatch);
				}
			}, (error) => dispatchError(dispatch, error));
		}
	},
	showMessage(message, callback){
		return {type: SHOW_MESSAGE, message, callback};
	},
	hideMessage(){
		return {type: HIDE_MESSAGE};
	},
	resize(size){
		return {type: RESIZE, size};
	},
	changeLogin(which, value){
		return {type: CHANGE_LOGIN, which, value};
	},
	login(loginUrl, formData, failLogin){ return (dispatch) => {
		dispatch({type: SHOW_PROCESS});
		api.login(loginUrl, formData, (role, roles, agreement) => {
			if(role){
				dispatch({type: HIDE_PROCESS});
				dispatch({type: SUCCEED_LOGIN, role, roles, agreement});
				dispatchDocFieldData(dispatch);
				//dispatchUserFieldData(dispatch);
			} else {
				dispatch({type: HIDE_PROCESS});
				dispatch({
					type: SHOW_MESSAGE,
					message: '로그인 정보가 올바르지 않습니다.',
					callback: failLogin
				});
			}
		}, (error) => dispatchError(dispatch, error));
	}},
	fetchAgreement(){ return (dispatch) => {
		dispatch({type: SHOW_PROCESS});
		api.fetchAgreement(
			(agreement) => {
				dispatch({type: HIDE_PROCESS});
				dispatch({type: RECEIVE_AGREEMENT, agreement});
			},
			(error) => {
				dispatch({type: HIDE_PROCESS});
				dispatchError(dispatch, error);
			}
		);
	}},
	agreeWithAgreement(){ return (dispatch) => {
		dispatch({type: AGREE_WITH_AGREEMENT});
		api.agreeWithAgreement(
			() => {}, (error) => dispatchError(dispatch, error)
		);
	}}
}

export default actionCreators;
