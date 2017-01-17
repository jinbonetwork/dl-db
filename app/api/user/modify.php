<?php
namespace DLDB\App\api\user;

$Acl = 'authenticated';

class modify extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';

		if(!$this->params['name']) {
			\DLDB\RespondJson::ResultPage( array( -1, '이름을 입력하세요' ) );
		}
		if(!$this->params['email']) {
			\DLDB\RespondJson::ResultPage( array( -2, '이메일을 입력하세요' ) );
		}
		if($this->params['password']) {
			if(!$this->params['password_confirm']) {
				\DLDB\RespondJson::ResultPage( array( -3, '비밀번호 확인을 입력하세요' ) );
			}
			if($this->params['password'] != $this->params['password_confirm']) {
				\DLDB\RespondJson::ResultPage( array( -3, '비밀번호가 서로 일치하지 않습니다.' ) );
			}
		}

		$member = \DLDB\Members::getByUid($user['uid']);
		if(!$member) {
			\DLDB\RespondJson::ResultPage( array( -99, '회원정보가 없습니다.' ) );
		}

	}
}
?>
