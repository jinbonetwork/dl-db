<?php
namespace DLDB;

class Fields extends \DLDB\Objects  {
	private static $fields;

	public static function instance() {
		return self::_instance(__CLASS__);
	}

	public static function getFields($active=1) {
		$context = \DLDB\Model\Context::instance();

		if(!is_array($table)) {
			if($table != 'all') $table = array($table);
		}

		$fields = array();

		self::$fields = $context->getProperty('fields');
		if(!self::$fields) {
			$dbm = \DLDB\DBM::instance();
			$que = "SELECT * FROM {fields} ".($active ? "WHERE active = '".$active."' " : "")."ORDER BY parent ASC, idx ASC";
			while($row = $dbm->getFetchArray($que)) {
				self::$fields[$row['fid']] = self::fetchFields($row);
			}
			$context->setProperty('fields',self::$fields);
		}

		$fields = self::$fields;

		return $fields;
	}

	private static function fetchFields($row) {
		$fields = array();
		foreach($row as $k => $v) {
			if(is_numeric($v)) {
				$fields[$k] = $v;
			} else {
				$fields[$k] = stripslashes($v);
			}
		}
		return $fields;
	}
}
?>
