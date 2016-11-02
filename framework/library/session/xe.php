<?php
namespace DLDB\Lib\session;

function init_session() {
	$context = \DLDB\Model\Context::instance();

	@session_start();

	if (isset($_REQUEST['PHPSESSID']) && $_REQUEST['PHPSESSID'] != session_id()) {
		\DLDB\Lib\RedirectUrl('login/logout');
	}
}
?>
