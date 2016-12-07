import {_isEmpty} from '../accessories/functions';

const _emptyDocument = {
	id: 0, uid: 0, created: 0, owner: false, bookmark: false,
	title: '',
	doctype: 1,
	trial: undefined, court: '', sentence: '', number: '', trialname: '', judge: '', prosecutor: '', lawyer: '',
	commitee: [7],
	content: '',
	date: {year: '', month: ''},
	access: 33,
	author: undefined, name: '', class: '', email: '', phone: '',
	image: {filename: ''},
	file: [{filename: ''}]
};
const _fieldAttrs = {
	id: {type: 'meta'}, uid: {type: 'meta'}, created: {type: 'meta'}, owner: {type: 'meta'}, bookmark: {type: 'meta'},
	title: {type: 'char', displayName: '제목', form: 'text', parent: '', multiple: false, required: true},
	doctype: {type: 'taxonomy', displayName: '자료종류', form: 'select', parent: '', multiple: false, required: true},
	trial: {type: 'group', displayName: '사건정보', children: ['court', 'sentence', 'number', 'trialname', 'judge', 'prosecutor', 'lawyer'], form: 'fieldset', required: true},
	court: {type: 'char', displayName: '법원', form: 'text', parent: 'trial', multiple: false, required: true},
	sentence: {type: 'date', displayName: '선고일자', form: 'text', parent: 'trial', multiple: false, required: true},
	number: {type: 'char', displayName: '사건번호', form: 'text', parent: 'trial', multiple: false, required: true},
	trialname: {type: 'char', displayName: '사건명', form: 'text', parent: 'trial', multiple: false, required: true},
	judge: {type: 'char', displayName: '판사', form: 'text', parent: 'trial', multiple: false, required: true},
	prosecutor: {type: 'char', displayName: '검사', form: 'text', parent: 'trial', multiple: false, required: false},
	lawyer: {type: 'char', displayName: '변호사', form: 'text', parent: 'trial', multiple: false, required: true},
	commitee: {type: 'taxonomy', displayName: '담당', form: 'select', parent: '', multiple: true, required: true},
	content: {type: 'char', displayName: '주요내용', form: 'textarea', parent: '', multiple: false, required: true},
	date: {type: 'date', displayName: '자료 작성 시점', form: 'Ym', parent: '', multiple: false, required: true},
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
	access: [33, 34]
};
const _defaultTerms = {
	1: '판결문', 7: '기타', 33: '열람', 34: '다운로드'
}
const _fname = {
	id: 'id', uid: 'uid', created: 'created', owner: 'owner', bookmark: 'bookmark', subject: 'title', content: 'content', memo: 'memo',
	f1: 'doctype', f2: 'trial', f3: 'court', f4: 'sentence', f5: 'number', f6: 'trialname', f7: 'judge', f8: 'prosecutor', f9: 'lawyer', f10: 'commitee', f12: 'date',
	f13: 'access', f14: 'author', f15: 'name', f16: 'class', f17: 'email', f18: 'phone', f19: 'image', f20: 'file'
};
const _sFname = {
	id: 'id', uid: 'uid', created: 'created', owner: 'owner', bookmark: 'bookmark', title: 'subject', content: 'content', memo: 'memo',
	doctype: 'f1', trial: 'f2', court: 'f3', sentence: 'f4', number: 'f5', trialname: 'f6', judge: 'f7', prosecutor: 'f8', lawyer: 'f9', commitee: 'f10', date: 'f12',
	access: 'f13', author: 'f14', name: 'f15', class: 'f16', email: 'f17', phone: 'f18', image: 'f19', file: 'f20'
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
				taxonomy[fn][sTerm.idx-1] = parseInt(sTerm.tid);
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
};
const _isHiddenField = (fname, doc, where) => {
	if(fname == 'trial' && (where == 'form' || where == 'view')){
		if(doc.doctype == 1 || doc.doctype == 2){ // 판결문,  서면
			return false;
		}
		else return true;
	}
	else if(fname == 'access' && where == 'view'){
		return true;
	}
	return false;
};

export {_emptyDocument, _fieldAttrs, _defaultTaxonomy, _defaultTerms, _fname, _sFname, _convertToDoc, _convertDocToSave, _customFields, _customFieldAttrs, _taxonomy, _terms, _termsOf, _isHiddenField};
