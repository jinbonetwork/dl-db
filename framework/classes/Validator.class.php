<?php
namespace DLDB;

// Copyright (c) 2004-2010, Needlworks  / Tatter Network Foundation
// All rights reserved. Licensed under the GPL.

// @description Unicode string manipulation class.
class Validator {
	private static $queue;
	
	static public function addRule($iv) {
		if(empty(self::$queue)) self::$queue = array('GET'=>array(),'POST'=>array(),'REQUEST'=>array(),'SERVER'=>array(),'FILES'=>array());
		if(isset($iv['GET'])) self::$queue['GET'] = array_merge(self::$queue['GET'],$iv['GET']);
		if(isset($iv['POST'])) self::$queue['POST'] = array_merge(self::$queue['POST'],$iv['POST']);
		if(isset($iv['REQUEST'])) self::$queue['REQUEST'] = array_merge(self::$queue['REQUEST'],$iv['REQUEST']);
		if(isset($iv['SERVER'])) self::$queue['SERVER'] = array_merge(self::$queue['SERVER'],$iv['SERVER']);
		if(isset($iv['FILES'])) self::$queue['FILES'] = array_merge(self::$queue['FILES'],$iv['FILES']);
	}
	static public function isValid() {
		return self::validate(self::$queue);
	}
	
	static public function validate(&$iv) {
		if (isset($iv['GET'])) {
			if (!self::validateArray($_GET, $iv['GET']))
				return false;
			foreach (array_keys($_GET) as $key) {
				if (!array_key_exists($key, $iv['GET']))
					unset($_GET[$key]);
			}
		} else {
			$_GET = array();
		}

		if (isset($iv['POST'])) {
			if (!self::validateArray($_POST, $iv['POST']))
				return false;
			foreach (array_keys($_POST) as $key) {
				if (!array_key_exists($key, $iv['POST']))
					unset($_POST[$key]);
			}
		} else {
			$_POST = array();
		}

		if (isset($iv['REQUEST'])) {
			if (!self::validateArray($_REQUEST, $iv['REQUEST']))
				return false;
			foreach (array_keys($_REQUEST) as $key) {
				if (!array_key_exists($key, $iv['REQUEST']))
					unset($_REQUEST[$key]);
			}
		} else {
			$_REQUEST = array();
		}

		if (isset($iv['SERVER'])) {
			if (!self::validateArray($_SERVER, $iv['SERVER']))
				return false;
		}

		if (isset($iv['FILES'])) {
			if (!self::validateArray($_FILES, $iv['FILES']))
				return false;
			foreach (array_keys($_FILES) as $key) {
				if (!array_key_exists($key, $iv['FILES']))
					unset($_FILES[$key]);
			}
		} else {
			$_FILES = array();
		}
		return true;
	}

	static public function validateArray(&$array, &$rules) {
		// Workaround for non Fancy-URL user.
		$cropArray = array();
		foreach($array as $name => $value) {
			$doesHaveRequest = strpos($name,'?');
			if($doesHaveRequest !== false) {$name = substr($name,$doesHaveRequest+1);}
			$cropArray[$name] = $value;
		}
		$array = $cropArray;
		foreach ($rules as $key => $rule) {
			if (!isset($rule[0])) {
				trigger_error("Validator: The type of '$key' is not defined", E_USER_WARNING);
				continue;
			}
			if (isset($array[$key]) && (($rule[0] == 'file') || (strlen($array[$key]) > 0))) {
				$value = &$array[$key];
				if (isset($rule['min']))
					$rule[1] = $rule['min'];
				if (isset($rule['max']))
					$rule[2] = $rule['max'];
				if (isset($rule['bypass']))
					$rule[3] = $rule['bypass'];

				switch ($rule[0]) {
					case 'any':
						if (isset($rule[1]) && (strlen($value) < $rule[1]))
							return false;
						if (isset($rule[2]) && (strlen($value) > $rule[2]))
							return false;
						break;
					case 'bit':
						$array[$key] = self::getBit($value);
						break;
					case 'bool':
						$array[$key] = self::getBool($value);
						break;
					case 'number':
						if (!self::number($value, (isset($rule[1]) ? $rule[1] : null), (isset($rule[2]) ? $rule[2] : null), (isset($rule[3]) ? $rule[3] : false)))
							return false;
						break;
					case 'int':
						if (!self::isInteger($value, (isset($rule[1]) ? $rule[1] : -2147483648), (isset($rule[2]) ? $rule[2] : 2147483647), (isset($rule[3]) ? $rule[3] : false)))
							return false;
						break;
					case 'id':
						if (!self::id($value, (isset($rule[1]) ? $rule[1] : 1), (isset($rule[2]) ? $rule[2] : 2147483647)))
							return false;
						break;
					case 'url':
					case 'string':
						if (!UTF8::validate($value)) {
							$value = UTF8::bring($value);
							if (!UTF8::validate($value))
								return false;
						}
						$value = $array[$key] = UTF8::correct($value);

						if (isset($rule[1]) && (UTF8::length($value) < $rule[1]))
							return false;
						if (isset($rule[2]) && (UTF8::length($value) > $rule[2]))
							return false;
						break;
					case 'list':
						if (!self::isList($value))
							return false;
						break;
					case 'timestamp':
						if (!self::timestamp($value))
							return false;
						break;
					case 'period':
						if (!self::period($value))
							return false;
						break;
					case 'ip':
						if (!self::ip($value))
							return false;
						break;
					case 'phone':
						if (!self::phone($value))
							return false;
						break;
					case 'domain':
						if (!self::domain($value))
							return false;
						break;
					case 'email':
						if (!self::email($value))
							return false;
						break;
					case 'language':
						if (!self::language($value))
							return false;
						break;
					case 'filename':
						if (!self::filename($value))
							return false;
						break;
					case 'directory':
						if (!self::directory($value))
							return false;
						break;
					case 'path':
						if (!self::path($value))
							return false;
						break;
					case 'file':
						if (!isset($value['name']) || preg_match('@[/\\\\]@', $value['name']))
							return false;
						break;
					default:
						if (is_array($rule[0])) {
							if (!in_array($value, $rule[0]))
								return false;
						} else {
							trigger_error("Validator: The type of '$key' is unknown", E_USER_WARNING);
						}
						break;
				}

				if (isset($rule['check']))
					$rule[5] = $rule['check'];
				if (isset($rule[5])) {
					if (function_exists($rule[5])) {
						if (!call_user_func($rule[5], $value))
							return false;
					} else {
						trigger_error("Validator: The check function of '$key' is not defined", E_USER_WARNING);
					}
				}
			} else {
				if (array_key_exists(3, $rule))
					$array[$key] = $rule[3];
				else if (array_key_exists('default', $rule))
					$array[$key] = $rule['default'];
				else if ((!isset($rule[4]) || $rule[4]) && (!isset($rule['mandatory']) || $rule['mandatory']))
					return false;
			}
		}
		return true;
	}

	static public function number($value, $min = null, $max = null, $bypass = false) {
		if (($bypass === false) && !is_numeric($value))
			return false;
		if(!is_null($value)) {
			if (isset($min) && ($value < $min))
				return false;
			if (isset($max) && ($value > $max))
				return false;
		}
		return true;
	}

	static public function isInteger($value, $min = -2147483648, $max = 2147483647, $bypass = false) {
		if (($bypass === false) && !preg_match('/^(0|-?[1-9][0-9]{0,9})$/', $value))
			return false;
		if(!is_null($value)) {
			if (($value < $min) || ($value > $max))
				return false;
		}
		return true;
	}

	static public function id($value, $min = 1, $max = 2147483647) {
		return self::isInteger($value, $min, $max);
	}

	static public function isList($value) {
		if (!preg_match('/^[1-9][0-9]{0,9}(,[1-9][0-9]{0,9})*,?$/', $value))
			return false;
		return true;
	}

	/**
	 *	Valid: Jan 1 1971 ~ Dec 31 2037 GMT
	 */
	
	static public function timestamp($value) {
		return (self::isInteger($value) && ($value >= 31536000) && ($value < 2145916800));
	}

	static public function period($value, $length = null) {
		if (preg_match('/\\d+/', $value)) {
			if (isset($length) && (strlen($value) != $length))
				return false;
			$year = 0;
			$month = 1;
			$day = 1;
			switch (strlen($value)) {
				case 8:
					$day = substr($value, 6, 2);
				case 6:
					$month = substr($value, 4, 2);
				case 4:
					$year = substr($value, 0, 4);
					return checkdate($month, $day, $year);
			}
		}
		return false;
	}

	static public function ip($value) {
		return preg_match('/^\\d{1,3}(\\.\\d{1,3}){3}$/', $value);
	}

	static public function phone($value) {
		return preg_match('/^\\d{3,4}\\-\\d{3,4}\\-\\d{4}$/', $value);
	}

	static public function domain($value) {
		return ((strlen($value) <= 64) && preg_match('/^([[:alnum:]]+(-[[:alnum:]]+)*\\.)+[[:alnum:]]+(-[[:alnum:]]+)*$/', $value));
	}

	static public function email($value) {
		if (strlen($value) > 64)
			return false;
		$parts = explode('@', $value, 2);
		return ((count($parts) == 2) && preg_match('@[\\w!#\-\'*+/=?^`{-~-]+(\\.[\\w!#-\'*+/=?^`{-~-]+)*@', $parts[0]) && self::domain($parts[1]));
	}

	static public function language($value) {
		return preg_match('/^[[:alpha:]]{2}(\-[[:alpha:]]{2})?$/', $value);
	}

	static public function filename($value) {
		return preg_match('/^\w+(\.\w+)*$/', $value);
	}

	static public function directory($value) {
		return preg_match('/^[\-\w]+( [\-\w]+)*$/', $value);
	}

	static public function path($value) {
		return preg_match('/^[\-\w]+( [\-\w]+)*(\/[\-\w]+( [\-\w]+)*)*$/', $value);
	}

	static public function getBit($value) {
		return (self::getBool($value) ? 1 : 0);
	}

	static public function getBool($value) {
		return (!empty($value) && (!is_string($value) || (strcasecmp('false', $value) && strcasecmp('off', $value) && strcasecmp('no', $value))));
	}

	static public function escapeXML($string, $escape = true) {
		if (is_null($string))
			return null;
		return ($escape ? htmlspecialchars($string) : str_replace('&amp;', '&', preg_replace(array('&quot;', '&lt;', '&gt;'), array('"', '<', '>'), $string)));
	}
}
?>
