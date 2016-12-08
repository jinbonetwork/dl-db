<?php
namespace DLDB;

class Menu extends \DLDB\Objects {
	public static function instance() {
		return self::_instance(__CLASS__);
	}

	public static function getMenu() {
		$context = \DLDB\Model\Context::instance();

		$session_type = $context->getProperty('session.type');
		$classname = "DLDB\\Model\\".strtoupper($session_type);

		$acl = new $classname;
		$menu = $acl->getMenu();

		return $menu;
	}
}
