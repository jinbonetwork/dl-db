import axios from 'axios';
import userFieldData from '../fieldData/userFieldData';
import {_findProp} from '../accessories/functions';

const fetchData = (method, url, arg2, arg3, arg4) => {
	let data = (method == 'get' ? null : arg2);
	let succeed = (method == 'get' ? arg2 : arg3);
	let fail = (method == 'get' ? arg3 : arg4)
	axios({method: method, url: url, data: data, timeout: 60000}).then((response) => {
		if(response.statusText == 'OK'){
			if(!response.data.error || response.data.error == 0){
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
		fetchData('get', '/api/admin/member/fields', (fData) => succeed(userFieldData.refineData(fData)), fail);
	},
	fetchUserList(page, succeed, fail){
		fetchData('get', '/api/admin/member?page='+(page ? page : 1),
			(data) => succeed(data.members, parseInt(data.result.total_page)), fail
		);
	},
	fetchUser(id, succeed, fail){
		fetchData('get', '/api/admin/member?id='+id, ({memeber}) => succeed(memeber), fail)
	},
	fetchAgreement(succeed, fail){
		fetchData('get', '/api/agreement', ({agreement}) => succeed(agreement), fail);
	}
};

export default adminApi;
