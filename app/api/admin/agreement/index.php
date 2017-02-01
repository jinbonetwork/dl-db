<?php
namespace DLDB\App\api\admin\agreement;

$Acl = 'administrator';

class index extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';

		if($this->params['mode'] == 'modify') {
			\DLDB\Options\saveOption('agreement',$this->params['content']);
			$this->result = array(
				'error' => 0,
				'message' => '저장되었습니다.'
			);
		} else {
			$agreement = \DLDB\Options::getOption('agreement');
			$this->result = array(
				'error' => ($agreement ? 0 : -1),
				'agreement' => $agreement
			);
		}
	}
}
?>
