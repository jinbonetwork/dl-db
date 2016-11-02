<?php
namespace DLDB;
class Member extends \DLDB\Objects {
	public static function instance() {
		return self::_instance(__CLASS__);
	}

	public static function getUser($uid) {
		$context = \DLDB\Model\Context::instance();

		$session_type = $context->getProperty('session.type');
		$classname = "DLDB\\Model\\".strtoupper($session_type);

		$acl = new $classname;
		$user = $acl->getMember($uid);

		return $user;
	}
}
?>
