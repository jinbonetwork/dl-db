<?php
namespace DLDB\App\download;

\DLDB\Lib\importLibrary("file");

$Acl = "download";

class index extends \DLDB\Controller {
	public function process() {
		$file = DLDB_DATA_PATH."/".rawurldecode($this->params['attachement']);
		if(file_exists($file)) {
			\DLDB\Lib\dumpWithEtag($file);
			exit;
		} else {
			header("HTTP/1.0 404 Not Found");
			exit;
		}
	}
}
