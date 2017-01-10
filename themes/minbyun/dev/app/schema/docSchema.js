import {_isEmpty, _copyOf, _forIn, _mapO} from '../accessories/functions';

const _emptyDoc = {
	id: 0, uid: 0, created: 0, owner: false, bookmark: false,
	title: '', content: ''
};
const _fAttrs = {
	id: {type: 'meta'}, uid: {type: 'meta'}, created: {type: 'meta'}, owner: {type: 'meta'}, bookmark: {type: 'meta'},
	title: {type: 'char', displayName: '제목', form: 'text', parent: '', children: [], multiple: false, required: true},
	content: {type: 'char', displayName: '주요내용', form: 'textarea', parent: '', children: [], multiple: false, required: true}
};
const _fname = {
	id: 'id', uid: 'uid', created: 'created', owner: 'owner', bookmark: 'bookmark', subject: 'title', content: 'content'
};
const _sFname = {
	id: 'id', uid: 'uid', created: 'created', owner: 'owner', bookmark: 'bookmark', title: 'subject', content: 'content'
}
const _docData = (data) => {
	let fname = _copyOf(_fname), sFname = _copyOf(_sFname), fAttrs = _copyOf(_fAttrs);
	let emptyDoc = {}, taxonomy = {}, terms = {};
	data.fields.forEach((attr) => { // fname, sFname
		fname['f'+attr.fid] = attr.slug;
		sFname[attr.slug] = 'f'+attr.fid;
	});
	data.fields.forEach((attr) => { // taxonomy, terms
		if(attr.type == 'taxonomy' && attr.cid > 0){
			let fn = fname['f'+attr.fid];
			let tempTaxo = [];
			data.taxonomy[attr.cid].forEach((term) => {
				tempTaxo[term.idx] = parseInt(term.tid);
				terms[term.tid] = {name: term.name, slug: term.slug};
			});
			taxonomy[attr.slug] = _copyOf(tempTaxo, true);
		}
	});
	let topFields = [];
	data.fields.forEach((attr) => { // fAttrs
		const parent = (attr.parent > 0 ? fname['f'+attr.parent] : '');
		const children = []; data.fields.forEach((cattr) => {if(cattr.parent == attr.fid) children[cattr.idx] = cattr.slug});
		if(attr.parent == 0){ if(attr.type != 'group' || children.length > 0){
			topFields[attr.idx] = attr.slug;
		}}
		fAttrs[attr.slug] = {
			type: attr.type, displayName: attr.subject, form: attr.form,
			parent: parent, children: _copyOf(children, true),
			multiple: (attr.multiple == 1 ? true : false),
			required: (attr.required == 1 ? true : false)
		};
	});
	topFields = _copyOf(topFields, true);
	if(topFields[0] == 'doctype' && topFields[1] == 'trial' && topFields[2] == 'committee'){
		topFields.splice(3, 0, 'content');
	} else {
		topFields.splice(0, 0, 'content');
	}
	_forIn(_emptyDoc, (pn, pv) => {
		if(pn != 'content') emptyDoc[pn] = pv;
	});
	topFields.forEach((fn) => {
		emptyDoc[fn] = emptyDocValue(fn, fAttrs[fn], taxonomy);
		if(fAttrs[fn].children.length > 0){
			fAttrs[fn].children.forEach((cfn) => {
				emptyDoc[cfn] = emptyDocValue(cfn, fAttrs[cfn], taxonomy);
			});
		}
	});
	return {
		fname: fname, sFname: sFname, fAttrs: fAttrs, emptyDoc: emptyDoc, taxonomy: taxonomy, terms: terms
	};
};
const emptyDocValue = (fname, fAttr, taxonomy) => {
	let value;
	switch(fAttr.type){
		case 'char': case 'tag': case 'email': case 'phone':
			value = ''; break;
		case 'date':
			if(fAttr.form == 'Ym') value = {year: '', month: ''};
			else if(fAttr.form == 'text') value = '';
			else value = '';
			break;
		case 'image': case 'file':
			value = {filename: ''}; break;
		case 'taxonomy':
			value = taxonomy[fname][0]; break;
		case 'group':
			value = undefined; break;
		default:
			console.error(fAttr.type+': 적합하지 않은 type입니다.'); return;
	}
	if(fAttr.multiple){
		return [value];
	} else {
		return value;
	}
};
const _convertToDoc = (sDoc, docData) => {
	let document = {};
	for(let fn in docData.emptyDoc){
		let fAttr = docData.fAttrs[fn];
		let sValue = sDoc[docData.sFname[fn]];
		if(sValue){
			switch(fAttr.type){
				case 'meta':
					if(fn == 'owner') document[fn] = (sValue == 1 ? true : false);
					else document[fn] = parseInt(sValue); break;
				case 'char': case 'tag': case 'email': case 'phone': case 'date':
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
			document[fn] = docData.emptyDoc[fn];
		}
	}
	return document;
};
const _convertDocToSave = (doc, docData) => {
	let sDocument = {};
	for(let fn in doc){
		let fAttr = docData.fAttrs[fn];
		let value = doc[fn];
		let sFn = docData.sFname[fn];
		if(!_isEmpty(value)){
			switch(fAttr.type){
				case 'meta': case 'char': case 'tag': case 'email': case 'phone': case 'taxonomy': case 'date':
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
				default:
			}
		}
	}
	return sDocument;
};
const _termsOf = (fname, docData) => {
	let terms = {};
	docData.taxonomy[fname].forEach((tid) => {
		terms[tid] = docData.terms[tid].name;
	});
	return terms;
};
const _isHiddenField = (fname, where, doc, docData) => {
	if(fname == 'trial' && docData.fAttrs.doctype && !docData.fAttrs.doctype.multiple && doc.doctype){
		const term = docData.terms[doc.doctype];
		if(term && (term.slug == 'sentencing' || term.slug == 'writing')){
			return false;
		}
		else return true;
	}
	else if(fname == 'access' && where == 'view'){
		return true;
	}
	else return false;
};

export {_emptyDoc, _fAttrs, _fname, _sFname, _docData, _convertToDoc, _convertDocToSave, _termsOf, _isHiddenField};
