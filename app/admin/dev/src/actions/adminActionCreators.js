import {
	REQUEST_USERLIST, RECEIVE_USERLIST,
	REQUEST_USER_FIELD_DATA, RECEIVE_USER_FIELD_DATA, CHANGE_PROPS_IN_USERS, REFINE_ROLES,
	REQUEST_AGREEMENT, RECEIVE_AGREEMENT,
	REQUEST_ADMIN_INFO, RECEIVE_ADMIN_INFO,
	CHANGE_PROPS_IN_ADMIN,
	REQUEST_LOGIN, SUCCEED_LOGIN, SHOW_LOGIN,
	SHOW_MESSAGE, HIDE_MESSAGE, SHOW_PROCESS, HIDE_PROCESS } from '../constants';
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
const adminActionCreators = {
	fetchAdminInfo(){
		return (dispatch) => {
			adminApi.fetchAdminInfo((adminInfo) => {
				dispatch({type: RECEIVE_ADMIN_INFO, adminInfo});
				dispatch({type: REFINE_ROLES, roles: adminInfo.roles});
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
	fetchUserList(page){
		return (dispatch) => {
			dispatch({type: SHOW_PROCESS});
			adminApi.fetchUserList(page,
				(userList, lastPage) => {
					dispatch({type: HIDE_PROCESS});
					dispatch({type: RECEIVE_USERLIST, userList, lastPage})
				},
				(error) => {
					dispatch({type: HIDE_PROCESS});
					dispatchError(dispatch, error);
				}
			);
		}
	},
	fetchUserFieldData(){
		return (dispatch) => {
			adminApi.fetchUserFieldData(
				(userFieldData) => dispatch({type: RECEIVE_USER_FIELD_DATA, userFieldData}),
				(error) => dispatchError(dispatch, error)
			);
		}
	},
	changePropsInUsers(which, value){
		return {type: CHANGE_PROPS_IN_USERS, which, value};
	},
	fetchAgreement(){
		return (dispatch) => {
			adminApi.fetchAgreement(
				(agreement) => dispatch({type: RECEIVE_AGREEMENT, agreement}),
				(error) => dispatchError(dispatch, error)
			);
		}
	}
}

export default adminActionCreators;
