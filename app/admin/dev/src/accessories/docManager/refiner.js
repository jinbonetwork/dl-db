import update from 'react-addons-update';
import {_copyOf, _forIn, _mapO, _mapOO, _isEmpty} from '../functions';

const refineFieldData = (fData, init, custom = {}) => {
	let fSlug = _copyOf(init.fSlug), fID = _copyOf(init.fID), fProps = _copyOf(init.fProps), empty = _copyOf(init.empty);
	let taxonomy = {}, terms = {}, roles = {};

	// fSlug, fID ////
	fData.fields.forEach((prop) => { if((prop.active ? prop.active == 1 : true)){
		fSlug['f'+prop.fid] = prop.slug;
		fID[prop.slug] = 'f'+prop.fid;
	}});
	//taxonomy, terms ////
	fData.fields.forEach((prop) => {
		if((!prop.hasOwnProperty('active') || prop.active == 1) && prop.type == 'taxonomy' && prop.cid > 0){
			let fs = fSlug['f'+prop.fid];
			let tempTaxo = [];
			fData.taxonomy[prop.cid].forEach((term) => { if(!term.hasOwnProperty('active') || term.active == 1){
				tempTaxo[term.idx] = parseInt(term.tid);
				terms[term.tid] = {name: term.name, slug: term.slug};
			}});
			taxonomy[prop.slug] = _copyOf(tempTaxo, true);
		}
	});
	// fProps ////
	let topFields = [];
	fData.fields.forEach((prop) => { if(!prop.hasOwnProperty('active') || prop.active == 1){
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

	// custom refiner ////
	let resultFData = {fSlug, fID, fProps, empty, taxonomy, terms};
	_forIn(custom, (pn, refiner) => {
		let {propName, propValue} = refiner(fData[pn]);
		resultFData[propName] = propValue;
	});

	// return ////
	return resultFData;
}

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
const refineDoc = (origin, fData, refineDocBySlug = {}, refineDocByType = {}) => (
	_mapOO(fData.empty, (fs, emptyVal) => {
		const fProp = fData.fProps[fs];
		const originVal = origin[fData.fID[fs]];
		if(!_isEmpty(originVal)){
			if(refineDocBySlug[fs]) return refineDocBySlug[fs](fs, originVal, fProp);
			if(refineDocByType[fProp.type]) return refineDocByType[fProp.type](fs, originVal, fProp);
			let value;
			switch(fProp.type){
				case 'meta':
					if(fProp.form == 'number') return parseInt(originVal);
					if(fProp.form == 'bool') return (originVal == 1 ? true : false);
					return originVal;
				case 'char': case 'tag': case 'email': case 'phone': case 'date': case 'password':
					return originVal;
				case 'taxonomy':
					value = _mapO(originVal, (tid) => parseInt(tid));
					return (fProp.multiple ? value : value[0]);
				case 'image': case 'file':
					value = _mapO(originVal, (fid, val) => update(val, {
						fid: {$set: parseInt(fid)},
						anonymity: {$apply: (anony) => (anony == 1)}
					}));
					return (fProp.multiple ? value : value[0]);
				default:
					return emptyVal;
			}
		} else {
			return emptyVal;
		}
	})
);
const refineFile = (files, fData) => ( _mapOO(files,
	(fieldID, originVal) => {
		const fs = fData.fSlug['f'+fieldID];
		let value = _mapO(originVal, (fid, val) => update(val, {
			fid: {$set: parseInt(fid)},
			anonymity: {$apply: (anony) => (anony == 1)}
		}));
		if(fData.fProps[fs].multiple) return value;
		else return value[0];
	},
	(fieldID, originVal) => (fData.fSlug['f'+fieldID])
));

const refineDocToSubmit = (doc, fData, refineDocToSubmitBySlug = {}, refineDocToSubmitByType = {}) => {
	return _mapOO(doc, (fs, value) => {
		const fProp = fData.fProps[fs];
		const id = fData.fID[fs];
		if(!_isEmpty(value)){
			if(refineDocToSubmitBySlug[fs]) return refineDocToSubmitBySlug[fs](fs, value, fProp);
			if(refineDocToSubmitByType[fProp.type]) return refineDocToSubmitByType[fProp.type](fs, value, fProp);
			switch(fProp.type){
				case 'meta':
					if(fProp.form == 'bool') return (value ? '1' : '0');
					return value;
				case 'char': case 'tag': case 'email': case 'phone': case 'taxonomy': case 'date': case 'password':
					return value;
				case 'image': case 'file':
					if(fProp.multiple){
						let tmpVal = []; value.forEach((file) => {
							if(file.fid) tmpVal.push(file.fid);
						});
						return tmpVal;
					}
					else if(value.fid) return value.fid;
				default:
					return '';
			}
		} else {
			return '';
		}
	}, (fs, value) => (fData.fID[fs]));
};

const extracFileData = (doc, fData) => {
	return _mapOO(
		doc,
		(fs, value) => {
			let files = [];
			const extract = (val) => {
				return (val.fid || !val.name ? val : {filename: val.name, status: 'uploading'});
			}
			return (fData.fProps[fs].multiple ? value.map((val) => extract(val)) : extract(value));
		},
		(fs, value) => {
			const fProp = fData.fProps[fs];
			if(fProp && fProp.form == 'file') return fs; else return undefined;
		}
	)
};

const makeFormData = (docFormPropName, doc, fData, refineDocToSubmitBySlug = {}, refineDocToSubmitByType = {}) => {
	let formData = new FormData();
	formData.append(docFormPropName, JSON.stringify(
		refineDocToSubmit(doc, fData, refineDocToSubmitBySlug, refineDocToSubmitByType)
	));
	for(let fs in doc){
		const fProp = fData.fProps[fs];
		if(fProp && fProp.form == 'file'){
			if(fProp.multiple){
				doc[fs].forEach((file) => {
					if(file.name) formData.append(fData.fID[fs]+'[]', file);
				});
			} else {
				if(doc[fs].name) formData.append(fData.fID[fn], doc[fs]);
			}
		}
	}
	return formData;
};

const makeDocFormData = (propName, doc, fData, refineDocToSubmitBySlug = {}, refineDocToSubmitByType = {}) => {
	let formData = new FormData();
	formData.append(propName, JSON.stringify(
		refineDocToSubmit(doc, fData, refineDocToSubmitBySlug, refineDocToSubmitByType)
	));
	return formData;
};

const makeFileFormData = (doc, fData, isAdmin) => {
	let formData = new FormData();
	for(let fs in doc){
		const fProp = fData.fProps[fs];
		if(fProp && fProp.form == 'file'){
			if(fProp.multiple){
				doc[fs].forEach((file) => {
					if(file.name){
						formData.append(fData.fID[fs]+'[]', file);
					}
				});
			} else {
				if(doc[fs].name){
					formData.append(fData.fID[fs], doc[fs]);
				}
			}
		}
	}
	return formData;
}

export {refineFieldData, refineDoc, refineFile, refineDocToSubmit, extracFileData, makeDocFormData, makeFileFormData, makeFormData};
