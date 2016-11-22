<?php
namespace DLDB\App\api;

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
		$this->params['output'] = 'json';
		\DLDB\Lib\logout();

		$this->result = array('error' => 0, 'requestURI' => ($this->params['requestURI'] ? $this->params['requestURI'] : \DLDB\Lib\base_uri() ) );
	}
}
?>
