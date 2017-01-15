import {RECEIVE_USERLIST, RECEIVE_USER_FIELD_DATA, CHANGE_PROPS_IN_USERS, REFINE_ROLES} from '../constants';
import update from 'react-addons-update';
import {_copyOf, _forIn} from '../accessories/functions';

const initialState = {
	fieldData: {
		empty: {id: 0, uid: 0, license: false, name: '', class: '', email: '', phone: '', role: []},
		fProps: {
			id: {type: 'meta'}, uid: {type: 'meta', dispName: '등록여부'}, license: {type: 'meta'},
			name: {type: 'char', dispName: '이름', form: 'text', parent: '', children: [], multiple: false, required: true},
			class: {type: 'char', dispName: '구분', form: 'text', parent: '', children: [], multiple: false, required: false},
			email: {type: 'email', dispName: '이메일', form: 'text', parent: '', children: [], multiple: false, required: false},
			phone: {type: 'char', dispName: '전화번호', form: 'text', parent: '', children: [], multiple: false, required: false},
			role: {type: 'role', dispName: '권한', form: 'check', parent: '', children: [], multiple: false, required: false}
		},
		fSlug: {id: 'id', uid: 'uid', license: 'license', name: 'name', class: 'class', email: 'email', phone: 'phone', role: 'role'},
		fID: {id: 'id', uid: 'uid', license: 'license', name: 'name', class: 'class', email: 'email', phone: 'phone', role: 'role'},
		taxonomy: {},
		terms: {}
	},
	list: [],
	originalList: [],
	lastPage: 1,
	selected: []
};
const refineFieldData = (fData) => {
	const init = initialState.fieldData;
	let fSlug = _copyOf(init.fSlug), fID = _copyOf(init.fID), fProps = _copyOf(init.fProps), empty = _copyOf(init.empty);
	let taxonomy = {}, terms = {}, roles = {};

	// fSlug, fID ////
	fData.fields.forEach((prop) => { if(prop.active == 1){
		fSlug['f'+prop.fid] = prop.slug;
		fID[prop.slug] = 'f'+prop.fid;
	}});
	//taxonomy, terms ////
	fData.fields.forEach((prop) => {
		if(prop.active == 1 && prop.type == 'taxonomy' && prop.cid > 0){
			let fs = fSlug['f'+prop.fid];
			let tempTaxo = [];
			fData.taxonomy[prop.cid].forEach((term) => { if(term.active == 1){
				tempTaxo[term.idx] = parseInt(term.tid);
				terms[term.tid] = {name: term.name, slug: term.slug};
			}});
			taxonomy[prop.slug] = _copyOf(tempTaxo, true);
		}
	});
	// fProps ////
	let topFields = [];
	fData.fields.forEach((prop) => { if(prop.active == 1){
		const parent = (prop.parent > 0 ? fSlug['f'+prop.parent] : '');
		const children = []; fData.fields.forEach((cprop) => {if(cprop.parent == prop.fid) children[cprop.idx] = cprop.slug});
		if(prop.parent == 0){ if(prop.type != 'group' || children.length > 0){
			topFields[prop.idx] = prop.slug;
		}}
		fProps[prop.slug] = {
			type: prop.type, dispName: prop.subject, form: prop.form,
			parent: parent, children: _copyOf(children, true),
			multiple: (prop.multiple == 1 ? true : false),
			required: (prop.required == 1 ? true : false)
		};
	}});
	// empty ////
	topFields = _copyOf(topFields, true);
	topFields.forEach((fs) => {
		empty[fs] = emptyValue(fs, fProps[fs], taxonomy);
		if(fProps[fs].children.length > 0){
			fProps[fs].children.forEach((cfs) => {
				empty[cfs] = emptyValue(cfs, fProps[cfs], taxonomy);
			});
		}
	});

	// return ////
	return {fSlug, fID, fProps, empty, taxonomy, terms};
};
const emptyValue = (fSlug, fProp, taxonomy) => {
	let value;
	switch(fProp.type){
		case 'char': case 'tag': case 'email': case 'phone':
			value = ''; break;
		case 'date':
			if(fProp.form == 'Ym') value = {year: '', month: ''};
			else if(fProp.form == 'text') value = '';
			else value = '';
			break;
		case 'image': case 'file':
			value = {filename: ''}; break;
		case 'taxonomy':
			value = taxonomy[fSlug][0]; break;
		case 'group':
			value = undefined; break;
		default:
			console.error(fProp.type+': 적합하지 않은 type입니다.'); return;
	}
	if(fProp.multiple){
		return [value];
	} else {
		return value;
	}
};
const refineRoles = (roles) => {
	let newRoles = {};
	const roleNames = {
		administrator: '관리자',
		write: '쓰기',
		download: '다운로드',
		view: '읽기'
	};
	_forIn(roles, (pn, pv) => {
		if(roleNames[pv]) newRoles[pn] = roleNames[pv];
	});
	return newRoles;
};
const refineList = (original, fieldData) => {
	const fID = fieldData.fID;
	const fProps = fieldData.fProps;
	return original.map((item) => ({
		id: parseInt(item[fID.id]),
		name: item[fID.name],
		class: item[fID.class],
		email: item[fID.email],
		phone: item[fID.phone],
		uid: (item[fID.uid] > 0 ? '등록' : '')
	}));
};

const users = (state = initialState, action) => {
	switch (action.type) {
		case RECEIVE_USER_FIELD_DATA:
			const fieldData = refineFieldData(action.userFieldData);
			return update(state, {
				fieldData: {$merge: fieldData},
				list: {$set: refineList(state.originalList, fieldData)}
			});
		case RECEIVE_USERLIST:
			return update(state, {
				orginalList: {$set: action.userList},
				list: {$set: refineList(action.userList, state.fieldData)},
				lastPage: {$set: action.lastPage}
			});
		case REFINE_ROLES:
			return update(state, {
				fieldData: {roles: {$set: refineRoles(action.roles)}}
			});
		case CHANGE_PROPS_IN_USERS:
			return update(state, {[action.which]: {$set: action.value}});
		default:
			return state;
	}
};

export default users;
