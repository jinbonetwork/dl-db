<?php
namespace DLDB\Search;

class ParseQue extends \DLDB\Objects {
	private static $que;

	public static function instance() {
		return self::_instance(__CLASS__);
	}

	public static function parse($q) {
		self::$que = array(
			'and'=>array(),
			'not'=>array(),
			'or'=>array(),
			'string'=>''
		);
		$ques = array();
		if( preg_match("/^\"(.+)\"$/i", trim($q), $matched ) ) {
			self::$que['string'] = $matched[1];
			return self::$que;
		}
		$q = preg_replace("/([ ]*)\!([ ]*)/i","!",trim($q));
		$q = preg_replace("/([ ]*)\&([ ]*)/i","&",$q);
		$ques = preg_split("/[\+ ]+/i", $q );
		if( is_array( $ques ) ) {
			foreach( $ques as $que ) {
				if(trim($que)) {
					$_and_que = explode("&",$que);
					if(@count($_and_que) > 1) {
						foreach($_and_que as $q) {
							self::$que['and'][] = trim($q);
						}
					} else {
						$_not_que = preg_split("/\!/i",trim($que));
						if(@count($_not_que) > 0) {
							if(trim($_not_que[0]))
								self::$que['or'][] = trim($_not_que[0]);
							for($i=1; $i<@count($_not_que); $i++) {
								self::$que['not'][] = trim($_not_que[$i]);
							}
						} else {
							self::$que['or'][] = trim($que);
						}
					}
				}
			}
		}
		return self::$que;
	}
}
?>
