import {refineFieldData, refineDoc, makeDocFormData} from '../accessories/docManager/refiner';
import update from 'react-addons-update';
import {_forIn, _mapOO} from '../accessories/functions';

export const initUsrFData = {
	empty: {id: 0, uid: 0, name: '', class: '', email: '', phone: '', password: '', confirmPw: ''},
	fProps: {
		id: {type: 'meta', form: 'number'}, uid: {type: 'meta', form: 'number'},
		name: {type: 'char', dispName: '이름', form: 'text', parent: '', children: [], multiple: false, required: true},
		class: {type: 'char', dispName: '기수', form: 'text', parent: '', children: [], multiple: false, required: false},
		email: {type: 'email', dispName: '이메일', form: 'text', parent: '', children: [], multiple: false, required: true},
		phone: {type: 'phone', dispName: '전화번호', form: 'text', parent: '', children: [], multiple: false, required: false},
		password: {type: 'password', dispName: '비밀번호', form: 'text', parent: '', children: [], multiple: false, required: true},
		confirmPw: {type: 'password', dispName: '비밀번호 확인', form: 'text', parent: '', children: [], multiple: false, required: true}
	},
	fSlug: {id: 'id', uid: 'uid', name: 'name', class: 'class', email: 'email', phone: 'phone', password: 'password', password_confirm: 'confirmPw'},
	fID: {id: 'id', uid: 'uid', name: 'name', class: 'class', email: 'email', phone: 'phone', password: 'password', confirmPw: 'password_confirm'},
	taxonomy: {},
	terms: {},
	roles: {}
};

const rearrangeUser = (user) => {
	let newUser = {}
	for(let pn in user){
		if(pn != 'password' && pn != 'confirmPw') newUser[pn] = user[pn];
	}
	newUser.password = user.password;
	newUser.confirmPw = user.confirmPw;
	return newUser;
};
export const refineUserFData = (fData) => {
	let newFData = refineFieldData(fData, initUsrFData);
	return update(newFData, {empty: {$apply: (value) => rearrangeUser(value)}});
};
export const refineUser = (user, fData) => {
	return rearrangeUser(refineDoc(user, fData));
};
export const makeUserFormData = (user, fData) => {
	return makeDocFormData('member', user, fData);
};
