<?php
namespace DLDB\Members\XE;

class User extends \DLDB\Objects {
	private static $prefix;
	private static $xe_config;
	public static $errmsg;

	public static function instance() {
		return self::_instance(__CLASS__);
	}

	private static function getPrefix() {
		if(!self::$prefix) {
			$context = \DLDB\Model\Context::instance();
			self::$prefix = $context->getProperty('service.xe_prefix');
		}
		return self::$prefix;
	}

	public static function getMember($member_srl) {
		$dbm = \DLDB\DBM::instance();

		$prefix = self::getPrefix();

		$que = "SELECT * FROM `".$prefix."member` WHERE `member_srl` = ".$member_srl;
		$member = self::fetchMember($dbm->getFetchArray($que));
		if(!$member) return null;
		return $member;
	}

	public static function getAdminID() {
		$dbm = \DLDB\DBM::instance();

		$prefix = self::getPrefix();

		$que = "SELECT dm.* FROM `".$prefix."member` AS xm LEFT JOIN {members} AS dm ON xm.member_srl = dm.uid WHERE xm.`is_admin` = 'Y' ORDER BY xm.`member_srl` ASC";
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
		}
		return $member;
	}

	public static function add($args) {
		$dbm = \DLDB\DBM::instance();

		$prefix = self::getPrefix();

		if(!$args['name']) {
			self::$errmsg = "이름을 입력하세요";
			return -1;
		}
		if(!$args['email']) {
			self::$errmsg = "이메일을 입력하세요";
			return -2;
		}
		if(!$args['password']) {
			self::$errmsg = "비밀번호를 입력하세요";
			return -3;
		}

		$que = "SELECT max(member_srl) AS new FROM `".$prefix."member`";
		$row = $dbm->getFetchArray($que);

		$member_srl = ($row['new'] ? ( $row['new'] + 1 ) : 1);

		$user_id = preg_split("/@/i",$args['email']);
		$email_id = $user_id[0];

		$que = "SELECT * FROM `".$prefix."member` WHERE user_id LIKE '".$user_id[0]."%'";
		while($row = $dbm->getFetchArray($que)) {
			$pre_user_id[$row['user_id']] = $row;
		}
		if($pre_user_id && is_array($pre_user_id) && @count($pre_user_id) > 0) {
			$new_idx=1;
			$_user_id = $user_id[0];
			while($pre_user_id[$_user_id]) {
				$_user_id = $user_id[0].($new_idx++);
			}
			$user_id[0] = $_user_id;
		}

		$password = self::makePassword($args['password']);
		$regdate = date("YmdHis",time());

		$que = "INSERT INTO `".$prefix."member` (
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

		if($dbm->execute($que, array("dsssssssssssd",
			$member_srl,
			$user_id[0],
			$args['email'],
			$password,
			$email_id,
			$user_id[1],
			$args['name'],
			$user_id[0],
			'N',
			'N',
			$regdate,
			($args['admin'] ? 'Y' : 'N'),
			(0 - $member_srl)
		)) < 1 ) {
			self::$errmsg = "(".$user_id[0].") ".$que." 가 DB에 반영되지 않았습니다.";
			return -1;
		}

		$que = "SELECT * FROM `".$prefix."member_group` ORDER BY site_srl ASC";
		while($row = $dbm->getFetchArray($que)) {
			if($row['group_srl'] == 1) continue;
			else {
				$group_srl = $row['group_srl'];
				break;
			}
		}

		if($group_srl) {
			$que = "INSERT INTO `".$prefix."member_group_member` (`site_srl`,`group_srl`,`member_srl`,`regdate`) VALUES (?,?,?,?)";
			$dbm->execute($que,array("ddds",0,$group_srl,$member_srl,$regdate));
		}

		return $member_srl;
	}

	public static function modify($member,$args) {
		$dbm = \DLDB\DBM::instance();

		$prefix = self::getPrefix();

		if(!$args['member_srl']) {
			$member_srl = $member['uid'];
		} else {
			$member_srl = $args['member_srl'];
		}
		if(!$args['name']) {
			self::$errmsg = "이름을 입력하세요";
			return -1;
		}
		if(!$args['email']) {
			self::$errmsg = "이메일을 입력하세요";
			return -2;
		}

		if($member['email'] != $args['email']) {
			$update_email = 1;
			$user_id = preg_split("/@/i",$args['email']);
			$email_id = $user_id[0];

			$que = "SELECT * FROM `".$prefix."member` WHERE user_id LIKE '".$user_id[0]."%'";
			while($row = $dbm->getFetchArray($que)) {
				if( $row['member_srl'] == $member['uid'] ) continue;
				$pre_user_id[$row['user_id']] = $row;
			}
			if($pre_user_id && is_array($pre_user_id) && @count($pre_user_id) > 0) {
				$new_idx=1;
				$_user_id = $user_id[0];
				while($pre_user_id[$_user_id]) {
					$_user_id = $user_id[0].($new_idx++);
				}
				$user_id[0] = $_user_id;
			}
		} else {
			$que = "SELECT * FROM `".$prefix."member` WHERE member_srl = ".$member['uid'];
			$row = $dbm->getFetchArray($que);
			$user_id[0] = $row['user_id'];
			$user_id[1] = $row['email_host'];
			$email_id = $row['email_id'];
			$update_email = 0;
		}
		if($args['password']) {
			$password = self::makePassword($args['password']);
		}

		$que = "UPDATE `".$prefix."member` SET `user_id` = ?, `email_address` = ?";
		$array1 = 'array("ss';
		$array2 = '$'."user_id[0], ".'$'."args['email']";
		if($args['password']) {
			$que .= ", `password` = ?";
			$array1 .= 's';
			$array2 .= ", ".'$'."password";
		}
		$que .= ", `email_id` = ?, `email_host` = ?, `user_name` = ?, `nick_name` = ? WHERE member_srl = ? ";
		$array1 .= 'ssssd",';
		$array2 .= ", ".'$'."email_id, ".'$'."user_id[1], ".'$'."args['name'], ".'$'."args['name'], ".'$'."member_srl)";

		$eval_str = '$'."q_args = ".$array1.$array2.";";
		eval($eval_str);

		$dbm->execute($que,$q_args);

		return $member_srl;
	}

	public static function createFindAuthKey($email,$member_srl) {
		$dbm = \DLDB\DBM::instance();

		$prefix = self::getPrefix();

		$que = "SELECT * FROM `".$prefix."member_auth_mail` WHERE member_srl = ".$member_srl;
		$row = $dbm->getFetchArray($que);
		if($row['member_srl']) {
			$pre_regdate = strtotime(substr($row['regdate'],0,4)."-".substr($row['regdate'],4,2)."-".substr($row['regdate'],6,2)." ".substr($row['regdate'],8,2).":".substr($row['regdate'],10,2).":".substr($row['regdate'],12,2));
			if($pre_regdate - time() < 3600) {
				$return = array('success'=>-2,'message'=>'1시간내에 이미 임시비빌번호 인증 메일이 발송되었습니다. 메일함을 확인하세요');
				return $return;
			} else {
				$que = "DELETE FROM `".$prefix."member_auth_mail` WHERE member_srl = ?";
				$dbm->execute($que,array("d",$member_srl));
			}
		}

		$_user_id = preg_split("/@/i",$email);
		$user_id = $_user_id[0];
		$new_password = self::createTemporaryPassword(10);
		$auth_key = self::createSecureSalt(40);
		$regdate = date("YmdHis");
		$auth_link = "/index.php?module=member&act=procMemberAuthAccount&member_srl=".$member_srl."&auth_key=".$auth_key;

		$que = "INSERT INTO `".$prefix."member_auth_mail` (`auth_key`,`member_srl`,`user_id`,`new_password`,`is_register`,`regdate`) VALUES (?,?,?,?,?,?)";
		$dbm->execute($que,array("sdssss",$auth_key,$member_srl,$user_id,$new_password,'N',$regdate));

		$return = array('success'=>1, 'auth_link'=>$auth_link,'password'=>$new_password);
		return $return;
	}

	public static function delete($member_srl) {
		$dbm = \DLDB\DBM::instance();

		$prefix = self::getPrefix();

		$que = "DELETE FROM `".$prefix."member` WHERE member_srl = ?";
		$dbm->execute($que,array("d",$member_srl));

		$que = "DELETE FROM `".$prefix."member_group_member` WHERE member_srl = ?";
		$dbm->execute($que,array("d",$member_srl));

		return 0;
	}

	public static function changePassword($member_srl,$password) {
		$dbm = \DLDB\DBM::instance();

		$prefix = self::getPrefix();

		$_password = self::makePassword($password);

		$que = "UPDATE `".$prefix."member` SET password = ? WHERE member_srl = ?";
		$dbm->execute($que,array("sd",$_password,$member_srl));
	}

	public static function makePassword($password) {
		$config = self::getXeMemberConfig();

		switch( $config->password_hashing_algorithm ) {
			case 'md4':
				return md5($password);
			case 'pbkdf2':
				$iterations = pow(2, self::getWorkFactor() + 5);
				$salt = self::createSecureSalt(12, 'alnum');
				$hash = base64_encode(self::pbkdf2($password, $salt, 'sha256', $iterations, 24));
				return 'sha256:'.sprintf('%07d', $iterations).':'.$salt.':'.$hash;
				break;
			case 'bcrypt':
				$salt = '$2y$'.sprintf('%02d', self::getWorkFactor()).'$'.self::createSecureSalt(22, 'alnum');
				return crypt($password, $salt);
				break;
			default:
				return false;
		}
	}

	public static function checkPasswordStrength($password, $strength=NULL) {
		$config = self::getXeMemberConfig();

		$acl = \DLDB\Acl::instance();
		if($acl->imMaster()) {
			return true;
		}

		if($strength == NULL) {
			$strength = $config->password_strength ? $config->password_strength : 'normal';
		}

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

	private static function getWorkFactor() {
		$config = self::getXeMemberConfig();
		$work_factor = $config->password_hashing_work_factor;
		if(!$work_factor || $work_factor < 4 || $work_factor > 31) {
			$work_factor = 8;  // Reasonable default
		}
		return $work_factor;
	}

	private static function createTemporaryPassword($length = 16) {
		while(true) {
			$source = base64_encode(self::createSecureSalt(64, 'binary'));
			$source = strtr($source, 'iIoOjl10/', '@#$%&*-!?');
			$source_length = strlen($source);
			for($i = 0; $i < $source_length - $length; $i++) {
				$candidate = substr($source, $i, $length);
				if( preg_match('/[a-z]/', $candidate) && preg_match('/[A-Z]/', $candidate) &&
					preg_match('/[0-9]/', $candidate) && preg_match('/[^a-zA-Z0-9]/', $candidate)) {
					return $candidate;
				}
			}
		}
	}

	private static function createSecureSalt($length, $format = 'hex') {
		// Find out how many bytes of entropy we really need
		switch($format) {   
			case 'hex':
				$entropy_required_bytes = ceil($length / 2);
				break;
			case 'alnum':
			case 'printable':
				$entropy_required_bytes = ceil($length * 3 / 4);
				break;
			default:
				$entropy_required_bytes = $length;
		}

		$entropy_capped_bytes = min(32, $entropy_required_bytes);

		$is_windows = (defined('PHP_OS') && strtoupper(substr(PHP_OS, 0, 3)) === 'WIN');
		if(function_exists('openssl_random_pseudo_bytes') && (!$is_windows || version_compare(PHP_VERSION, '5.4', '>='))) {   
			$entropy = openssl_random_pseudo_bytes($entropy_capped_bytes);
		} else if(function_exists('mcrypt_create_iv') && (!$is_windows || version_compare(PHP_VERSION, '5.3.7', '>='))) {   
			$entropy = mcrypt_create_iv($entropy_capped_bytes, MCRYPT_DEV_URANDOM);
		} else if(function_exists('mcrypt_create_iv') && $is_windows) {   
			$entropy = mcrypt_create_iv($entropy_capped_bytes, MCRYPT_RAND);
		} else if(!$is_windows && @is_readable('/dev/urandom')) {
			$fp = fopen('/dev/urandom', 'rb');
			$entropy = fread($fp, $entropy_capped_bytes);
			fclose($fp);
		} else {
			$entropy = '';
			for($i = 0; $i < $entropy_capped_bytes; $i += 2) {
				$entropy .= pack('S', rand(0, 65536) ^ mt_rand(0, 65535));
			}
		}

		$output = '';
		for($i = 0; $i < $entropy_required_bytes; $i += 32) {
			$output .= hash('sha256', $entropy . $i . rand(), true);
		}

		switch($format) {
			case 'hex':
				return substr(bin2hex($output), 0, $length);
			case 'binary':
				return substr($output, 0, $length);
			case 'printable':
				$salt = '';
				for($i = 0; $i < $length; $i++) {
					$salt .= chr(33 + (crc32(sha1($i . $output)) % 94));
				}
				return $salt;
			case 'alnum':
			default:
				$salt = substr(base64_encode($output), 0, $length);
				$replacements = chr(rand(65, 90)) . chr(rand(97, 122)) . rand(0, 9);
				return strtr($salt, '+/=', $replacements);
		}
	}

	private static function pbkdf2($password, $salt, $algorithm = 'sha256', $iterations = 8192, $length = 24) {
		if(function_exists('hash_pbkdf2')) {
			return hash_pbkdf2($algorithm, $password, $salt, $iterations, $length, true);
		} else {
			$output = '';
			$block_count = ceil($length / strlen(hash($algorithm, '', true)));  // key length divided by the length of one hash
			for($i = 1; $i <= $block_count; $i++) {
				$last = $salt . pack('N', $i);  // $i encoded as 4 bytes, big endian
				$last = $xorsum = hash_hmac($algorithm, $last, $password, true);  // first iteration
				for($j = 1; $j < $iterations; $j++) {
					$xorsum ^= ($last = hash_hmac($algorithm, $last, $password, true));
				}
				$output .= $xorsum;
			}
			return substr($output, 0, $length);
		}
	}

	private static function getXeMemberConfig() {
		if(!self::$xe_config) {
			$dbm = \DLDB\DBM::instance();

			$prefix = self::getPrefix();

			$que = "SELECT * FROM `".$prefix."module_config` WHERE module = 'member' AND site_srl = 0";
			$row = $dbm->getFetchArray($que);
			self::$xe_config = unserialize($row['config']);
		}
		return self::$xe_config;
	}

	public static function setErrorMsg($errmsg) {
		self::$errmsg = $errmsg;
	}

	public static function errorMsg() {
		return self::$errmsg;
	}
}
?>
