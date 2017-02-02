import {refineFieldData, refineDoc, makeFormData} from '../accessories/docManager/refiner';
import update from 'react-addons-update';
import {_forIn, _delete} from '../accessories/functions';

export const initUsrFData = {
	empty: {id: 0, uid: 0, license: false, name: '', class: '', email: '', phone: '', role: [], password: ''},
	fProps: {
		id: {type: 'meta', form: 'number'},
		uid: {type: 'meta', form: 'number', dispName: '등록여부'},
		license: {type: 'meta', form: 'bool'},
		name: {type: 'char', dispName: '이름', form: 'text', parent: '', children: [], multiple: false, required: true},
		class: {type: 'char', dispName: '구분', form: 'text', parent: '', children: [], multiple: false, required: false},
		email: {type: 'email', dispName: '이메일', form: 'text', parent: '', children: [], multiple: false, required: false},
		phone: {type: 'phone', dispName: '전화번호', form: 'text', parent: '', children: [], multiple: false, required: false},
		role: {type: 'role', dispName: '권한', form: 'check', parent: '', children: [], multiple: false, required: false},
		password: {type: 'password', dispName: '비밀번호', form: 'text', parent: '', children: [], multiple: false, required: false}
	},
	fSlug: {id: 'id', uid: 'uid', license: 'license', name: 'name', class: 'class', email: 'email', phone: 'phone', role: 'role', password: 'password'},
	fID: {id: 'id', uid: 'uid', license: 'license', name: 'name', class: 'class', email: 'email', phone: 'phone', role: 'role', password: 'password'},
	taxonomy: {},
	terms: {},
	roles: {}
};

const custom = {
	refineFData: {
		roles: (roles) => {
			const roleNames = {
				administrator: '관리자',
				write: '쓰기',
				download: '다운로드',
				view: '읽기'
			};
			let newRoles = {};
			_forIn(roles, (pn, pv) => {
				if(roleNames[pv]) newRoles[pn] = roleNames[pv];
			});
			return newRoles;
		}
	},
	refineDocBySlug: {
		role: (slug, value, fProp) => (value)
	},
	refineDocByType: {
		//something: (slug, value, fProp) => {}
	},
	refineDocToSubmitBySlug: {
		role: (slug, value, fProp) => (value)
	},
	refineDocToSubmitByType: {
		//something: (slug, value, fProp) => {}
	}
};

export const refineUserFData = (fData) => {
	return refineFieldData(fData, initUsrFData, custom.refineFData);
};
export const refineUserList = (original, {fID, fProps}) => {
	return original.map((item) => ({
		id: parseInt(item[fID.id]),
		name: item[fID.name],
		class: item[fID.class],
		email: item[fID.email],
		phone: item[fID.phone],
		uid: (item[fID.uid] > 0 ? '등록' : '')
	}));
};
export const refineUser = (user, fData) => {
	return refineDoc(user, fData, custom.refineDocBySlug, custom.refineDocByType);
};
export const makeUserFormData = (user, fData) => {
	return makeFormData('member', user, fData, custom.refineDocToSubmitBySlug, custom.refineDocToSubmitByType);
};
