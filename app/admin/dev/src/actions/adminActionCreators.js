import {
	RECEIVE_USERLIST, REFINE_USERDATA,
	RECEIVE_USER_FIELD_DATA, CHANGE_PROPS_IN_USERLIST, REFINE_ROLES,
	RECEIVE_AGREEMENT,
	RECEIVE_ADMIN_INFO,
	CHANGE_PROPS_IN_ADMIN,
	SUCCEED_LOGIN, SHOW_LOGIN,
	SHOW_MESSAGE, HIDE_MESSAGE, SHOW_PROCESS, HIDE_PROCESS,
 	RECEIVE_USER} from '../constants';
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
		(userFieldData) => {
			dispatch({type: RECEIVE_USER_FIELD_DATA, userFieldData}),
			dispatch({type: REFINE_USERDATA, userFieldData})
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
	changePropsInUserList(which, value){
		return {type: CHANGE_PROPS_IN_USERLIST, which, value};
	},
	fetchUser(id, list){
		let user = list.find((usr) => (usr.id == id));
		if(user){
			return {type: RECEIVE_USER, user}
		} else {
			return (dispatch) => {
				dispatch({type: SHOW_PROCESS});
				adminApi.fetchUser(id,
					(user) => {
						dispatch({type: HIDE_PROCESS});
						dispatch({type: RECEIVE_USER, user})
					},
					(error) => {
						dispatch({type: HIDE_PROCESS});
						dispatchError(dispatch, error);
					}
				);
			};
		}
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
