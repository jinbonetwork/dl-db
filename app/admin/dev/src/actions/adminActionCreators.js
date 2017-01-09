import {REQUEST_USERLIST, RECEIVE_USERLIST, REQUEST_AGREEMENT, RECEIVE_AGREEMENT} from '../constants';
import adminApi from '../api/adminApi';

const adminActionCreators = {
	fetchUserList(){
		return (dispatch) => {
			dispatch({type: REQUEST_USERLIST});
			adminApi.fetchUserList(
				(userList) => dispatch({type: RECEIVE_USERLIST, success: true, userList: userList}),
				(error) => dispatch({type: RECEIVE_USERLIST, success: false})
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
