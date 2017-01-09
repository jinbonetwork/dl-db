import axios from 'axios';

const adminApi = {
	fetchData(method, url, arg2, arg3, arg4){
		let data = (method == 'get' ? null : arg2);
		let success = (method == 'get' ? arg2 : arg3);
		let fail = (method == 'get' ? arg3: arg4)
		axios({method: method, url: url, data: data, timeout: 60000}).then((response) => {
			if(response.statusText == 'OK'){
				if(!response.data.error || response.data.error == 0){
					success(response.data);
				} else {
					//let actOnClick = (response.data.error == -9999 ? 'goToLogin' : 'unset');
					let message = (response.data.message ? response.data.message : response.data);
					console.error(response.data);
					fail(message);
				}
			} else {
				let message = 'Server response was not OK';
				console.error(message);
				fail(message);
			}
		});
		/*
		.catch((error) => {
			console.error('Error', error.message);
			this.setMessage(error.message, 'goBack');
		});
		*/
	},
	fetchUserList(success, fail){
		this.fetchData('get', '/api/admin/member?page=1', ({members}) => success(members), fail);
	},
	fetchAgreement(success, fail){
		this.fetchData('get', '/api/agreement', ({agreement}) => success(agreement), fail);
	}
};

export default adminApi;
