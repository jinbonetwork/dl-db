<?php
namespace DLDB\App\download;

\DLDB\Lib\importLibrary("file");

$Acl = "download";

class index extends \DLDB\Controller {
	public function process() {
		$acl = \DLDB\Acl::instance();
		if( $this->params['fid'] && is_numeric($this->params['fid']) ) {
			$fileinfo = \DLDB\Files::getFile($this->params['fid']);
			if($fileinfo['filepath']) {
				$file = \DLDB\Files::getFilePath($fileinfo);
			}
		} else if($this->params['attachement']) {
			$file = DLDB_DATA_PATH."/".rawurldecode($this->params['attachement']);
			$fileinfo = \DLDB\Files::getFileByPath("/".rawurldecode($this->params['attachement']));
		}
		if(!$fileinfo) {
			header("HTTP/1.0 404 Not Found");
			exit;
		}
		if(!preg_match("/image/i",$fileinfo['mimetype'])) {
			if(!$fileinfo['anonymity'] && !$acl->imMaster() && $this->user['uid'] != $fileinfo['uid']) {
				\DLDB\Lib\Error("아직 다운로드 할 수 없는 파일입니다. 운영자가 확인한 파일만 다운로드 가능합니다.",403);
			}
		}
		if(file_exists($file)) {
			\DLDB\Files::updateDownload($fileinfo['fid']);
			\DLDB\Lib\dumpWithEtag($file);
			exit;
		} else {
			header("HTTP/1.0 404 Not Found");
			exit;
		}
	}
}
