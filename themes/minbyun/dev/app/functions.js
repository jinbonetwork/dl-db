let functions = {
	isEmpty(value){
		if(!value) return true;
		if(value.length == 0) return true;
		for(var p in value) {
			if(value.hasOwnProperty(p) && value[p]) return false;
		}
		return true;
	},
	isEmailValid(email){
		email = email.trim();
		let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	},
	isPhoneValid(phone){
		phone = phone.trim();
		let re = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1}|)-?[0-9]{3,4}-?[0-9]{4}$/;
		return re.test(phone);
	},
	isDateValid(value, form){
		let date = new Date();
		if(form == 'Ym'){
			if(1970 <= value.year && value.year <= date.getFullYear() && 1 <= value.month && value.month <= 12 ){
				return true;
			} else {
				return false;
			}
		} else {
			return true;
		}
	},
	displayDate(date){
		let items = [];
		if(date.year) items.push(date.year);
		if(date.month) items.push(date.month);
		if(date.date) items.push(date.date);
		return items.join('/');
	}
}

export default functions;
