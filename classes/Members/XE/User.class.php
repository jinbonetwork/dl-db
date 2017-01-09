<?php
namespace DLDB\Member\DBM\XE;

class User extends \DLDB\Objects {
	public static $xe_config;
	public static $errmsg;

	public static function instance() {
		return self::_instance(__CLASS__);
	}

	public static function getMember($member_srl) {
		$dbm = \CADB\DBM::instance();

		$que = "SELECT * FROM `xe_member` WHERE `member_srl` = ".$member_srl;
		$member = self::fetchMember($dbm->getFetchArray($que));
		if(!$member) return null;
		return $member;
	}

	private static function fetchMember($row) {
		if(!$row) return null;
		$member = array();
		foreach($row as $k => $v) {
			if(is_string($v)) {
				$v = stripslashes($v);
			}
			$member[$k] = $v;
		}
		return $member;
	}

	public static function add($args) {
		$dbm = \CADB\DBM::instance();

		$que = "SELECT max(member_srl) AS new FROM `xe_member`";
		$row = $dbm->getFetchArray($que);

		$member_srl = ($row['new'] ? ( $row['new'] + 1 ) : 1)

		$que = "INSERT INTO `xe_member` (
			`member_srl`,
			`user_id`,
			`email_address`,
			`password`,
			`email_id`,
			`email_host`,
			`user_name`,
			`nick_name`,
			`allow_mailing`,
			`allow_message`,
			`regdate`,
			`is_admin`,
			`list_order`
		) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
	}

	public static function makePassword($password) {
		$config = self::getXeMemberConfig();
	}

	public static function checkPasswordStrength($password, $strength) {
		$config = self::getXeMemberConfig();
/*		$logged_info = Context::get('logged_info');
		if($logged_info->is_admin == 'Y') return true;

		if($strength == NULL) {
			$config = $this->getMemberConfig();
			$strength = $config->password_strength?$config->password_strength:'normal';
		} */

		$length = strlen($password);

		switch ($strength) {
			case 'high':
				if($length < 8 || !preg_match('/[^a-zA-Z0-9]/', $password)) return false;
				/* no break */

			case 'normal':
				if($length < 6 || !preg_match('/[a-zA-Z]/', $password) || !preg_match('/[0-9]/', $password)) return false;
				break;

			case 'low':
				if($length < 4) return false;
				break;
		}

		return true;
	}

	private static function getXeMemberConfig() {
		if(!self::$xe_config) {
			$dbm = \CADB\DBM::instance();

			$que = "SELECT * FROM xe_module_config WHERE module = 'member' AND site_srl = 0";
			$row = $dbm->getFetchArray($que);
			self::$xe_config = unserialize($row['config']);
		}
		return self::$xe_config;
	}
}
?>
