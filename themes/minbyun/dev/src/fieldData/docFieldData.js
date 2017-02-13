import {
	refineFieldData, refineDoc as refine, refineFile, extracFileData, makeDocFormData as makeDFD, makeFileFormData,
	extractFileStatusFromOrigin, makeInitParseState
} from '../accessories/docManager/refiner';
import update from 'react-addons-update';
import {_mapO, _forIn} from '../accessories/functions';

const initDocFData = {
	empty: {id: 0, uid: 0, created: 0, owner: true, bookmark: false, title: '', content: ''},
	fProps: {
		id: {type: 'meta', form: 'number'}, uid: {type: 'meta', form: 'number'}, created: {type: 'meta', form: 'number'},
		owner: {type: 'meta', form: 'bool'}, bookmark: {type: 'meta', form: 'bool'},
		title: {type: 'char', dispName: '제목', form: 'text', parent: '', children: [], multiple: false, required: true},
		content: {type: 'char', dispName: '주요내용', form: 'textarea', parent: '', children: [], multiple: false, required: true}
	},
	fSlug: {
		id: 'id', uid: 'uid', created: 'created', owner: 'owner', bookmark: 'bookmark', subject: 'title', content: 'content'
	},
	fID: {
		id: 'id', uid: 'uid', created: 'created', owner: 'owner', bookmark: 'bookmark', title: 'subject', content: 'content'
	},
	taxonomy: {},
	terms: {}
};
const custom = {
	refineFData: {
		total_cnt: (value) => ({
			propName: 'numOfDocs',
			propValue: (value > 99999 ? 99999 : parseInt(value))
		})
	}/*,
	refineDocBySlug: {
		role: (slug, value, fProp) => (value)
	},
	refineDocByType: {
		something: (slug, value, fProp) => {}
	},
	refineDocToSubmitBySlug: {
		something: (slug, value, fProp) => (),
	},
	refineDocToSubmitByType: {
		something: (slug, value, fProp) => {}
	}
	*/
};
const rearrangeDoc = (doc, fProps) => {
	let required = {}, elective = {};
	let content = doc.content;
	for(let fs in doc){
		if(fProps[fs].required) required[fs] = doc[fs];
		else elective[fs] = doc[fs];
	}
	return update(required, {$merge: elective});
};
const refineDocFData = (fData) => {
	let newFData = refineFieldData(fData, initDocFData, custom.refineFData);
	return update(newFData, {empty: {$apply: (value) => rearrangeDoc(value, newFData.fProps)}});
};
const refineDoc = (doc, fData) => {
	return rearrangeDoc(refine(doc, fData), fData.fProps);
};
const makeDocFormData = (doc, fData) => {
	return makeDFD('document', doc, fData);
};

export {
	initDocFData, refineDocFData, refineDoc, refineFile, extracFileData, makeDocFormData, makeFileFormData, extractFileStatusFromOrigin, makeInitParseState
};
