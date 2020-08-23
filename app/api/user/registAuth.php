<?php
namespace DLDB\App\api\user;

$Acl = 'anonymous';

class registAuth extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'html';

		$context = \DLDB\Model\Context::instance();

		$respond = \DLDB\Respond::instance();
		if(!$this->params['email']) {
			$respond->ErrorPage( 503, '아이디를 입력하세요' );
		}
		if(!$this->params['auth_key']) {
			$respond->ErrorPage( 503, '인증키를 입력하세요' );
		}
		$email = $this->params['email'];

		$m = \DLDB\Members\DBM::getMemberByEmail($email);
		if($m['id']) {
			$respond->ErrorPage( 503, '이미 사용중인 아이디입니다.' );
		}
		$member = \DLDB\Members\DBM::getMemberAuth($email,$this->params['auth_key']);
		if(!$member) {
			$respond->ErrorPage( 503, '회원가입 인증정보가 정확하지 않습니다.' );
		}
		$ret = \DLDB\Members\DBM::insert($member);
		if($ret < 0) {
			$respond->ErrorPage( 503, \DLDB\Members\DBM::getErrorMsg() );
		}
		$member['id'] = $ret;
		$this->params['member'] = $member;
	}
}
?>
