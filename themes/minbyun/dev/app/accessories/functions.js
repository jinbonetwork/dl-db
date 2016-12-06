const _isEmpty = (value) => {
	if(value === 0) return false;
	else if(!value) return true;
	else if(typeof value !== 'object'){
		return false;
	} else if(value.length === 0){
		return true;
	} else {
		for(var p in value) {
			if(_isEmpty(value[p]) === false) return false;
		}
		return true;
	}
}
const _isEmailValid = (email) => {
	email = email.trim();
	let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}
const _isPhoneValid = (phone) => {
	phone = phone.trim();
	let re = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1}|)-?[0-9]{3,4}-?[0-9]{4}$/;
	return re.test(phone);
}
const _isDateValid = (value, form) => {
	let date = new Date();
	if(form == 'Ym'){
		if(1900 <= value.year && value.year <= date.getFullYear() && 1 <= value.month && value.month <= 12 ){
			return true;
		} else {
			return false;
		}
	} else {
		return true;
	}
}
const _displayDate = (date) => {
	let items = [];
	if(date.year) items.push(date.year);
	if(date.month) items.push(date.month);
	if(date.date) items.push(date.date);
	return items.join('/');
}
const _displayDateOfMilliseconds = (milliseconds) => {
	let regDate = new Date(milliseconds);
	let year = regDate.getFullYear();
	let month = regDate.getMonth()+1; if(month < 10) month = '0'+month;
	let date = regDate.getDate(); if(date < 10) date = '0'+date;
	return  year+'/'+month+'/'+date;
}
const _isCommon = (array1, array2, equal) => {
	if(!equal){
		for(let i in array1){
			for(let j in array2){
				if(array1[i] == array2[j]) return true;
			}
		}
		return false;
	} else {
		if(array1.length != array2.length) return false;
		for(let i in array1){
			let isEqual = false;
			for(let j in array2){
				if(array1[i] == array2[j])break;
			}
		}
	}

}
const _params = (params, excepts) => {
	let array = [];
	for(let p in params){
		if(!excepts || !excepts.length || excepts.indexOf(p) < 0){
			if(params[p]) array.push(p+'='+params[p]);
		}
	}
	if(array.length) return '?'+array.join('&');
	return '';
}
const _mapO = (obj, callBack) => {
	let array = [];
	for(let prop in obj){
		array.push(callBack(prop, obj[prop]));
	}
	return array;
};
const _forIn = (obj, callBack) => {
	let newObj = {};
	for(let prop in obj){
		newObj[prop] = callBack(prop, obj[prop]);
	}
	return newObj;
}
const _pushpull = (array, value) => {
	let newArray = [];
	array.forEach((v) => { if(v != value) newArray.push(v); });
	if(array.length === newArray.length) newArray.push(value);
	return newArray;
};

export {_isEmpty, _isEmailValid, _isPhoneValid, _isDateValid, _displayDate, _displayDateOfMilliseconds, _isCommon, _params, _mapO, _forIn, _pushpull};
