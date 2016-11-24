const _role = (sRole) => {
	if(sRole){
		const roleMap = {
			1: 'admin', 3: 'write', 5: 'download', 7: 'view', 15: 'anonymous'
		}
		return sRole.map((r) => roleMap[r]);
	} else {
		return null;
	}
}

export {_role};
