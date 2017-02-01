<?php
namespace DLDB\App\api\admin\agreement;

$Acl = 'administrator';

class index extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';

		if($this->params['mode'] == 'modify') {
		}
	}
}
?>
