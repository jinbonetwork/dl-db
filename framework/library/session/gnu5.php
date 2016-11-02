<?php
namespace DLDB\Lib\session;

function init_session() {
	$context = \DLDB\Model\Context::instance();

	define("G5_SESSION_PATH", DLDB_PATH."/gnu5/data/session");

	@ini_set("session.use_trans_sid", 0);
	@ini_set("url_rewriter.tags","");

	session_save_path(G5_SESSION_PATH);
	if (isset($SESSION_CACHE_LIMITER))
		@session_cache_limiter($SESSION_CACHE_LIMITER);
	else
		@session_cache_limiter("no-cache, must-revalidate");

	ini_set("session.cache_expire", 180);
	ini_set("session.gc_maxlifetime", 10800);
	ini_set("session.gc_probability", 1);
	ini_set("session.gc_divisor", 100);

	session_set_cookie_params( 0, $context->getProperty('session.cookie_path') );
	ini_set("session.cookie_domain" ,$context->getProperty('session.cookie_domain') );

	@session_start();

	if (isset($_REQUEST['PHPSESSID']) && $_REQUEST['PHPSESSID'] != session_id()) {
		\DLDB\Lib\RedirectUrl('login/logout');
	}
}
?>
