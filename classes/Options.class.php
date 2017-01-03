<?php
namespace DLDB;

class Options extends \DLDB\Objects {
	public static function instance() {
		return self::_instance(__CLASS__);
	}

	public static function getOption($name) {
		$dbm = \DLDB\DBM::instance();

		$que = "SELECT * FROM {options} WHERE name = '".addslashes($name)."'";

		$row = $dbm->getFetchArray($que);
		if($row) {
			$row['value'] = stripslashes($row['value']);
			if( self::is_serialized($row['value']) ) {
				$value = unserialize($row['value']);
			} else {
				$value = $row['value'];
			}
		}
		return $value;
	}

	public static function saveOption($name,$value) {
		$dbm = \DLDB\DBM::instance();

		if(is_array($value)) {
			$value = serialize($value);
		}

		$que = "SELECT * FROM {options} WHERE name = '".addslashes($name)."'";
		$row = $dbm->getFetchArray($que);
		if($row) {
			$que = "UPDATE {options} SET value = ? WHERE name = ?";
			$dbm->execute($que,array("ss",$value,$name));
		} else {
			$que = "INSERT INTO {options} (`name`,`value`) VALUES (?,?)";
			$dbm->execute($que,array("ss",$name,$value));
		}
	}

	private static function is_serialized($value) {
		// Bit of a give away this one
		if (!is_string($value)) {
			return false;
		}
		// Serialized false, return true. unserialize() returns false on an
		// invalid string or it could return false if the string is serialized
		// false, eliminate that possibility.
		if ($value === 'b:0;') {
			return true;
		}
		$length	= strlen($value);
		$end	= '';
		switch ($value[0]) {
			case 's':
				if ($value[$length - 2] !== '"') {
					return false;
				}
			case 'b':
			case 'i':
			case 'd':
				// This looks odd but it is quicker than isset()ing
				$end .= ';';
			case 'a':
			case 'O':
				$end .= '}';
				if ($value[1] !== ':') {
					return false;
				}
				switch ($value[2]) {
					case 0:
					case 1:
					case 2:
					case 3:
					case 4:
					case 5:
					case 6:
					case 7:
					case 8:
					case 9:
						break;
					default:
						return false;
				}
			case 'N':
				$end .= ';';
				if ($value[$length - 1] !== $end[0]) {
					return false;
				}
				break;
			default:
				return false;
		}
		if (($result = @unserialize($value)) === false) {
			return false;
		}
		return true;
	}
}
?>
