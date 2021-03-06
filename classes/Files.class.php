<?php
namespace DLDB;

class Files extends \DLDB\Objects {
	private static $errmsg;

	public static function instance() {
		return self::_instance(__CLASS__);
	}

	public static function getList($did) {
		$dbm = \DLDB\DBM::instance();

		$que = "SELECT * FROM {files} WHERE `did` = ".$did;
		while($row = $dbm->getFetchArray($que)) {
			$files[] = self::fetchFiles($row);
		}
		return $files;
	}

	public static function getListParseStatus($did) {
		$dbm = \DLDB\DBM::instance();

		$que = "SELECT fid,did,mimetype,uid,status,progress,anonymity FROM {files} WHERE did = ".$did;
		while($row = $dbm->getFetchArray($que)) {
			if( preg_match("/^image/i",$row['mimetype']) ) continue;
			$files[] = self::fetchFiles($row);
		}
		return $files;
	}

	public static function getFile($fid) {
		$dbm = \DLDB\DBM::instance();

		$que = "SELECT * FROM {files} WHERE `fid` = ".$fid;
		$row = $dbm->getFetchArray($que);

		return self::fetchFiles($row);
	}

	public static function getFileParseStatus($fid) {
		$dbm = \DLDB\DBM::instance();

		$que = "SELECT fid,did,mimetype,uid,status,progress,anonymity FROM {files} WHERE fid = ".$fid;
		$row = $dbm->getFetchArray($que);
		if( preg_match("/^image/i",$row['mimetype']) ) return null;
		$file = self::fetchFiles($row);

		return $file;
	}

	public static function getFileByPath($filepath) {
		$dbm = \DLDB\DBM::instance();

		$que = "SELECT * FROM {files} WHERE `filepath` = '".addslashes($filepath)."'";
		$row = $dbm->getFetchArray($que);

		return self::fetchFiles($row);
	}

	public static function getFilePath($file) {
		$filename = DLDB_DATA_PATH."/".$file['filepath'];
		return $filename;
	}

	public static function getFileUrl($file) {
		$file_uri = DLDB_DATA_URI.$file['filepath'];
		return $file_uri;
	}

	public static function getDownUrl($file) {
		$file_uri = DLDB_URI."download/?fid=".$file['fid'];
		return $file_uri;
	}

	public static function uploadFile($file_info,$permit='') {
		$context = \DLDB\Model\Context::instance();
		if(!$permit) $permit = $context->getProperty('service.permit');
		if($permit) {
			if(!preg_match("/\.(".$permit.")/i",$file_info['name']) ) { 
				self::$errmsg = '허용되지 않는 파일입니다';
				return null;
			}
		}
		$path = DLDB_DATA_PATH."/attach";
		self::checkDir($path);
		$path = $path."/".date("Y");
		self::checkDir($path);
		$path = $path."/".date("m");
		self::checkDir($path);
		$filename = $path."/".preg_replace("/ /i","_",$file_info['name']);
		$filename = self::checkFile($filename);

		if(!@move_uploaded_file($file_info['tmp_name'], $filename)) {
			self::$errmsg = '파일 업로드 오류';
			return null;
		}

		return $filename;
	}

	private static function checkDir($path) {
		if(!file_exists($path)) {
			mkdir($path,0707);
			chmod($path,0707);
		}
	}

	private static function checkFile($filename) {
		$idx = 0;
		while(file_exists($filename)) {
			$idx++;
			$filename = preg_replace('/\.([a-z0-9]+)$/i','_'.$idx.'.$1',$filename);
		}
		return $filename;
	}

	public static function unlinkFile($filename) {
		if(!@unlink($filename)) {
			self::$errmsg = "[".$filename.'] 파일을 삭제할 수 없습니다.';
			return -1;
		}
	}

	public static function insertFile($did,$file) {
		$filepath = substr($file,strlen(DLDB_DATA_PATH));
		$_filename = explode( "/", $file );
		$filename = $_filename[(@count($_filename)-1)];
		$file_size = @filesize($file);
		$finfo = finfo_open(FILEINFO_MIME_TYPE);
		$mime = finfo_file($finfo, $file);
		finfo_close($finfo);

		if($file_size > 0) {
			$dbm = \DLDB\DBM::instance();

			$que = "INSERT INTO {files} (`did`,`filepath`,`filename`,`mimetype`,`uid`,`download`,`filesize`,`regdate`,`status`,`textsize`) VALUES (?,?,?,?,?,?,?,?,?,?)";
			$dbm->execute($que,array("dsssddddsd",($did ? $did : 0),$filepath,$filename,$mime,$_SESSION['user']['uid'],0,$file_size,time(),'uploaded',0));

			$fid = $dbm->getLastInsertId();
		}

		return $fid;
	}

	public static function modifyFile($fid,$file) {
		$filepath = substr($file,strlen(DLDB_DATA_PATH));
		$_filename = explode( "/", $file );
		$filename = $_filename[(@count($_filename)-1)];
		$file_size = @filesize($file);
		$finfo = finfo_open(FILEINFO_MIME_TYPE);
		$mime = finfo_file($finfo, $file);
		finfo_close($finfo);

		if($file_size > 0) {
			$dbm = \DLDB\DBM::instance();

			$que = "UPDATE {files} SET `filepath` = ?, `filename` = ?, `mimetype` = ?, `filesize` = ?, `regdate` = ?, `status` = ?, `textsize` = ? WHERE `fid` = ?";
			$dbm->execute($que,array("sssddsdd",$filepath,$filename,$mime,$file_size,time(),'uploaded',0,$fid));
		}

		return $fid;
	}

	public static function deleteFile($fid) {
		$dbm = \DLDB\DBM::instance();

		$que = "DELETE FROM {files} WHERE fid = ?";
		$dbm->execute($que,array("d",$fid));
	}

	public static function status($fid,$status) {
		$dbm = \DLDB\DBM::instance();

		$que = "UPDATE {files} SET `status` = ? WHERE fid = ?";
		$dbm->execute( $que, array("sd", $status, $fid ) );

		return 0;
	}

	public static function anonymity($fid,$anonymity) {
		$dbm = \DLDB\DBM::instance();

		$que = "UPDATE {files} SET `anonymity` = ? WHERE fid = ?";
		$dbm->execute( $que, array("dd", $anonymity, $fid ) );

		return 0;
	}

	public static function updateDownload($fid) {
		$dbm = \DLDB\DBM::instance();

		$que = "UPDATE {files} SET `download` = `download`+1 WHERE fid = ?";
		$dbm->execute( $que, array("d", $fid ) );

		return 0;
	}

	public static function errMsg() {
		return self::$errmsg;
	}

	public static function fetchFiles($row) {
		if(!$row) return null;
		foreach($row as $k => $v) {
			if($k == 'header') $v = unserialize($v);
			else if(is_string($v)) $v = stripslashes($v);
			$file[$k] = $v;
		}
		if(!$file['progress']) {
			if($file['status'] == 'parsed') {
				$file['progress'] = 100;
			} else if($file['status'] == 'uploaded') {
				$file['progress'] = 0;
			}
		}
		return $file;
	}
}
?>
