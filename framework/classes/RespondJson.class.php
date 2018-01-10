<?php
namespace DLDB;
/// Copyright (c) 2004-2010, Needlworks  / Tatter Network Foundation
/// All rights reserved. Licensed under the GPL.
/// See the GNU General Public License for more details. (/documents/LICENSE, /documents/COPYRIGHT)
class RespondJson extends \DLDB\Objects {
	public static function instance() {
		return self::_instance(__CLASS__);
	}

	public static function ResultPage($errorResult) {
		if (is_array($errorResult) && count($errorResult) < 2) {
			$errorResult = array_shift($errorResult);
		}
		if (is_array($errorResult)) {
			$error = $errorResult[0];
			$errorMsg = $errorResult[1];
		} else {
			$error = $errorResult;
			$errorMsg = '';
		}
		if ($error === true)
			$error = 0;
		else if ($error === false)
			$error = 1;
		header('Content-Type: application/json; charset=utf-8');
		$repond = array('error'=>$error, 'message'=>$errorMsg);
		print json_encode($repond);
		exit;
	}
	
	public static function PrintResult($result, $useCDATA=true) {
		header('Content-Type: application/json; charset=utf-8');
		print json_encode($result);
		exit;
	}
	
	public static function NotFoundPage($isAjaxCall = false) {
		self::ResultPage(-1);
		exit;
	}
}
?>
