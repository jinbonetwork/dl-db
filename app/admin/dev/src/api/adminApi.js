import axios from 'axios';
import {polyfill} from 'es6-promise';
import {_findProp, _isEmpty} from '../accessories/functions';

const fetchData = (method, url, arg2, arg3, arg4) => {
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
};

const isAdmin = ({role, roles}) => {
	return (role ? role.indexOf(parseInt(_findProp(roles, 'administrator'))) >= 0 : false);
};
const deleteOneDoc = (docId, succeed, fail) => {
	fetchData('post', 'api/document/save?mode=delete&id='+docId, null, succeed, fail);
};
const adminApi = {
	fetchAdminInfo(succeed, fail){
		fetchData('get', '/api', ({role, roles, sessiontype}) => {
			succeed({
				isAdmin: isAdmin({role, roles}),
				loginType: sessiontype
			});
		}, fail);
	},
	login(loginUrl, formData, succeed, fail){
		fetchData('post', loginUrl, formData, () => {
			fetchData('get', '/api', ({role, roles}) => {
				if(isAdmin({role, roles})){
					succeed(true);
				} else {
					if(role){
						fetchData('post', '/api/logout', null, () => succeed(false), fail);
					} else {
						succeed(false);
					}
				}
			}, fail)
		}, fail);
	},
	fetchUserFieldData(succeed, fail){
		fetchData('get', '/api/admin/member/fields',(fData) => succeed(fData), fail);
	},
	fetchDocFieldData(succeed, fail){
		fetchData('get', '/api/fields', (fData) => succeed(fData), fail);
	},
	fetchUserList(params, succeed, fail){
		const {param1, param2, param3, param4} = params;
		let options = 'page=1';
		if(param1 == 'page'){
			options = 'page='+param2;
		}
		else if(param1 && param2){
			options = 's_mode='+param1+'&s_args='+param2+'&page=';
			if(param3 == 'page' && param4 > 0) options += param4; else options += '1';
		}
		fetchData('get', '/api/admin/member?'+options,
			(data) => succeed(data.members, parseInt(data.result.total_page)), fail
		);
	},
	fetchAttachments(params, succeed, fail){
		const {param1, param2, param3, param4} = params;
		let options = 'page=1';
		if(param1 == 'page'){
			options = 'page='+param2;
		}
		else if(param1 && param2){
			options = 's_mode='+param1+'&s_args='+param2+'&page=';
			if(param3 == 'page' && param4 > 0) options += param4; else options += '1';
		}
		fetchData('get', '/api/admin/files?'+options,
			(data) => succeed(data.files, parseInt(data.result.total_page)), fail
		);
	},
	fetchUser(id, succeed, fail){
		fetchData('get', '/api/admin/member?id='+id, ({member}) => succeed(member), fail);
	},
	deleteUsers(formData, succeed, fail){
		fetchData('post', '/api/admin/member/save?mode=delete', formData, succeed, fail);
	},
	submitUserForm(mode, userFormData, succeed, fail){
		fetchData('post', '/api/admin/member/save?mode='+mode, userFormData, ({member}) => succeed(member), fail);
	},
	fetchAgreement(succeed, fail){
		fetchData('get', '/api/admin/agreement', ({agreement}) => succeed(agreement), fail);
	},
	submitAgreement(formData, succeed, fail){
		fetchData('post', '/api/admin/agreement?mode=modify', formData, ({agreement}) => succeed(agreement), fail);
	},
	toggleParsed(fileId, status, succeed, fail){
		fetchData('post', '/api/document/status?fid='+fileId+'&status='+status, null, succeed, fail);
	},
	toggleAnonymity(fileId, status, succeed, fail){
		fetchData('post', '/api/document/anonymity?fid='+fileId+'&anonymity='+(status ? 1 : 0), null, succeed, fail);
	},
	fetchFileText(which, docId, fileId, succeed, fail){
		if(which == 'text'){
			fetchData('get', '/api/document/text?id='+docId+'&fid='+fileId, ({header, text}) => succeed({header, text}), fail);
		}
		else if(which == 'file'){
			fetchData('get', '/api/admin/files?fid='+fileId, ({file}) => succeed(file), fail);
		}
	},
	submitFileText(docId, fileId, formData, succeed, fail){
		fetchData('post', '/api/document/text?mode=modify&id='+docId+'&fid='+fileId, formData, succeed, fail);
	},
	upload({fileId, docId, formData}, succeed, fail){
		fetchData('post', '/api/file/upload?did='+docId+'&fid='+fileId, formData, ({files}) => succeed(files), fail);
	},
	fetchParseState(strFids, succeed, fail){
		fetchData('get', '/api/file/parsing_state?fid='+strFids, ({files}) => succeed(files), fail);
	},
	fetchStats({page}, succeed, fail){
		fetchData('get', '/api/admin/stats?page='+(page ? page : 1),
			(data) => succeed({numDocList: data.members, lastPage: parseInt(data.result.total_page)}),
			fail
		);
	},
	logout(succeed, fail){
		fetchData('post', '/api/logout', null, succeed, fail);
	}
};

export default adminApi;
