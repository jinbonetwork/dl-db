module.exports = {
	apiUrl: 'http://dl.jinbo.net/api',
	basename: '',	// for router
	entry: [
		__dirname + '/app/App.js'
	],
	output: {
		path: __dirname + '/../script',
		filename: 'script.js'
	}
};
