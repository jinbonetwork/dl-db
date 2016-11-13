<?php
namespace DLDB;

class History extends \DLDB\Objects {
	public static function instance() {
		return self::_instance(__CLASS__);
	}

	public static function totalCnt($uid) {
		$dbm = \DLDB\DBM::instance();

		$que = "SELECT count(*) AS cnt FROM {history} WHERE uid = ".$uid;
		$row = $dbm->getFetchArray($que);
		return ($row['cnt'] ? $row['cnt'] : 0);
	}

	public static function getList($uid, $page=1,$limit=20) {
		$dbm = \DLDB\DBM::instance();

		$que = "SELECT * FROM {history} WHERE uid = ".$uid." ORDER BY hid DESC LIMIT ".( ($page - 1)* $limit ).",".$limit;
		$historys = array();
		 while($row = $dbm->getFetchArray($que)) {
			$historys[] = self::fetchHistory($row,'view');
		}
		return $historys;
	}

	public static function get($uid,$hid) {
		$dbm = \DLDB\DBM::instance();

		$que = "SELECT * FROM {history} WHERE uid = ".$uid." AND hid = ".$hid;
		$history = self::fetchHistory( $dbm->getFetchArray($que) );

		return $history;
	}

	public static function insert($uid,$q,$args) {
		$dbm = \DLDB\DBM::instance();

		$que = "INSERT INTO {history} (`uid`,`query`,`options`,`search_date`) VALUES (?,?,?,?)";
		$dbm->execute($que,array("dssd",$uid,$q,serialize($options),time()));

		$insert_hid = $dbm->getLastInsertId();

		return $insert_hid;
	}

	public static function delete($hid) {
		$dbm = \DLDB\DBM::instance();

		$que = "DELETE FROM {history} WHERE hid = ?";
		$dbm->execute( $que, array( "d", $hid ) );
	}

	private static function fetchHistory($row,$mode='') {
		if(!$row) return null;
		foreach($row as $k => $v) {
			if( $k == 'options' ) $v = unserialize($v);
			else if(is_string($v)) $v = stripslashes($v);
			$history[$k] = $v;
		}
		return $history;
	}
}
?>
