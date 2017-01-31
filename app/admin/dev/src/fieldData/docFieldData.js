import {_mapO} from '../accessories/functions';

export const refineDocFData = (fData) => {
	let propOfFile = fData.fields.find((prop) => (prop.slug == 'file'));
	return {
		fID: {id: 'id', title: 'subject', file: 'f'+propOfFile.fid}
	};
};

export const refineDocList = (original, {fID}) => {
	return original.map((item) => {
		let files = _mapO(item[fID.file], (fileId, props) => ({
			fileId: parseInt(fileId),
			fileName: props.filename,
			fileUri: props.fileuri,
			parsed: (props.status == 'parsed' ? true : false),
			anonymity: (props.anonymity == 1 ? true : false)
		}));
		return {
			docId: parseInt(item[fID.id]),
			title: item[fID.title],
			files: files
		};
	});
};
