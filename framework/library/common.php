<?php
namespace DLDB\Lib;

function Error($msg,$errorcode=505) {
	if($errorcode == DLDB_ERROR_ACTION_AJAX || $_GET['output'] == "json" || $_POST['output'] == "json") {
		\DLDB\Respond::ResultPageJson(array(1,$msg));
	} else {
		\DLDB\Respond::MessagePage($errcode,$msg);
	}
}

function base_uri() {
	$context = \DLDB\Model\Context::instance();
	return $context->getProperty('service.base_uri');
}

function url($path,$opt=null) {
	$url="";
	if($opt['ssl'] && $_SERVER['HTTPS'] != 'on') {
		$context = \DLDB\Model\Context::instance();
		$service = $context->getProperty('service.*');
		if($service['ssl']) $url = "https://".(!preg_match("/:\/\//i",$path) ? $_SERVER['HTTP_HOST'] : "");
	} else if($opt['ssl'] == false && $_SERVER['HTTPS'] == 'on') {
		$url = (!preg_match("/:\/\//i",$path) ? "http://".$_SERVER['HTTP_HOST'] : "");
	}

	if( ROOT != '.' && !preg_match("/:\/\//i",$path) ) {
		$p = strtok($path,"/");
		if(in_array($p,array('resources','contribute','themes','files'))) {
			$path = ROOT."/".$path;
		}
	}

	$url .= (!preg_match("/:\/\//i",$path) ? \DLDB\Lib\base_uri() : "").($path == \DLDB\Lib\base_uri() ? "" : $path);
	if($opt['query'])
		$url .= "?".(is_array($opt['query']) ? http_build_query($opt['query']) : $opt['query']);
	if(substr($url,0,2) == "//") $url = substr($url,1);
	$url = preg_replace("/\/\/$/i","/",$url);
	return $url;
}

function RedirectURL($path,$opt=null) {
	header("Location: ".\DLDB\Lib\url($path,$opt));
	exit;
}

function login_url() {
	if($_GET['requestURI'])
		$requestURI = $_GET['requestURI'];
	else
		$requestURI = ($_SERVER['HTTPS'] == 'on' ? "https://" : "http://").$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
	return \DLDB\Lib\url('login',array('ssl'=>true,'query'=>array('requestURI'=>$requestURI)));
}

function logout_url() {
	return \DLDB\Lib\url('login/logout',array('query'=>array('requestURI'=>($_GET['requestURI'] ? $_GET['requestURI'] : $_SERVER['REQUEST_URI']))));
}

function load_view() {
	return DLDB_APP_CALL_PATH;
}

function user_logged_in() {
	$context = \DLDB\Model\Context::instance();
	if($_SESSION['user']['uid']) return true;
	switch($context->getProperty('session.type')) {
		case "gnu5":
		default:
			if($_SESSION['mb_id']) return true;
			break;
	}
	return false;
}

function isMaster() {
	if($_SESSION['user']['glevel'] == BITWISE_ADMINISTRATOR) return 1;
	else return 0;
}

function isOwner() {
	global $user, $entry;
	if($user['uid'] && $entry['owner'] && $user['uid'] == $entry['owner']) return 1;
	else return 0;
}

function dateDiff($sStartTime, $sEndTime)
{

	if($sStartTime > $sEndTime)
		return false;

	$sDiffTime = $sEndTime - $sStartTime;

	$aReturnValue = floor($sDiffTime/60/60/24);
	return $aReturnValue;
}
//단어 단위로 문자열 짜르기
function cut_str($str, $n, $endChar = '..') 
{
	if (strlen($str) <= $n ) 
		return $str;

	while($str[$n] != " " && strlen($str) != $n ) 
		$n++;

	if ( strlen( $str) <= $n ) 
		return $str ;

	if( $str[$n-1] == ".")
		$endChar = "";
 
	return substr($str, 0, $n) . $endChar;
}

function is_serialized( $data ) {
	// if it isn't a string, it isn't serialized
	if ( !is_string( $data ) )
		return false;
	$data = trim( $data );
	if ( 'N;' == $data )
		return true;
	if ( !preg_match( '/^([adObis]):/', $data, $badions ) )
		return false;
	switch ( $badions[1] ) {
		case 'a' :
		case 'O' :
		case 's' :
			if ( preg_match( "/^{$badions[1]}:[0-9]+:.*[;}]\$/s", $data ) )
				return true;
			break;
		case 'b' :
		case 'i' :
		case 'd' :
			if ( preg_match( "/^{$badions[1]}:[0-9.E-]+;\$/", $data ) )
				return true;
			break;
	}
	return false;
}
?>
