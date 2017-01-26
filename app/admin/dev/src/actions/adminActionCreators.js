import {
	RECEIVE_USER_FIELD_DATA, ADD_USER_TO_OPEN_USERS,
	RECEIVE_USERLIST, CHANGE_PROPS_IN_USERLIST,
	RECEIVE_AGREEMENT,
	RECEIVE_ADMIN_INFO,
	CHANGE_PROPS_IN_ADMIN,
	SUCCEED_LOGIN, SHOW_LOGIN,
	SHOW_MESSAGE, HIDE_MESSAGE, SHOW_PROCESS, HIDE_PROCESS,
	CHANGE_USER_PROPS, BLUR_USERFORM, SET_FOCUS_IN_USERFORM, REQUEST_SUBMIT_USERFORM,
	CHANGE_AGREEMENT} from '../constants';
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
const adminActionCreators = {
	fetchAdminInfo(){
		return (dispatch) => {
			adminApi.fetchAdminInfo((adminInfo) => {
				dispatch({type: RECEIVE_ADMIN_INFO, adminInfo});
				if(adminInfo.isAdmin) dispatchUserFieldData(dispatch);
			}, (error) => dispatchError(dispatch, error));
		}
	},
	changePropsInAdmin(which, value){
		return {type: CHANGE_PROPS_IN_ADMIN, which, value};
	},
	login(loginUrl, formData, failLogin){
		return (dispatch) => {
			adminApi.login(loginUrl, formData, (isLogedIn) => {
				if(isLogedIn){
					dispatch({type: SUCCEED_LOGIN});
					dispatchUserFieldData(dispatch);
				} else {
					dispatch({
						type: SHOW_MESSAGE,
						message: '로그인 정보가 올바르지 않습니다.',
						callback: failLogin
					});
				}
			}, (error) => dispatchError(dispatch, error));
		};
	},
	showMessage(message, callback){
		return {type: SHOW_MESSAGE, message, callback};
	},
	hideMessage(){
		return {type: HIDE_MESSAGE}
	},
	fetchUserList(page, fData){
		return (dispatch) => {
			dispatch({type: SHOW_PROCESS});
			adminApi.fetchUserList(page,
				(originalUsers, lastPage) => {
					dispatch({type: HIDE_PROCESS});
					dispatch({type: RECEIVE_USERLIST, originalUsers, lastPage})
				},
				(error) => {
					dispatch({type: HIDE_PROCESS});
					dispatchError(dispatch, error);
				}
			);
		}
	},
	changePropsInUserList(which, value){
		return {type: CHANGE_PROPS_IN_USERLIST, which, value};
	},
	addUserToOpenUsers(user){
		return {type: ADD_USER_TO_OPEN_USERS, user}
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
	submitUserForm(id, userFormData){
		return (dispatch) => {
			adminApi.submitUserForm(id, userFormData,
				(data) => {console.log(data)},
				(error) => dispatchError(dispatch, error)
			);
		};
	},
	fetchAgreement(){
		return (dispatch) => {
			adminApi.fetchAgreement(
				(agreement) => dispatch({type: RECEIVE_AGREEMENT, agreement}),
				(error) => dispatchError(dispatch, error)
			);
		}
	},
	changeAgreement(editorState){
		return {type: CHANGE_AGREEMENT, editorState};
	}
}

export default adminActionCreators;
