<?php
namespace DLDB\App\api\user;

$Acl = 'authenticated';

class profile extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';

		$this->profile = \DLDB\Member::getUser($this->user['uid']);
		$this->member = \DLDB\Members::getByUid($this->user['uid']);

		switch($this->params['mode']) {
			case 'modify':
				if(!$this->params['name'])
					\DLDB\RespondJson::ResultPage( array( -1, '이름을 입력하세요' ) );
				if(!$this->params['class'])
					\DLDB\RespondJson::ResultPage( array( -1, '기수를 입력하세요' ) );
				if(!$this->params['email'])
					\DLDB\RespondJson::ResultPage( array( -1, '이메일을 입력하세요' ) );
				if(!$this->params['phone'])
					\DLDB\RespondJson::ResultPage( array( -1, '연락처를 입력하세요' ) );
				break;
			default:
				if($this->member) {
					$this->profile = array_merge($this->profile,$this->member);
				}
				$this->result = array(
					'error' => 0,
					'profile' => $this->profile
				);
				break;
		}
	}
}
?>
