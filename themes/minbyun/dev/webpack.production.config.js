var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var config = require('./config.js');

module.exports = {
	entry: config.entry,
	output: config.output,
	module: {
		loaders: [
			{ test: /\.json$/, loader: 'json' },
			{ test: /\.js$/, exclude: /node_modules/, loader: 'babel', query: { presets: ['react', 'es2015'] }},
			{ test: /\.less$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!less') },
			{ test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader') }
		]
	},
	postcss: function(){
		return [require('autoprefixer')];
	},
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin(),
		new ExtractTextPlugin(config.styleFilename)
	]
};
