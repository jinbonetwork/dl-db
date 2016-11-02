var fs = require('fs');
var config = require('./config.js');

function Basename(server){
	if(server == 'apache'){
		var htaccess =
			'<IfModule mod_rewrite.c>\n'+
			'RewriteEngine On\n'+
			'RewriteBase '+config.basename+'/\n'+
			'RewriteRule ^index\\.html$ - [L]\n'+
			'RewriteCond %{REQUEST_FILENAME} !-f\n'+
			'RewriteCond %{REQUEST_FILENAME} !-d\n'+
			'RewriteRule . '+config.basename+'/index.html [L]\n'+
			'</IfModule>';
		fs.writeFile(config.output.path+'/.htaccess', htaccess, function(err){
			if(err) console.err(err);
		});
	}
}

Basename.prototype.apply = function(compiler){
	compiler.plugin('compilation', function(compilation){
		compilation.plugin('html-webpack-plugin-before-html-processing', function(htmlPluginData, callback){
			htmlPluginData.assets.js = htmlPluginData.assets.js.map(function(value){
				return config.basename + '/' + value;
			});
			callback(null, htmlPluginData);
		});
	});
};

module.exports = Basename;
