import {_forIn, _isEmpty} from '../accessories/functions';

export const refineFileList = (original) => {
	return original.map((file) => refineFile(file));
};
export const refineFile = (file) => ({
	fileId: parseInt(file.fid),
	docId: parseInt(file.did),
	fileName: file.filename,
	docTitle: file.subject,
	fileUri: file.fileuri,
	status: file.status,
	anonymity: (file.anonymity == 1 ? true : false)
});
export const refineFileAfterUpload = (files) => {
	let refined = {};
	_forIn(files, (pn, file) => {
		_forIn(file, (pn, value) => {
			refined = {
				fileName: value.filename,
				fileUri: value.fileuri,
				status: value.status,
				anonymity: (value.anonymity == 1 ? true : false)
			};
		})
	});
	return refined;
};

export const checkIfParsing = (files) => {
	for(let idx in files){
		if(['uploaded', 'parsing'].indexOf(files[idx].status) >= 0){
			return true;
		}
	}
};
export const doAfterReceiveParseState = (state, oldState) => {
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
	return {isInProgress, completions};
};
