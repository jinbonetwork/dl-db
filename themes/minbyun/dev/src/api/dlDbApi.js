import axios from 'axios';
import {_findProp, _isEmpty} from '../accessories/functions';

const fetch = (method, url, arg2, arg3, arg4) => {
	let data = (method == 'get' ? null : arg2);
	let succeed = (method == 'get' ? arg2 : arg3);
	let fail = (method == 'get' ? arg3 : arg4)
	axios({method: method, url: url, data: data, timeout: 60000}).then((response) => {
		if(response.statusText == 'OK'){
			if(!response.data.hasOwnProperty('error') || response.data.error == 0){
				succeed(response.data);
			} else {
				let message = (response.data.message ? response.data.message : response.data);
				console.error(message);
				fail({code: response.data.error, message: message});
			}
		} else {
			let message = 'Server response was not OK';
			console.error(message);
			fail({code: null, message: message});
		}
	});
	/*
	.catch((error) => {
		console.error('Error', error.message);
		this.setMessage(error.message, 'goBack');
	});
	*/
};

const api = {
	fetchData(method, url, arg2, arg3, arg4){
		fetch(method, url, arg2, arg3, arg4);
	},
	fetchRootData(succeed, fail){
		fetch('get', '/api', succeed, fail);
	},
	fetchDocFieldData(succeed, fail){
		fetch('get', '/api/fields', succeed, fail);
	},
	login(loginUrl, formData, succeed, fail){
		fetch('post', loginUrl, formData, () => {
			fetch('get', '/api', ({role, roles, agreement}) => {
				if(role) succeed(role, roles, agreement);
				else succeed();
			}, fail)
		}, fail);
	},
	fetchAgreement(succeed, fail){
		fetch('get', '/api/agreement', ({agreement}) => succeed(agreement), fail);
	},
	agreeWithAgreement(succeed, fail){
		fetch('post', '/api/agreement?agreement=1', null, succeed, fail);
	},
	logout(succeed, fail){
		fetch('post', '/api/logout', null, succeed, fail);
	},
	fetchDoc(id, succeed, fail){
		fetch('get', '/api/document?id='+id, ({document}) => succeed(document), fail);
	},
	submitDocForm(mode, formData, succeed, fail){
		fetch('post', '/api/document/save?mode='+mode, formData, ({did}) => succeed(parseInt(did)), fail);
	},
	upload(docId, formData, succeed, fail){
		fetch('post', '/api/file/upload?did='+docId, formData, ({files}) => succeed(files), fail);
	},
	fetchParseState(docId, succeed, fail){
		fetch('get', '/api/file/parsing_state?id='+docId, ({files}) => succeed(files), fail);
	},
	searchMember(keyword, succeed, fail){
		fetch('get', '/api/members?q='+encodeURIComponent(keyword), ({members}) => succeed(members), fail);
	},
	bookmark({docId, bmId}, succeed, fail){
		if(bmId){ // delete
			fetch('post', '/api/user/bookmark?mode=delete&bid='+bmId, null, succeed, fail);
		} else { // add
			fetch('post', '/api/user/bookmark?mode=add&did='+docId, null, succeed, fail);
		}
	},
	delelteDoc({docId}, succeed, fail){
		fetch('post', '/api/document/save?mode=delete&id='+docId, null, succeed, fail);
	},
	toggleParsed(fileId, status, succeed, fail){
		fetch('post', '/api/document/status?fid='+fileId+'&status='+status, null, succeed, fail);
	},
	fetchFileText(docId, fileId, succeed, fail){
		fetch('get', '/api/document/text?id='+docId+'&fid='+fileId, ({header, text}) => succeed({header, text}), fail);
	},
	submitFileText(docId, fileId, formData, succeed, fail){
		fetch('post', '/api/document/text?mode=modify&id='+docId+'&fid='+fileId, formData, succeed, fail);
	},
	fetchUserDocs(page, succeed, fail){
		fetch('get', '/api/user/documents?page='+page, ({result, documents}) => succeed({lastPage: result.total_page, documents}), fail);
	},
	searchDocs(params, succeed, fail){
		fetch('get', '/api/search'+params,
			({documents, result}) => succeed({documents, distribution: result.taxonomy_cnt, lastPage: result.total_page}), fail
		);
	}
}

export default api;
