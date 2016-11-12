<?php
namespace DLDB\App\api\user;

$Acl = 'authenticated';

class profile extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';

		$this->profile = \DLDB\Member::getUser($this->user['uid']);
		$this->member = \DLDB\Members::getByUid($this->user['uid']);
		if($this->member) {
			$this->profile = array_merge($this->profile,$this->member);
		}
		$this->result = array(
			'error' => 0,
			'profile' => $this->profile
		);
	}
}
?>
