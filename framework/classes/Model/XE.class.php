<?php
namespace DLDB\Model;

class XE extends \DLDB\Objects {
	public static function instance() {
		return self::_instance(__CLASS__);
	}

	protected function __contruct() {
	}

	public function getAcl($domain) {
		if( $_SESSION['member_srl'] && !$_SESSION['user']['uid'] ) {
			$dbm = \DLDB\DBM::instance();

			if($_SESSION['member_srl']) {
				$que = "SELECT * FROM `xe_member` WHERE `member_srl` = '".$_SESSION['member_srl']."'";
				$row = $dbm->getFetchArray($que);
				if($row['member_srl']) {
					$_SESSION['user'] = array(
						'uid' => $row['member_srl']
					);
				}
			}
		}
	}
}
?>
