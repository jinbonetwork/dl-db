<?php
namespace DLDB\Model;

class GNU5 extends \DLDB\Objects {
	public static function instance() {
		return self::_instance(__CLASS__);
	}

	protected function __contruct() {
	}

	public function getAcl($domain) {
		if( $_SESSION['ss_mb_id'] && !$_SESSION['user']['uid'] ) {
			$dbm = \DLDB\DBM::instance();

			if($_SESSION['ss_mb_id']) {
				$que = "SELECT * FROM `g5_member` WHERE `mb_id` = '".$_SESSION['ss_mb_id']."'";
				$row = $dbm->getFetchArray($que);
				if($row['mb_no']) {
					$_SESSION['user'] = array(
						'uid' => $row['mb_no']
					);
				}
			}
		}
	}

	public function getMember($mb_no) {
		$dbm = \DLDB\DBM::instance();
			        
		$que = "SELECT * FROM `g5_member` WHERE `mb_no` = ".$mb_no;
		$row = $dbm->getFetchArray($que);
		if($row['mb_no']) {
			$member = array(
				'uid' => $row['mb_no'],
				'user_id' => stripslashes($row['mb_id']),
				'email' => stripslashes($row['mb_email']),
				'user_name' => stripslashes($row['mb_name']),
				'nick_name' => stripslashes($row['mb_nick'])
			);
		}
		return $member;
	}
}
?>
