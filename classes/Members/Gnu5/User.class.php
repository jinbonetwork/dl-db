<?php
namespace CADB\Members\Gnu5;
        
class User extends \CADB\Objects  {
	private static $prefix;
	public static $errmsg;
				        
	public static function instance() {
		return self::_instance(__CLASS__);
	}

	private static function getPrefix() {
		if(!self::$prefix) {
			$context = \DLDB\Model\Context::instance();
			self::$prefix = $context->getProperty('service.gnu5_prefix');
		}
		return self::$prefix;
	}

	public static function getMember($mb_no) {
		$dbm = \CADB\DBM::instance();

		$prefix = self::getPrefix();

		$que = "SELECT * FROM `".$prefix."member` WHERE mb_no = ".$mb_no;
		$member = self::fetchMember($dbm->getFetchArray($que));
		if(!$member) return null;
		return $member;
	}

	public static function getAdminID() {
		$dbm = \DLDB\DBM::instance();

		$prefix = self::getPrefix();

		$que = "SELECT dm.* FROM `".$prefix."member` AS gm LEFT JOIN {members} AS dm ON gm.mb_no = dm.uid WHERE dm.`mb_level` = 10 ORDER BY dm.`mb_no` ASC";
		$members = array();
		while($row = $dbm->getFetchArray($que)) {
			$members[] = self::fetchMember($row);
		}

		return $members;
	}

	private static function fetchMember($row) {
		if(!$row) return null;
		$member = array();
		foreach($row as $k => $v) {
			if(is_string($v)) {
				$v = stripslashes($v);
			}
			$member[$k] = $v;
			if($k == 'mb_level') {
				$member['glevel'] = (11 - $v);
				switch($member['glevel']) {
					case BITWISE_ADMINISTRATOR:
						$member['level_name'] = '운영자';
						break;
					default:
						$member['level_name'] = '이용자';
						break;
				}
			}
		}
		return $member;
	}

	public static function add($args) {
		$dbm = \CADB\DBM::instance();

		$prefix = self::getPrefix();

		$user_id = $args['mb_id'] = 
		$que = "SELECT * FROM `".$prefix."member` WHERE mb_id = '".$args['mb_id']."'";
		$row = $dbm->getFetchArray($que);
		if($row['mb_no']) {
			self::setErrorMsg( $args['mb_id']."는 이미 존재하는 아이디입니다." );
			return -1;
		}

		$que = "INSERT INTO `".$prefix."member` (
			mb_id,
			mb_password,
			mb_name,
			mb_nick,
			mb_nick_date,
			mb_email,
			mb_homepage,
			mb_level,
			mb_sex,
			mb_birth,
			mb_tel,
			mb_hp,
			mb_certify,
			mb_adult,
			mb_dupinfo,
			mb_zip1,
			mb_zip2,
			mb_addr1,
			mb_addr2,
			mb_addr3,
			mb_addr_jibeon,
			mb_signature,
			mb_recommend,
			mb_point,
			mb_today_login,
			mb_login_ip,
			mb_datetime,
			mb_ip,
			mb_leave_date,
			mb_intercept_date,
			mb_email_certify,
			mb_memo,
			mb_lost_certify,
			mb_mailling,
			mb_sms,
			mb_open,
			mb_open_date,
			mb_profile,
			mb_memo_call,
			mb_1,
			mb_2,
			mb_3,
			mb_4,
			mb_5,
			mb_6,
			mb_7,
			mb_8,
			mb_9,
			mb_10
		) VALUES (?,password(".$args['password']."),?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

		$dbm->execute($que,array(
			"ssssssdsssssdsssssssssssssssssssdddsssssssssssss",
			$args['mb_id'],
			$args['mb_name'],
			$args['mb_nick'],
			date("Y-m-d"),
			$args['mb_email'],
			'',
			$args['mb_level'],
			'',
			'',
			'',
			'',
			'',
			0,
			'',
			'',
			'',
			'',
			'',
			'',
			'',
			'',
			'',
			0,
			date("Y-m-d H:i:s"),
			'',
			date("Y-m-d H:i:s"),
			'',
			'',
			'',
			date("Y-m-d H:i:s"),
			'',
			'',
			0,
			0,
			0,
			date("Y-m-d"),
			'',
			'',
			'',
			'',
			'',
			'',
			'',
			'',
			'',
			'',
			'',
			''
		));

		$insert_mb_no = $dbm->getLastInsertId();

		return $insert_mb_no;
	}

	public static function modify($member,$args) {
		$dbm = \CADB\DBM::instance();

		$prefix = self::getPrefix();

		if(!$args['mb_id'] && $args['uid']) $args['mb_id'] = $args['uid'];
		$que = "SELECT * FROM `".$prefix."member` WHERE mb_id = '".$args['mb_id']."' AND mb_no != ".$args['mb_no'];
		$row = $dbm->getFetchArray($que);
		if($row['mb_no']) {
			self::setErrorMsg( $args['mb_id']."는 이미 존재하는 아이디입니다." );
			return -1;
		}

		$c = 0;
		if($args['password']) {
			$que = "UPDATE `".$prefix."member` SET mb_id = ?, mb_password = password('".$args['password']."'), mb_name = ?, mb_nick = ?, mb_email = ?, mb_level = ? WHERE mb_no = ?";
		} else {
			$que = "UPDATE `".$prefix."member` SET mb_id = ?, mb_name = ?, mb_nick = ?, mb_email = ?, mb_level = ? WHERE mb_no = ?";
		}
		$dbm->execute($que,array("ssssdd",$args['mb_id'], $args['mb_name'],$args['mb_nick'],$args['mb_email'],$args['mb_level'],$args['mb_no']));

		return $args['mb_no'];
	}

	public static function delete($mb_no) {
		$dbm = \CADB\DBM::instance();

		$prefix = self::getPrefix();

		$que = "DELETE FROM `".$prefix."member` WHERE mb_no = ?";
		$dbm->execute($que,array("d",$mb_no));

		return 0;
	}

	public static function changePassword($mb_no,$password) {
		$dbm = \CADB\DBM::instance();

		$prefix = self::getPrefix();

		$que = "UPDATE `".$prefix."member` SET mb_password = password('".$password."') WHERE mb_no = ?";
		$dbm->execute($que,array("d",$mb_no));
	}

	public static function setErrorMsg($errmsg) {
		self::$errmsg = $errmsg;
	}

	public static function errorMsg() {
		return self::$errmsg;
	}
}
?>
