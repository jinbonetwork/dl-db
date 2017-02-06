import axios from 'axios';
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
	/*
	.catch((error) => {
		console.error('Error', error.message);
		this.setMessage(error.message, 'goBack');
	});
	*/
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
			(data) => succeed(data.files, parseInt(data.files.total_page)), fail
		);
	},
	fetchUser(id, succeed, fail){
		fetchData('get', '/api/admin/member?id='+id, ({member}) => succeed(member), fail);
	},
	deleteUsers(formData, succeed, fail){
		fetchData('post', '/api/admin/member/save?mode=delete', formData, succeed, fail);
	},
	submitUserForm(userFormData, succeed, fail){
		fetchData('post', '/api/admin/member/save?mode=modify', userFormData, ({member}) => succeed(member), fail);
	},
	submitNewUserForm(userFormData, succeed, fail){
		fetchData('post', '/api/admin/member/save?mode=add', userFormData, ({member}) => succeed(member), fail);
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
		let anonymity = (status ? 1 : 0);
		fetchData('post', '/api/document/anonymity?fid='+fileId+'&anonymity='+anonymity, null, succeed, fail);
	}
};

export default adminApi;
