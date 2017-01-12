<?php
namespace DLDB\App\admin;

$Acl = 'anonymous';

class index extends \DLDB\Controller {
	public function process() {
		$context = \DLDB\Model\Context::instance();
		$this->layout = 'admin';
	}
}
?>
