<?php
namespace DLDB\Lib;

/*function Login($loginid, $password) {
	$context = \DLDB\Model\Context::instance();
	$result = \DLDB\Auth::authenticate($loginid,$password);
	if(!$result) {
		$err = \DLDB\Auth::error();
		if(preg_match("/비밀번호/i",$err)) {
			$ret = -2;
		} else if(preg_match("/아이디/i",$err)) {
			$ret = -1;
		} else {
			$ret = -3;
		}
	} else {
		$ret = 0;
	}

	return $ret;
} */

function Logout() {
	unset($_SESSION);
	session_destroy();
}

function requireLogin() {
	$context = \DLDB\Model\Context::instance();
	$service = $context->getProperty('service.*');
	$requestURI = ($_SERVER['HTTPS'] == 'on' ? "https://" : "http://").$service['domain'].$_SERVER['REQUEST_URI'];
	\DLDB\Lib\RedirectURL('login',array('ssl'=>true,'query'=>array('requestURI'=>$requestURI)));
}

function doesHaveMembership() {
	$context = \DLDB\Model\Context::instance();
	$domain = $context->getProperty('service.domain');
	$__Acl = \DLDB\Acl::instance();
	return $__Acl->getIdentity($domain) !== null;
}

function requireMembership() {
	$context = \DLDB\Model\Context::instance();
	$domain = $context->getProperty('service.domain');
	$__Acl = \DLDB\Acl::instance();
	if($__Acl->getIdentity($domain) !== null) {
		return true;
	}
	\DLDB\Lib\requireLogin();
}
?>
