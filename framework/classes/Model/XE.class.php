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
				$que = "SELECT * FROM `xe_member` WHERE `member_srl` = ".$_SESSION['member_srl'];
				$row = $dbm->getFetchArray($que);
				if($row['member_srl']) {
					$_SESSION['user'] = array(
						'uid' => $row['member_srl']
					);
				}
			}
		}
	}

	public function getMember($member_srl) {
		$dbm = \DLDB\DBM::instance();

		$que = "SELECT * FROM `xe_member` WHERE `member_srl` = ".$member_srl;
		$row = $dbm->getFetchArray($que);
		if($row['member_srl']) {
			$member = array(
				'uid' => $row['member_srl'],
				'user_id' => stripslashes($row['user_id']),
				'email' => stripslashes($row['email_address']),
				'user_name' => stripslashes($row['user_name']),
				'nick_name' => stripslashes($row['nick_name'])
			);
		}
		return $member;
	}
}
?>
