<?php
namespace DLDB\Files;

class DBM extends \DLDB\Objects {

	public static function instance() {
		return self::_instance(__CLASS__);
	}

	public static function getAttached($did) {
		$dbm = \DLDB\DBM::instance();

		$files = array();
		$que = "SELECT * FROM {files} WHERE `did` = ".$did;
		while($row = $dbm->getFetchArray($que)) {
			if(preg_match("/^image/i",$row['mimetype'])) continue;
			$files[] = self::fetchFile($row);
		}
		return $files;
	}

	public static function totalFileCnt($s_mode='',$s_args='') {
		$dbm = \DLDB\DBM::instance();

		$que = "SELECT count(*) AS cnt FROM {files} AS f LEFT JOIN {documents} AS d ON f.did = d.id WHERE ".self::makeFileQuery($s_mode,$s_args);

		$row = $dbm->getFetchArray($que);
		return ($row['cnt'] ? $row['cnt'] : 0);
	}

	public static function getFiles($page,$limit,$order="desc",$s_mode='',$s_args='') {
		$dbm = \DLDB\DBM::instance();

		$que = "SELECT f.fid, f.did, f.filepath, f.filename, f.mimetype, f.uid, f.download, f.filesize, f.regdate, f.status, f.anonymity, f.textsize, d.id, d.subject FROM {files} AS f LEFT JOIN {documents} AS d ON f.did = d.id WHERE ".self::makeFileQuery($s_mode,$s_args);
		$que .= " ORDER BY f.fid ".strtolower($order)." LIMIT ".( ( $page - 1 ) * $limit ).",".$limit;
		$files = array();
		while( $row = $dbm->getFetchArray($que) ) {
			$files[] = self::fetchFile($row);
		}
		return $files;
	}

	private static function makeFileQuery($s_mode='',$s_args='') {
		$que = '';
		if(isset($s_mode) && isset($s_args)) {
			switch($s_mode) {
				case 'subject':
					$que .= "d.subject LIKE '%".$s_args."%' AND ";
					break;
				case 'filename':
					$que .= "f.filename LIKE '%".$s_args."%' AND ";
					break;
				case 'status':
					$que .= "f.status = '".$s_args."' AND ";
					break;
				case 'anonymity':
					$que .= "f.anonymity = '".$s_args."' AND ";
					break;
				default:
					break;
			}
		}
		$que .= "f.did > 0 AND f.mimetype LIKE 'application%'";

		return $que;
	}

	private static function fetchFile($row) {
		if(!$row) return null;
		$file = array();
		foreach($row as $k => $v) {
			if(is_numeric($v)) {
				$file[$k] = $v;
			} else {
				$file[$k] = stripslashes($v);
			}
		}
		$file['fileuri'] = \DLDB\Files::getFileUrl($file);
		return $file;
	}
}
?>
