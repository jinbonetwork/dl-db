<?php
namespace DLDB\App\api;

$Acl = "anonymouse";

class index extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';
		$context = \DLDB\Model\Context::instance();

		$this->user_info = \DLDB\Member::getUser($_SESSION['user']['uid']);
		$acl = \DLDB\Acl::instance();
		$this->role = $acl->getAcl();
	}
}
?>
