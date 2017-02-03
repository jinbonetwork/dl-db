import {
	RECEIVE_USER_FIELD_DATA, RECEIVE_DOC_FIELD_DATA, ADD_USER_TO_OPEN_USERS, RECEIVE_USERLIST, CHANGE_PROPS_IN_USERLIST,
	RECEIVE_AGREEMENT, RECEIVE_ADMIN_INFO, CHANGE_PROPS_IN_ADMIN, SUCCEED_LOGIN, SHOW_LOGIN, SHOW_MESSAGE, HIDE_MESSAGE,
	SHOW_PROCESS, HIDE_PROCESS, CHANGE_PROPS_IN_USER, CHANGE_USER_PROPS, BLUR_USERFORM, SET_FOCUS_IN_USERFORM,
	COMPLETE_USERFORM, SUBMIT_USERFORM, CHANGE_AGREEMENT, COMPLETE_AGREEMENT, SUBMIT_AGREEMENT, RECEIVE_ATTACHMENTS,
	CHANGE_PROPS_IN_ATTACHMENTS, REQUEST_TOGGLING_PARSED, TOGGLE_PARSED, REQUEST_TOGGLING_ANONYMITY, TOGGLE_ANONYMITY
} from '../constants';
import adminApi from '../api/adminApi';

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
	adminApi.fetchUserFieldData(
		(orginUsrFData) => {
			dispatch({type: RECEIVE_USER_FIELD_DATA, orginUsrFData});
		},
		(error) => dispatchError(dispatch, error)
	);
};
const dispatchDocFieldData = (dispatch) => {
	adminApi.fetchDocFieldData(
		(originDocFData) => {
			dispatch({type: RECEIVE_DOC_FIELD_DATA, originDocFData});
		},
		(error) => dispatchError(dispatch, error)
	);
};
const adminActionCreators = {
	fetchAdminInfo(){
		return (dispatch) => {
			adminApi.fetchAdminInfo((adminInfo) => {
				dispatch({type: RECEIVE_ADMIN_INFO, adminInfo});
				if(adminInfo.isAdmin){
					dispatchUserFieldData(dispatch);
					dispatchDocFieldData(dispatch);
				}
			}, (error) => dispatchError(dispatch, error));
		}
	},
	changePropsInAdmin(which, value){
		return {type: CHANGE_PROPS_IN_ADMIN, which, value};
	},
	login(loginUrl, formData, failLogin){ return (dispatch) => {
		dispatch({type: SHOW_PROCESS});
		adminApi.login(loginUrl, formData, (isLogedIn) => {
			if(isLogedIn){
				dispatch({type: HIDE_PROCESS});
				dispatch({type: SUCCEED_LOGIN});
				dispatchUserFieldData(dispatch);
				dispatchDocFieldData(dispatch);
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
	showMessage(message, callback){
		return {type: SHOW_MESSAGE, message, callback};
	},
	hideMessage(){
		return {type: HIDE_MESSAGE}
	},
	fetchUserList(params){ return (dispatch) => {
		dispatch({type: SHOW_PROCESS});
		adminApi.fetchUserList(params,
			(originalUsers, lastPage) => {
				dispatch({type: HIDE_PROCESS});
				dispatch({type: RECEIVE_USERLIST, originalUsers, lastPage})
			},
			(error) => {
				dispatch({type: HIDE_PROCESS});
				dispatchError(dispatch, error);
			}
		);
	}},
	changePropsInUserList(which, value){
		return {type: CHANGE_PROPS_IN_USERLIST, which, value};
	},
	changePropsInUser(which, value){
		return {type: CHANGE_PROPS_IN_USER, which, value};
	},
	addUserToOpenUsers(user){
		return {type: ADD_USER_TO_OPEN_USERS, user};
	},
	fetchUser(id, callback){
		return (dispatch) => {
			dispatch({type: SHOW_PROCESS});
			adminApi.fetchUser(id,
				(user) => {
					dispatch({type: HIDE_PROCESS});
					dispatch({type: ADD_USER_TO_OPEN_USERS, user});
					if(typeof callback === 'function') callback();
				},
				(error) => {
					dispatch({type: HIDE_PROCESS});
					dispatchError(dispatch, error);
				}
			);
		};
	},
	changeUserProps(args){
		return {type: CHANGE_USER_PROPS, args};
	},
	setFocus(fSlug, index){
		return {type: SET_FOCUS_IN_USERFORM, fSlug, index}
	},
	blurUserForm(){
		return {type: BLUR_USERFORM};
	},
	submitUserForm(user, userFormData){ return (dispatch) => {
		dispatch({type: COMPLETE_USERFORM, user});
		adminApi.submitUserForm(user.id, userFormData,
			(user) => dispatch({type: SUBMIT_USERFORM, user}),
			(error) => {dispatch({type: SUBMIT_USERFORM}); dispatchError(dispatch, error)}
		);
	}},
	fetchAgreement(callback){ return (dispatch) => {
		dispatch({type: SHOW_PROCESS});
		adminApi.fetchAgreement(
			(agreement) => {
				dispatch({type: HIDE_PROCESS});
				dispatch({type: RECEIVE_AGREEMENT, agreement});
				callback();
			},
			(error) => {
				dispatch({type: HIDE_PROCESS});
				dispatchError(dispatch, error);
			}
		);
	}},
	changeAgreement(agreement){
		return {type: CHANGE_AGREEMENT, agreement};
	},
	submitAgreement(agreement, formData){ return (dispatch) => {
		dispatch({type: COMPLETE_AGREEMENT, agreement});
		adminApi.submitAgreement(formData,
			(agreement) => dispatch({type: SUBMIT_AGREEMENT, agreement}),
			//(agreement) => {console.log(agreement);},
			(error) => {dispatch({type: SUBMIT_AGREEMENT}); dispatchError(dispatch, error);}
		);
	}},
	fetchAttachments(page){ return (dispatch) => {
		dispatch({type: SHOW_PROCESS});
		adminApi.fetchAttachments(page,
			(original, lastPage) => {
				dispatch({type: HIDE_PROCESS});
				dispatch({type: RECEIVE_ATTACHMENTS, original, lastPage})
			},
			(error) => {
				dispatch({type: HIDE_PROCESS});
				dispatchError(dispatch, error);
			}
		);
	}},
	changePropsInAttachments(which, value){
		return {type: CHANGE_PROPS_IN_ATTACHMENTS, which, value};
	},
	toggleParsed(idxOfList, idxOfFiles, fileId, status){ return (dispatch) => {
		dispatch({type: REQUEST_TOGGLING_PARSED, idxOfList, idxOfFiles});
		adminApi.toggleParsed(fileId, status,
			() => dispatch({type: TOGGLE_PARSED, idxOfList, idxOfFiles, status}),
			(error) => {
				dispatch({type: TOGGLE_PARSED, idxOfList, idxOfFiles, status});
				dispatchError(dispatch, error);
			}
		);
	}},
	toggleAnonymity(idxOfList, idxOfFiles, fileId, status){ return (dispatch) => {
		dispatch({type: REQUEST_TOGGLING_ANONYMITY, idxOfList, idxOfFiles});
		adminApi.toggleAnonymity(fileId, status,
			() => dispatch({type: TOGGLE_ANONYMITY, idxOfList, idxOfFiles, status}),
			(error) => {
				dispatch({type: TOGGLE_ANONYMITY, idxOfList, idxOfFiles, status});
				dispatchError(dispatch, error);
			}
		);
	}}
}

export default adminActionCreators;
