<?php
namespace DLDB\Search;

class ParseQue extends \DLDB\Objects {
	private static $que;

	public static function instance() {
		return self::_instance(__CLASS__);
	}

	public static function parse($q) {
		self::$que = array();
		$ques = array();
		$ques = preg_split("/[\+ ]+/i",$q);
		if( is_array( $ques ) ) {
			foreach( $ques as $que ) {
				if(trim($que)) {
					$_and_que = explode("&",$que);
					if(@count($_and_que) > 1) {
						self::$que[] = array(
							'type'=>'and',
							'que' => $_and_que
						);
					} else {
						$_not_que = explode("!",$que);
						if(@count($_not_que) > 1) {
							self::$que[] = array(
								'type'=>'not',
								'que' => $_not_que
							);
						} else {
							self::$que[] = array(
								'type'=>'string',
								'que' => trim($que)
							);
						}
					}
				}
			}
		}
		return self::$que;
	}
}
?>
