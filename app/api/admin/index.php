<?php
namespace DLDB\App\api\admin;

$Acl = 'administrator';

class index extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';
		$context = \DLDB\Model\Context::instance();
	}
}
