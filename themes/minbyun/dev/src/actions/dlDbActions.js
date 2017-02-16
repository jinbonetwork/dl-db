import { SHOW_MESSAGE, HIDE_MESSAGE, RECEIVE_USER_FIELD_DATA, RECEIVE_DOC_FIELD_DATA, RECEIVE_ROOT_DATA,
	SHOW_PROCESS, HIDE_PROCESS, CHANGE_LOGIN, RESIZE, SUCCEED_LOGIN, RECEIVE_AGREEMENT, AGREE_WITH_AGREEMENT,
	LOGOUT, CHANGE_SEARCHBAR_STATE, CHANGE_DOCFORM, FOCUSIN_DOCFORM, FOCUSOUT_DOCFORM, COMPLETE_DOCFORM, SUBMIT_DOCFORM,
	ADD_DOC_TO_OPEN_DOCS, UPLOAD, RECEIVE_PARSE_STATE, RENEW_FILE_STATUS, BOOKMARK, TOGGLE_DEL_DOC_BUTTON,
	DELETE_DOC_IN_OPEN_DOCS, CHANGE_FILETEXT, RECEIVE_FILETEXT, COMPLETE_FILETEXT, SUBMIT_FILETEXT, REQUEST_TOGGLING_PARSED_OF_FILE,
	TOGGLE_PARSED_OF_FILE
} from '../constants';
import api from '../api/dlDbApi';
import update from 'react-addons-update';
import {refineDocFData, refineDoc, refineFile} from '../fieldData/docFieldData';
import {_isEmpty} from '../accessories/functions';

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
	}},
	logout({afterLogout}){ return (dispatch) => {
		dispatch({type: SHOW_PROCESS});
		api.logout(
			() => {
				dispatch({type: HIDE_PROCESS});
				dispatch({type: LOGOUT});
				if(afterLogout) afterLogout();
			},
			(error) => {
				dispatch({type: HIDE_PROCESS});
				dispatchError(dispatch, error);
			}
		);
	}},
	changeSearchBarState(value){
		return {type: CHANGE_SEARCHBAR_STATE, value};
	},
	changeDocForm(args){
		return {type: CHANGE_DOCFORM, args};
	},
	focusOutDocForm(){
		return {type: FOCUSOUT_DOCFORM};
	},
	focusInDocForm(fSlug, index){
		return {type: FOCUSIN_DOCFORM, fSlug, index};
	},
	fetchDoc(id, callback){ return (dispatch) => {
		dispatch({type: SHOW_PROCESS});
		api.fetchDoc(id,
			(doc) => {
				dispatch({type: HIDE_PROCESS});
				dispatch({type: ADD_DOC_TO_OPEN_DOCS, doc});
				if(typeof callback === 'function') callback();
			},
			(error) => {
				dispatch({type: HIDE_PROCESS});
				dispatchError(dispatch, error);
			}
		);
	}},
	submitDocForm(args){ return (dispatch) => {
		const {doc, oldDoc, files, oldFiles, docFormData, fileFormData, afterUpload} = args;
		let submitMode = (doc.id > 0 ? 'modify' : 'add');
		let mergedDoc = update(doc, {$merge: files});
		dispatch({type: COMPLETE_DOCFORM, doc: mergedDoc});
		dispatch({type: CHANGE_DOCFORM, args: {mode: 'merge', value: files}});
		api.submitDocForm( submitMode, docFormData,
			(docId) => {
				if(submitMode == 'add'){
					let docWithId = update(mergedDoc, {$merge: {id: docId}});
					dispatch({type: ADD_DOC_TO_OPEN_DOCS, doc: docWithId, doRefine: false});
					dispatch({type: CHANGE_DOCFORM, args: {mode: 'merge', value: {id: docId}}});
				}
				dispatch({type: SUBMIT_DOCFORM});
				api.upload(docId, fileFormData,
					(files) => {
						dispatch({type: UPLOAD, docId, files});
						afterUpload(docId);
					},
					(error) => {
						let oldDoc = update(doc, {$merge: oldFiles});
						dispatch({type: COMPLETE_DOCFORM, doc: oldDoc});
						dispatch({type: CHANGE_DOCFORM, args: {mode: 'merge', value: oldFiles}});
						dispatchError(dispatch, error);
					}
				);
			},
			(error) => {
				dispatch({type: COMPLETE_DOCFORM, doc: oldDoc});
				dispatch({type: CHANGE_DOCFORM, args: {mode: 'merge', value: oldDoc}});
				dispatchError(dispatch, error);
			}
		);
	}},
	setParseState(parseState){
		return {type: RECEIVE_PARSE_STATE, parseState};
	},
	fetchParseState({docId, afterReceive}){ return (dispatch) => {
		api.fetchParseState(docId,
			(parseState) => afterReceive(parseState),
			(error) => dispatchError(dispatch, error)
		);
	}},
	renewFileStatus({docId, filesWithNewStatus}){
		return {type: RENEW_FILE_STATUS, docId, filesWithNewStatus};
	},
	searchMember({keyword, afterSearch}){ return (dispatch) => {
		api.searchMember(keyword,
			(members) => afterSearch(members),
			(error) => dispatchError(dispatch, error)
		);
	}},
	bookmark({docId, bmId}){ return (dispatch) => {
		let mode = (bmId ? 'delete' : 'add');
		dispatch({type: BOOKMARK, docId, bmId: -1})
		api.bookmark({docId, bmId},
			({bid}) => {
				if(mode == 'delete') dispatch({type: BOOKMARK, docId, bmId: 0});
				else dispatch({type: BOOKMARK, docId, bmId: bid});
			},
			(error) => {
				dispatch({type: BOOKMARK, docId, bmId})
				dispatchError(dispatch, error);
			}
		);
	}},
	toggleDelDocButton(){
		return {type: TOGGLE_DEL_DOC_BUTTON};
	},
	delelteDoc({docId, afterDelete}){ return (dispatch) => {
		dispatch({type: SHOW_PROCESS});
		api.delelteDoc({docId},
			() => {
				dispatch({type: HIDE_PROCESS});
				dispatch({type: DELETE_DOC_IN_OPEN_DOCS, docId});
				if(afterDelete) afterDelete();
			},
			(error) => {
				dispatch({type: HIDE_PROCESS});
				dispatchError(dispatch, error);
			}
		);
	}},
	fetchFileText(docId, fileId, callback){ return (dispatch) => {
		dispatch({type: SHOW_PROCESS});
		api.fetchFileText(docId, fileId,
			(fileText) => {
				dispatch({type: HIDE_PROCESS});
				dispatch({type: RECEIVE_FILETEXT, fileId, fileText});
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
	submitFileText({docId, fileId, text, formData, oldText}){ return (dispatch) => {
		dispatch({type: COMPLETE_FILETEXT, fileId, text});
		api.submitFileText(docId, fileId, formData,
			() => dispatch({type: SUBMIT_FILETEXT}),
			(error) => {dispatch({type: SUBMIT_FILETEXT, fileId, text: oldText}); dispatchError(dispatch, error);}
		);
	}},
	toggleParsedOfFile(fileId, oldStatus){ return (dispatch) => {
		dispatch({type: REQUEST_TOGGLING_PARSED_OF_FILE});
		let status = (oldStatus == 'parsed' ? 'unparsed' : 'parsed');
		api.toggleParsed(fileId, status,
			() => dispatch({type: TOGGLE_PARSED_OF_FILE, fileId, status}),
			(error) => {
				dispatch({type: TOGGLE_PARSED_OF_FILE, fileId, status: oldStatus});
				dispatchError(dispatch, error);
			}
		);
	}}
}

export default actionCreators;
