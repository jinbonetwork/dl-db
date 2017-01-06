<?php
namespace DLDB\App\api\admin\member;

$Acl = 'administrator';

class save extends \DLDB\Controller {
	public function process() {
		if($this->params['mode'] != 'add') {
			if(!$this->params['id']) {
				\DLDB\RespondJson::ResultPage( array( -2, '회원번호를 입력하세요') );
			}
			$member = \DLDB\Members:get($this->params['id']);
			if(!$member) {
				\DLDB\RespondJson::ResultPage( array( -2, '존재하지 않는 회원입니다.') );
			}
			if($this->params['mode'] != 'delete') {
				if(!$this->params['name']) {
					\DLDB\RespondJson::ResultPage( array( -3, '이름을 입력하세요.') );
				}
			}
		}
		switch($this->params['mode']) {
			case 'add':
				break;
			case 'modify':
				\DLDB\Members:modify($member,$this->params);
				break;
			case 'delete':
				break;
		}
	}
}
?>
