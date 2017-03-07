<?php
namespace DLDB\Stats;

class Members extends \DLDB\Objects {
	public static function instance() {
		return self::_instance(__CLASS__);
	}

	public static function totalCnt() {
		$dbm = \DLDB\DBM::instance();

		$que = "SELECT count(*) FROM" 
	}
}
?>
