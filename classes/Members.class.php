<?php
namespace DLDB;

class Members extends \DLDB\Objects {
	public static function instance() {
		return self::_instance(__CLASS__);
	}

	public static function search($q,$page=0,$limit=0) {
		$context = \DLDB\Model\Context::instance();
		$dbm = \DLDB\DBM::instance();

		if($q) {
			$que = "SELECT * FROM {members} WHERE `name` LIKE '".$q."%'";
			if($page) {
				$que .= " ORDER BY name ASC LIMIT ".( ($page - 1) * $limit ).", ".$limit;
			}
			$members = array();
			while( $row = $dbm->getFetchArray($que) ) {
				$members[] = self::fetchMember($row);
			}
		}

		return $members;
	}

	public static function get($id) {
		$dbm = \DLDB\DBM::instance();
	}

	private static function fetchMember($row) {
		$member = array();
		foreach($row as $k => $v) {
			if($k == 'committee') {
				$member[$k] = unserialize($v);
			}else if(is_numeric($v)) {
				$member[$k] = $v;
			} else {
				$member[$k] = stripslashes($v);
			}
		}
		return $member;
	}
}
?>
