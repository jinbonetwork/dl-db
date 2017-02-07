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
