import {refineFieldData, refineDoc, makeFormData} from '../accessories/docManager/refiner';
import update from 'react-addons-update';
import {_mapO} from '../accessories/functions';

export const initDocFData = {
	empty: {id: 0, uid: 0, created: 0, owner: false, bookmark: false, title: '', content: ''},
	fProps: {
		id: {type: 'meta'}, uid: {type: 'meta'}, created: {type: 'meta'}, owner: {type: 'meta'}, bookmark: {type: 'meta'},
		title: {type: 'char', displayName: '제목', form: 'text', parent: '', children: [], multiple: false, required: true},
		content: {type: 'char', displayName: '주요내용', form: 'textarea', parent: '', children: [], multiple: false, required: true}
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
	for(let fs in doc) if(fProps[fs].required) required[fs] = doc[fs]; else elective[fs] = doc[fs];
	return update(required, {$merge: elective});
};
export const refineDocFData = (fData) => {
	let newFData = refineFieldData(fData, initDocFData, custom.refineFData);
	return update(newFData, {empty: {$apply: (value) => rearrangeDoc(value, newFData.fProps)}});
};
