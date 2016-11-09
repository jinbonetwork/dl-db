<?php
namespace DLDB\App\api;

$Acl = "write";

class members extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';
		$context = \DLDB\Model\Context::instance();

		if($this->params['q']) {
			$this->members = \DLDB\Members::search($this->params['q']);
		}
	}
}
?>
