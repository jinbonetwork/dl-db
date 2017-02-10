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

const api = {
	fetchRootData(succeed, fail){
		fetchData('get', '/api', succeed, fail);
	},
	fetchUserFieldData(succeed, fail){
		fetchData('get', '/api/admin/member/fields', succeed, fail);
	},
	fetchDocFieldData(succeed, fail){
		fetchData('get', '/api/fields', succeed, fail);
	},
	login(loginUrl, formData, succeed, fail){
		fetchData('post', loginUrl, formData, () => {
			fetchData('get', '/api', ({role, roles, agreement}) => {
				if(role) succeed(role, roles, agreement);
				else succeed();
			}, fail)
		}, fail);
	},
	fetchAgreement(succeed, fail){
		fetchData('get', '/api/agreement', ({agreement}) => succeed(agreement), fail);
	},
	agreeWithAgreement(succeed, fail){
		fetchData('post', '/api/agreement?agreement=1', null, succeed, fail);
	},
	logout(succeed, fail){
		fetchData('post', '/api/logout', null, succeed, fail);
	}
}

export default api;
