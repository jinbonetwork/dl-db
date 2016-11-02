<?php
namespace DLDB\App\login;

\DLDB\Lib\importLibrary('auth');

$IV = array(
	'GET' => array(
		'requestURI' => array('string', 'default' => null)
	),
	'POST' => array(
		'requestURI' => array('string', 'default' => null)
	)
);

class logout extends \DLDB\Controller {

	public function process() {
		\DLDB\Lib\logout();

		if($_GET['requestURI']) {
			\DLDB\Lib\RedirectURL(rawurldecode($_GET['requestURI']));
		} else {
			\DLDB\Lib\RedirectURL(\DLDB\Lib\base_uri());
		}
	}
}
?>
