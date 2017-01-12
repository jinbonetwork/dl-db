import {REQUEST_USERLIST, RECEIVE_USERLIST,
		REQUEST_USER_FIELD_DATA, RECEIVE_USER_FIELD_DATA,
		REQUEST_AGREEMENT, RECEIVE_AGREEMENT,
		REQUEST_ADMIN_INFO, RECEIVE_ADMIN_INFO} from '../constants';
import adminApi from '../api/adminApi';

const adminActionCreators = {
	fetchAdminInfo(){
		return (dispatch) => {
			dispatch({type: REQUEST_ADMIN_INFO});
			adminApi.fetchAdminInfo(
				(adminInfo) => dispatch({type: RECEIVE_ADMIN_INFO, success: true, adminInfo: adminInfo}),
				(error) => dispatch({type: RECEIVE_ADMIN_INFO, success: false})
			);
		}
	},
	fetchUserList(page){
		return (dispatch) => {
			dispatch({type: REQUEST_USERLIST});
			console.log(page);
			adminApi.fetchUserList(page,
				(userList) => dispatch({type: RECEIVE_USERLIST, success: true, userList: userList}),
				(error) => dispatch({type: RECEIVE_USERLIST, success: false})
			);
		}
	},
	fetchUserFieldData(){
		return (dispatch) => {
			dispatch({type: REQUEST_USER_FIELD_DATA});
			adminApi.fetchUserFieldData(
				(userFieldData) => dispatch({type: RECEIVE_USER_FIELD_DATA, success: true, userFieldData: userFieldData}),
				(error) => dispatch({type: RECEIVE_USER_FIELD_DATA, success: false})
			);
		}
	},
	fetchAgreement(){
		return (dispatch) => {
			dispatch({type: REQUEST_AGREEMENT});
			adminApi.fetchAgreement(
				(agreement) => dispatch({type: RECEIVE_AGREEMENT, success: true, agreement: agreement}),
				(error) => dispatch({type: RECEIVE_AGREEMENT,  success: false})
			);
		}
	}
}

export default adminActionCreators;
