<?php
namespace DLDB;

/// Copyright (c) 2004-2010, Needlworks  / Tatter Network Foundation
/// All rights reserved. Licensed under the GPL.
/// See the GNU General Public License for more details. (/documents/LICENSE, /documents/COPYRIGHT)
class Respond extends \DLDB\Objects {
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
		header('Content-Type: application/xml; charset=utf-8');
		print ("<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<response>\n<error>$error</error>\n<message><![CDATA[$errorMsg]]></message></response>");
		exit;
	}
	
	public static function PrintResult($result, $useCDATA=true) {
		header('Content-Type: application/xml; charset=utf-8');
		$xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
		$xml .= "<response>\n";
		$xml .= self::PrintValue($result, $useCDATA);
		$xml .= "</response>\n";
		die($xml);
	}
	
	public static function NotFoundPage($isAjaxCall = false) {
		if($isAjaxCall) {self::ResultPage(-1);exit;}
		header('HTTP/1.1 404 Not Found');
		header("Content-Type: text/html; charset=utf-8");
		header("Connection: close");
		self::MessagePage(404,'존재하지 않는 페이지입니다.');
		exit;
	}
	
	public static function ForbiddenPage() {
		header('HTTP/1.1 403 Forbidden');
		header("Content-Type: text/html; charset=utf-8");
		header("Connection: close");
		self::MessagePage(403,'접근이 허용되지 않는 페이지입니다.');
		exit;
	}
	
	public static function MessagePage($type,$message) {
		header("Content-Type: text/html; charset=utf-8");
		include_once DLDB_RESOURCE_PATH."/html/error.html.php";
		exit;
	}

	public static function AlertPage($message) {
		include_once DLDB_RESOURCE_PATH."/html/alert.html.php";
		exit;
	}
	
	public function ErrorPage($type, $message, $isAjaxCall = false) {
		if($isAjaxCall) {self::ResultPage(-1);exit;}

		$context = \DLDB\Model\Context::instance();
		$themes = $context->getProperty('service.themes');
		if($themes && file_exists(DLDB_PATH."/themes/".$themes."/error.html.php")) {
			if((!defined('DLDB_LAYOUT_LOADED') || DLDB_LAYOUT_LOADED == false) && file_exists(DLDB_PATH."/themes/".$themes."/layout.html.php")) {
				ob_start();
				$this->site_title = $context->getProperty('service.title');
				switch($type) {
					case 401:
						$breadcrumbs_class = 'error unauthorized';
						$this->title = '로그인이 필요합니다';
						break;
					case 403:
						$breadcrumbs_class = 'error access_denied';
						$this->title = '접근권한이 없습니다';
						break;
					case 404:
						$breadcrumbs_class = 'error page_not_found';
						$this->title = '존재하지 않는 페이지입니다';
						break;
					case 423:
						$breadcrumbs_class = 'error page_locked';
						$this->title = '페이지가 잠겨있습니다';
						break;
					case 503:
						$breadcrumbs_class = 'error service_unavail';
						$this->title = '이용가능하지 않는 서비스입니다';
						break;
					case 505:
					default:
						$breadcrumbs_class = 'error system_error';
						$this->title = '서비스장애';
						break;
				}
				$title = $this->title;
				include_once DLDB_PATH."/themes/".$themes."/error.html.php";
				$content = ob_get_contents();
				ob_end_clean();
				include_once DLDB_PATH."/themes/".$themes."/layout.html.php";
			} else {
				include_once DLDB_PATH."/themes/".$themes."/error.html.php";
			}
		} else {
			include_once DLDB_RESOURCE_PATH."/html/error.html.php";
		}
		exit;
	}

	public function header() {
		$context = \DLDB\Model\Context::instance();
		$themes = $context->getProperty('service.themes');

		if( file_exists(DLDB_PATH."/themes/".$themes."/style.css") ) {
			echo '	<link rel="stylesheet" href="'.DLDB_URI.'themes/'.$themes.'/style.css" />';
		}
		if( file_exists(DLDB_PATH."/themes/".$themes."/css/style.css") ) {
			echo '	<link rel="stylesheet" href="'.DLDB_URI.'themes/'.$themes.'/css/style.css" />';
		}
	}

	public function footer() {
	}
	
	public static function NoticePage($message, $redirection) {
		include_once DLDB_RESOURCE_PATH."/html/alert.html.php";
		exit;
	}

	public static function PrintValue($array, $useCDATA=true) {
		$xml = '';
		if(is_array($array)) {
			foreach($array as $key => $value) {
				if(is_null($value))
					continue;
				else if(is_array($value)) {
					if(is_numeric($key))
						$xml .= self::PrintValue($value, $useCDATA)."\n";
					else
						$xml .= "<$key>".self::PrintValue($value, $useCDATA)."</$key>\n";
				}
				else {
					if($useCDATA)
						$xml .= "<$key><![CDATA[".self::escapeCData($value)."]]></$key>\n";
					else
						$xml .= "<$key>".htmlspecialchars($value)."</$key>\n";
				}
			}
		}
		return $xml;
	}
	
	public static function escapeJSInAttribute($str) {
		return htmlspecialchars(str_replace(array('\\', '\r', '\n', '\''), array('\\\\', '\\r', '\\n', '\\\''), $str));
	}

	public static function escapeCData($str) {
		return str_replace(']]>', ']]&gt;', $str);
	}
}
?>
