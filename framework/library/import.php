<?php
namespace DLDB\Lib;
/**
 * @brief import required Library Package or Class
 **/
global $__requireLibrary;
if(!isset($__requireLibrary)) $__requireLibrary = array();
function import() {
	$args = func_get_args();
	if(empty($args)) return false;
	foreach($args as $libPath) {
		$paths = explode(".",$libPath);
		if(end($paths) == "*") {
			array_pop($paths);
			foreach (new DirectoryIterator(DLDB_PATH.'/framework/'.implode("/",$paths)) as $fileInfo) {
				if($fileInfo->isFile()) require_once($fileInfo->getPathname());
			}
		} else {
			if( file_exists( DLDB_PATH.'/framework/'.str_replace(".","/",$libPath).".php") )
				require_once DLDB_PATH.'/framework/'.str_replace(".","/",$libPath).".php";
			else if( file_exists( DLDB_PATH.'/'.str_replace(".","/",$libPath).".php") )
				require_once DLDB_PATH.'/'.str_replace(".","/",$libPath).".php";
		}
	}
	return true;
}

function importLibrary($name) {
	global $__requireLibrary;
	$library = "library.".$name;
	if(!in_array($library,$__requireLibrary)) {
		\DLDB\Lib\import($library);
		array_push($__requireLibrary,$library);
	}
}

function importModel($name) {
	global $__requireLibrary;
	\DLDB\Lib\importLibrary("model.".$name);
}

function importView($name) {
	global $__requireLibrary;
	\DLDB\Lib\importLibrary("view.".$name);
}

function importResource($key,$compress=false) {
	\DLDB\View\Resource::addResource($key,0,$compress);
}
?>
