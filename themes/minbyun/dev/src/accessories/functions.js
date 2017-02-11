const _isEmpty = (value) => {
	if(value === 0) return false;
	else if(!value) return true;
	else if(typeof value !== 'object'){
		return false;
	} else if(Array.isArray(value) && value.length === 0){
		return true;
	} else {
		for(var p in value) {
			if(_isEmpty(value[p]) === false) return false;
		}
		return true;
	}
};
const _isEmailValid = (email) => {
	let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email.trim());
};
const _isPhoneValid = (phone) => {
	let re = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1}|)-?[0-9]{3,4}-?[0-9]{4}$/;
	return re.test(phone.trim());
};
const _isDateValid = (value, form) => {
	if(form == 'Ym'){
		if(value.year > 0 && 1 <= value.month && value.month <= 12 ){
			return true;
		} else {
			return false;
		}
	}
	else if(form == 'text'){ // 형식: 2016-12-07
		let dateArray = value.split('-');
		if(dateArray.length != 3) return false;
		if(dateArray[0] > 0); else return false;
		if(1 <= dateArray[1] && dateArray[1] <= 12 && dateArray[1].length == 2); else return false;
		if(1 <= dateArray[2] && dateArray[2] <= 31 && dateArray[2].length == 2); else return false;
		return true;
	}
};
const _displayDate = (date) => {
	let items = [];
	if(date.year) items.push(date.year);
	if(date.month) items.push(date.month);
	if(date.date) items.push(date.date);
	return items.join('/');
};
const _displayDateOfMilliseconds = (milliseconds) => {
	let regDate = new Date(milliseconds);
	let year = regDate.getFullYear();
	let month = regDate.getMonth()+1; if(month < 10) month = '0'+month;
	let date = regDate.getDate(); if(date < 10) date = '0'+date;
	return  year+'/'+month+'/'+date;
};
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
				if(array1[i] == array2[j]){isEqual = true; break;}
			}
			if(!isEqual) return false;
		}
		return true;
	}
};
const _mapO = (obj, callBack) => { // object -> array
	let array = [];
	for(let prop in obj){
		array.push(callBack(prop, obj[prop]));
	}
	return array;
};
const _mapAO = (array, callBacks) => { // array -> object
	let object = {};
	for(let i in array){
		object[array[i]] = callBacks(array[i]);
	}
	return object;
};
const _mapOO = (obj, callBack, mapPropName) => { // object -> object
	let newObj = {};
	for(let prop in obj){
		if(!mapPropName){
			newObj[prop] = callBack(prop, obj[prop]);
		} else {
			let newPn = mapPropName(prop, obj[prop]);
			if(newPn) newObj[newPn] = callBack(prop, obj[prop]);
		}
	}
	return newObj;
};
const _forIn = (obj, callBack) => {
	for(let pn in obj){
		let rtn = callBack(pn, obj[pn]);
		if(rtn === false) break;
	}
};
const _delete = (obj, prop) => {
	let newObj = {};
	for(let pn in obj){
		if(pn != prop) newObj[pn] = obj[pn];
	}
	return newObj;
}
const _findProp = (obj, propValue) => {
	for(let pn in obj){
		if(obj[pn] == propValue) return pn;
	}
};
const _copyOf = (obj, excludeNull) => {
	if(Array.isArray(obj)){
		let array = [];
		for(let i in obj){
			if(excludeNull){
				if(obj[i]) array.push(obj[i]);
			} else {
				array[i] = obj[i];
			}
		}
		return array;
	} else {
		let newObj = {};
		for(let pn in obj){
			if(!excludeNull || obj[pn]) newObj[pn] = obj[pn];
		}
		return newObj;
	}
};
const _pushpull = (array, value) => {
	let newArray = [];
	array.forEach((v) => { if(v != value) newArray.push(v); });
	if(array.length === newArray.length) newArray.push(value);
	return newArray;
};
const _interpolate = (x, y0, y1, x0, x1, unit) => {
	if(x > x1) return null;
	else if(x < x0) x = x0;
	let y = y0 + (y1 - y0)*(x - x0)/(x1 - x0);
	return (unit ? y+unit : y);
};
const _notNull = (values) => {
	for(let i in values){
		if(values[i] !== null && values[i] !== false && values[i] !== undefined){
			return values[i];
		}
	}
	return null;
};
const _wrap = (callBack) => {
	return callBack();
};
const _padNumber = (number, digits) => {
	let strNumber = '' + number;
	for(let i = digits, len = strNumber.length; i > len; i--){
		strNumber = '0'+strNumber;
	}
	return strNumber;
};

export {_isEmpty, _isEmailValid, _isPhoneValid, _isDateValid, _displayDate, _displayDateOfMilliseconds, _isCommon, _mapO, _mapAO, _mapOO, _forIn, _delete, _findProp, _copyOf, _pushpull, _interpolate, _notNull, _wrap, _padNumber};
