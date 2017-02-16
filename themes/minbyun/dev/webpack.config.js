var webpack = require('webpack');
var config = require('./config.js');

module.exports = {
	devtool: 'eval-source-map',
	entry: config.entry,
	output: config.output,
	module: {
		loaders: [
			{ test: /\.json$/, loader: 'json' },
			{ test: /\.js$/, exclude: /node_modules/, loader: 'babel', query: { presets: ['react', 'es2015'] }},
			{ test: /\.less$/, loader: 'style-loader!css-loader!postcss-loader!less' },
			{ test: /\.css$/, loader: 'style-loader!css-loader!postcss-loader' }
		]
	},
	postcss: function(){
		return [require('autoprefixer')];
	}
};
