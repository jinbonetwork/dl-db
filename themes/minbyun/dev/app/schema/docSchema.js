import {_isEmpty} from '../accessories/functions';

const _emptyDocument = {
	id: 0, uid: 0, created: 0, owner: false,
	title: '',
	doctype: 1,
	trial: undefined, court: '', number: '', judge: '', prosecutor: '', lawyer: '',
	commitee: [7],
	content: '',
	date: {year: '', month: ''},
	access: 32,
	author: undefined, name: '', class: '', email: '', phone: '',
	image: {filename: ''},
	file: [{filename: ''}]
};
const _fieldAttrs = {
	id: {type: 'meta'}, uid: {type: 'meta'}, created: {type: 'meta'}, owner: {type: 'meta'},
	title: {type: 'char', displayName: '제목', form: 'text', parent: '', multiple: false, required: true},
	doctype: {type: 'taxonomy', displayName: '자료종류', form: 'select', parent: '', multiple: false, required: true},
	trial: {type: 'group', displayName: '재판정보', children: ['court', 'number', 'judge', 'prosecutor', 'lawyer'], form: 'fieldset', required: true},
	court: {type: 'char', displayName: '법원', form: 'text', parent: 'trial', multiple: false, required: true},
	number: {type: 'char', displayName: '사건번호', form: 'text', parent: 'trial', multiple: false, required: true},
	judge: {type: 'char', displayName: '판사', form: 'text', parent: 'trial', multiple: false, required: true},
	prosecutor: {type: 'char', displayName: '검사', form: 'text', parent: 'trial', multiple: false, required: true},
	lawyer: {type: 'char', displayName: '변호사', form: 'text', parent: 'trial', multiple: false, required: true},
	commitee: {type: 'taxonomy', displayName: '위원회', form: 'select', parent: '', multiple: true, required: true},
	content: {type: 'char', displayName: '주요내용', form: 'textarea', parent: '', multiple: false, required: true},
	date: {type: 'date', displayName: '자료 실제 작성 년월', form: 'Ym', parent: '', multiple: false, required: true},
	access: {type: 'taxonomy', displayName: '자료 제공 방식', form: 'radio', parent: '', multiple: false, required: true},
	author: {type: 'group', displayName: '담당자/작성자', children: ['name', 'class', 'email', 'phone'], form: 'fieldset', required: true},
	name: {type: 'char', displayName: '이름', form: 'search', parent: 'author', multiple: false, required: true},
	class: {type: 'char', displayName: '기수', form: 'text', parent: 'author', multiple: false, required: true},
	email: {type: 'char', displayName: '이메일', form: 'text', parent: 'author', multiple: false, required: false},
	phone: {type: 'char', displayName: '전화번호', form: 'text', parent: 'author', multiple: false, required: false},
	image: {type: 'image', displayName: '표지이미지', form: 'file', multiple: false, required: false},
	file: {type: 'file', displayName: '첨부파일', form: 'file', multiple: true, required: false}
};
const _defaultTaxonomy = {
	doctype: [1],
	commitee: [7],
	access: [32, 33]
};
const _defaultTerms = {
	1: '판결문', 7: '기타', 32: '열람', 33: '다운로드'
}
const _fname = {
	id: 'id', uid: 'uid', created: 'created', owner: 'owner', subject: 'title', content: 'content',
	f1: 'doctype', f2: 'trial', f3: 'court', f4: 'number', f5: 'judge', f6: 'prosecutor', f7: 'lawyer', f8: 'commitee', f10: 'date',
	f11: 'access', f12: 'author', f13: 'name', f14: 'class', f15: 'email', f16: 'phone', f17: 'image', f18: 'file'
};
const _sFname = {
	id: 'id', uid: 'uid', created: 'created', owner: 'owner', title: 'subject', content: 'content',
	doctype: 'f1', trial: 'f2', court: 'f3', number: 'f4', judge: 'f5', prosecutor: 'f6', lawyer: 'f7', commitee: 'f8', date: 'f10',
	access: 'f11', author: 'f12', name: 'f13', class: 'f14', email: 'f15', phone: 'f16', image: 'f17', file: 'f18'
};
const _convertToDoc = (sDoc) => {
	let document = {};
	for(let fn in _emptyDocument){
		let fAttr = _fieldAttrs[fn];
		let sValue = sDoc[_sFname[fn]];
		if(sValue){
			switch(fAttr.type){
				case 'meta':
					if(fn == 'owner') document[fn] = (sValue == 1 ? true : false);
					else document[fn] = parseInt(sValue); break;
				case 'char': case 'date':
					document[fn] = sValue; break;
				case 'taxonomy':
					document[fn] = [];
					for(let tid in sValue) document[fn].push(parseInt(tid));
					if(fAttr.multiple === false) document[fn] = document[fn][0]; break;
				case 'image': case 'file':
					document[fn] = [];
					for(let fid in sValue){
						sValue[fid].fid = fid;
						document[fn].push(sValue[fid]);
					}
					if(fAttr.multiple === false) document[fn] = document[fn][0]; break;
				default:
			}
		} else {
			document[fn] = _emptyDocument[fn];
		}
	}
	return document;
};
const _convertDocToSave = (doc) => {
	let sDocument = {};
	for(let fn in doc){
		let fAttr = _fieldAttrs[fn];
		let value = doc[fn];
		let sFn = _sFname[fn];
		if(!_isEmpty(value)){
			switch(fAttr.type){
				case 'meta': case 'char': case 'date': case 'taxonomy':
					sDocument[sFn] = value; break;
				case 'image': case 'file':
					if(fAttr.multiple){ value.forEach((file) => {
						if(file.fid){
							if(!sDocument[sFn]) sDocument[sFn] = [];
							sDocument[sFn].push(file.fid);
						}
					});} else if(value.fid){
						sDocument[sFn] = value.fid;
					}
					break;
			}
		}
	}
	return sDocument;
};
const _customFields = (sFields) => {
	let customFields = {};
	return null;
};
const _customFieldAttrs = (sFields) => {
	let customFieldAttrs = {};
	return null;
};
const _taxonomy = (sTaxonomy, sFields) => {
	let taxonomy = {};
	sFields.forEach((sFAttr) => {
		if(sFAttr.type == 'taxonomy' && sFAttr.cid > 0){
			let fn = _fname['f'+sFAttr.fid];
			taxonomy[fn] = [];
			sTaxonomy[sFAttr.cid].forEach((sTerm) => {
				taxonomy[fn][sTerm.idx] = parseInt(sTerm.tid);
			});
		}
	});
	return taxonomy;
};
const _terms = (taxonomyData) => {
	let terms = {};
	for(let cid in taxonomyData){
		taxonomyData[cid].forEach((t) => {
			terms[t.tid] = t.name;
		});
	}
	return terms;
};

const _termsOf = (fname, docData) => {
	let terms = {};
	docData.taxonomy[fname].forEach((tid) => {
		terms[tid] = docData.terms[tid];
	});
	return terms;
}

export {_emptyDocument, _fieldAttrs, _defaultTaxonomy, _defaultTerms, _fname, _sFname, _convertToDoc, _convertDocToSave, _customFields, _customFieldAttrs, _taxonomy, _terms, _termsOf};
