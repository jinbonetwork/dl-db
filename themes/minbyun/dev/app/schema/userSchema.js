const _emptyUser = {
	name: '',
	class: '',
	email: '',
	phone: ''
};

const _usFdAttrs = {
	name: {type: 'char', displayName: '이름', form: 'text', parent: '', multiple: false, required: true},
	class: {type: 'char', displayName: '기수', form: 'text', parent: '', multiple: false, required: false},
	email: {type: 'char', displayName: '이메일', form: 'text', parent: '', multiple: false, required: true},
	phone: {type: 'char', displayName: '전화번호', form: 'text', parent: '', multiple: false, required: true}
};

const _usFname = {
	name: 'name', class: 'class', email: 'email', phone: 'phone'
};

const _sUsFname = {
	name: 'name', class: 'class', email: 'email', phone: 'phone'
};

const _convertToUser = (sUser) => {
	let user = {};
	for(let fn in _emptyUser){
		let fAttr = _usFdAttrs[fn];
		let sValue = sUser[_sUsFname[fn]];
		if(sValue){
			user[fn] = sValue;
		} else {
			user[fn] = _emptyUser[fn];
		}
	}
	return user;
};

const _role = (sRole) => {
	if(sRole){
		const role = {
			1: 'admin', 3: 'write', 5: 'download', 7: 'view', 15: 'anonymous'
		}
		return sRole.map((r) => role[r]);
	} else {
		return null;
	}
};

export {_emptyUser, _usFdAttrs, _usFname, _sUsFname, _convertToUser, _role};
