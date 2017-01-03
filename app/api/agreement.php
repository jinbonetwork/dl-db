<?php
namespace DLDB\App\api;

$Acl = 'authenticated';

class agreement extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';
		$context = \DLDB\Model\Context::instance();

		if($this->params['agreement']) {
			if($this->params['agreement'] == 1) {
				\DLDB\Members::agreement($this->user['uid']);
				$this->result = array(
					'error' => 0
				);
			} else {
				$this->result = array(
					'error' => -1,
					'message' => '이용약관을 동의해주세요.'
				);
			}
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
