import {
	refineFieldData, refineDoc as refine, refineFile, extractFileData, makeDocFormData as makeDFD, makeFileFormData
} from '../accessories/docManager/refiner';
import update from 'react-addons-update';
import {_mapO, _forIn, _isEmpty, _mapOO} from '../accessories/functions';

const initDocFData = {
	empty: {id: 0, uid: 0, created: 0, owner: true, bookmark: 0, title: '', content: ''},
	fProps: {
		id: {type: 'meta', form: 'number'}, uid: {type: 'meta', form: 'number'}, created: {type: 'meta', form: 'number'},
		owner: {type: 'meta', form: 'bool'}, bookmark: {type: 'meta', form: 'number'},
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
const checkIfParsing = (doc, fData) => {
	let isParsing = false;
	_forIn(doc, (fs, value) => {
		const fProp = fData.fProps[fs];
		if(fProp.form == 'file'){
			let values = (fProp.multiple ? value : [value]);
			for(let i in values){
				if(fProp.type == 'file' && ['uploaded', 'parsing'].indexOf(values[i].status) >= 0){
					isParsing = true; return false;
				}
			}
		}
	});
	return isParsing;
};
const doAfterReceiveParseState = (state, oldState, doc, fData) => {
	// 모든 파일의 파싱이 완료되었다면 setInterval를 clear하고, 파싱이 완료된 파일의 상태정보를 추출한다. ////
	let isInProgress = false;
	let completions = {};
	_forIn(state, (fid, value) => {
		if(	(value.status == 'parsed' || value.status == 'unparsed') &&
			(_isEmpty(oldState) || oldState[fid].status == 'uploaded' || oldState[fid].status == 'parsing')
		){
			completions[fid] = value;
		}
		else if(value.status == 'uploaded' || value.status == 'parsing'){
			isInProgress = true;
		}
	});
	// doc과 opendocs의 파일 상태를 갱신한다. ////
	let filesWithNewStatus;
	if(!_isEmpty(completions)){
		filesWithNewStatus = _mapOO(
			doc,
			(fs, value) => {
				const fProp = fData.fProps[fs];
				let values = (fProp.multiple ? value : [value]);
				for(let i in values){
					if(completions[values[i].fid]) values[i].status = completions[values[i].fid].status;
				}
				return (fProp.multiple ? values : values[0]);
			},
			(fs, value) => {
				const fProp = fData.fProps[fs];
				if(fProp && fProp.form == 'file') return fs; else return undefined;
			}
		);
	}
	return {isInProgress, filesWithNewStatus};
};
const getFilesAfterUpload = (files, doc, fData) => {
	let docToMerge = {};
	_forIn(refineFile(files, fData), (slug, filesToAdd) => {
		if(fData.fProps[slug].multiple){
			let newFile = []; let index = 0;
			doc[slug].forEach((val) => {
				if(!val.fid){
					newFile.push(filesToAdd[index]); index++;
				} else {
					newFile.push(val);
				}
			});
			docToMerge[slug] = newFile;
		} else {
			docToMerge[slug] = filesToAdd;
		}
	});
	return docToMerge;
}

export {
	initDocFData, refineDocFData, refineDoc, refineFile, extractFileData, makeDocFormData, makeFileFormData, checkIfParsing,
	doAfterReceiveParseState, getFilesAfterUpload
};
