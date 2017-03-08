import {
	RECEIVE_USER_FIELD_DATA, RECEIVE_DOC_FIELD_DATA, ADD_USER_TO_OPEN_USERS, RECEIVE_USERLIST, CHANGE_PROPS_IN_USERLIST,
	RECEIVE_AGREEMENT, RECEIVE_ADMIN_INFO, CHANGE_PROPS_IN_ADMIN, SUCCEED_LOGIN, SHOW_LOGIN, SHOW_MESSAGE, HIDE_MESSAGE,
	SHOW_PROCESS, HIDE_PROCESS, CHANGE_PROPS_IN_USER, CHANGE_USER_PROPS, BLUR_USERFORM, SET_FOCUS_IN_USERFORM,
	COMPLETE_USERFORM, SUBMIT_USERFORM, CHANGE_AGREEMENT, COMPLETE_AGREEMENT, SUBMIT_AGREEMENT, RECEIVE_ATTACHMENTS,
	CHANGE_PROPS_IN_ATTACHMENTS, REQUEST_TOGGLING_PARSED, TOGGLE_PARSED, REQUEST_TOGGLING_ANONYMITY, TOGGLE_ANONYMITY,
	SHOW_PASSWORD, DELETE_USERS, RECEIVE_FILETEXT, CHANGE_FILETEXT, ADD_FILE_TO_OPEN_FILETEXTS, COMPLETE_FILETEXT,
	SUBMIT_FILETEXT, REQUEST_TOGGLING_PARSED_OF_FILE, TOGGLE_PARSED_OF_FILE, REQUEST_REGISTER, REGISTER, REQUEST_UPLOAD,
	UPLOAD, RECEIVE_PARSE_STATE, RENEW_ATTACH_STATE, RECEIVE_STATS
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
	fetchUserList(params, options){ return (dispatch) => {
		if(!options || !options.noSpinner) dispatch({type: SHOW_PROCESS});
		adminApi.fetchUserList(params,
			(originalUsers, lastPage) => {
				if(!options || !options.noSpinner) dispatch({type: HIDE_PROCESS});
				dispatch({type: RECEIVE_USERLIST, originalUsers, lastPage})
			},
			(error) => {
				if(!options || !options.noSpinner) dispatch({type: HIDE_PROCESS});
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
	fetchUser(id, callback){ return (dispatch) => {
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
	}},
	deleteUsers(userIds, formData, callback){ return (dispatch) => {
		if(!Array.isArray(userIds)) dispatch({type: SHOW_PROCESS});
		adminApi.deleteUsers(formData,
			() => {
				if(!Array.isArray(userIds)) dispatch({type: HIDE_PROCESS});
				dispatch({type: DELETE_USERS, userIds});
				callback();
			},
			(error) => {
				if(!Array.isArray(userIds)) dispatch({type: HIDE_PROCESS});
				dispatchError(dispatch, error);
			}
		);
	}},
	changeUserProps(args){
		return {type: CHANGE_USER_PROPS, args};
	},
	setFocus(fSlug, index){
		return {type: SET_FOCUS_IN_USERFORM, fSlug, index}
	},
	blurUserForm(){
		return {type: BLUR_USERFORM};
	},
	submitUserForm(user, userFormData, oldUser, callback){ return (dispatch) => {
		dispatch({type: COMPLETE_USERFORM, user});
		adminApi.submitUserForm((user.id > 0 ? 'modify' : 'add'), userFormData,
			(user) => {
				dispatch({type: SUBMIT_USERFORM, user});
				if(typeof callback === 'function') callback(user.id);
			},
			(error) => {dispatch({type: COMPLETE_USERFORM, user: oldUser}); dispatchError(dispatch, error)}
		);
	}},
	showPassword(state){
		return {type: SHOW_PASSWORD, state}
	},
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
	submitAgreement(agreement, formData, oldAgreement){ return (dispatch) => {
		dispatch({type: COMPLETE_AGREEMENT, agreement});
		adminApi.submitAgreement(formData,
			() => dispatch({type: SUBMIT_AGREEMENT}),
			(error) => {dispatch({type: COMPLETE_AGREEMENT, agreement: oldAgreement}); dispatchError(dispatch, error);}
		);
	}},
	fetchAttachments(params){ return (dispatch) => {
		dispatch({type: SHOW_PROCESS});
		adminApi.fetchAttachments(params,
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
	toggleParsed(idxOfFiles, fileId, status){ return (dispatch) => {
		dispatch({type: REQUEST_TOGGLING_PARSED, idxOfFiles});
		adminApi.toggleParsed(fileId, status,
			() => dispatch({type: TOGGLE_PARSED, idxOfFiles, status}),
			(error) => {
				dispatch({type: TOGGLE_PARSED, idxOfFiles, status});
				dispatchError(dispatch, error);
			}
		);
	}},
	toggleAnonymity(idxOfFiles, fileId, status){ return (dispatch) => {
		dispatch({type: REQUEST_TOGGLING_ANONYMITY, idxOfFiles});
		adminApi.toggleAnonymity(fileId, status,
			() => dispatch({type: TOGGLE_ANONYMITY, idxOfFiles, status}),
			(error) => {
				dispatch({type: TOGGLE_ANONYMITY, idxOfFiles, status});
				dispatchError(dispatch, error);
			}
		);
	}},
	addFileToOpenFileTexts(fileId, file){
		return {type: ADD_FILE_TO_OPEN_FILETEXTS, fileId, file};
	},
	fetchFileText(which, docId, fileId, callback){ return (dispatch) => {
		dispatch({type: SHOW_PROCESS});
		adminApi.fetchFileText(which, docId, fileId,
			(data) => {
				dispatch({type: HIDE_PROCESS});
				dispatch({type: RECEIVE_FILETEXT, which, fileId, data});
				if(typeof callback === 'function') callback();
			},
			(error) => {
				dispatch({type: HIDE_PROCESS});
				dispatchError(dispatch, error);
			}
		);
	}},
	changeFileText(fileText){
		return {type: CHANGE_FILETEXT, fileText};
	},
	submitFileText(docId, fileId, text, formData, oldText){ return (dispatch) => {
		dispatch({type: COMPLETE_FILETEXT, fileId, text});
		adminApi.submitFileText(docId, fileId, formData,
			() => dispatch({type: SUBMIT_FILETEXT}),
			(error) => {dispatch({type: COMPLETE_FILETEXT, fileId, text: oldText}); dispatchError(dispatch, error);}
		);
	}},
	toggleParsedOfFile(fileId, status){ return (dispatch) => {
		dispatch({type: REQUEST_TOGGLING_PARSED_OF_FILE});
		adminApi.toggleParsed(fileId, status,
			() => dispatch({type: TOGGLE_PARSED_OF_FILE, fileId, status}),
			(error) => {
				dispatch({type: TOGGLE_PARSED_OF_FILE, fileId, status});
				dispatchError(dispatch, error);
			}
		);
	}},
	upload({idxOfFiles, file, newFile, formData}){ return (dispatch) => {
		dispatch({type: REQUEST_UPLOAD, idxOfFiles, newFile});
		adminApi.upload(
			{fileId: file.fileId, docId: file.docId, formData},
			(files) => dispatch({type: UPLOAD, idxOfFiles, files}),
			(error) => dispatchError(dispatch, error)
		);
	}},
	fetchParseState({strFids, afterReceive}){ return (dispatch) => {
		adminApi.fetchParseState(strFids,
			(parseState) => {
				dispatch({type: RECEIVE_PARSE_STATE, parseState});
				afterReceive(parseState);
			},
			(error) => dispatchError(dispatch, error)
		);
	}},
	renewAttachState({completions}){
		return {type: RENEW_ATTACH_STATE, completions};
	},
	fetchStats({page}){ return (dispatch) => {
		dispatch({type: SHOW_PROCESS});
		adminApi.fetchStats(
			{page},
			({numDocList, lastPage}) => {
				dispatch({type: HIDE_PROCESS});
				dispatch({type: RECEIVE_STATS, numDocList, lastPage});
			},
			(error) => {
				dispatch({type: HIDE_PROCESS});
				dispatchError(dispatch, error);
			}
		);
	}},
	logout({afterLogout}){ return (dispatch) => {
		dispatch({type: SHOW_PROCESS});
		adminApi.logout(
			() => {
				dispatch({type: HIDE_PROCESS});
				if(afterLogout) afterLogout();
			},
			(error) => {
				dispatch({type: HIDE_PROCESS});
				dispatchError(dispatch, error);
			}
		);
	}}
}

export default adminActionCreators;
