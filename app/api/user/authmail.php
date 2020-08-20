<?php
namespace DLDB\App\api\user;

$Acl = 'anonymous';

class authmail extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';

		$context = \DLDB\Model\Context::instance();

		if(!$this->params['email'] && !$this->params['member']['email']) {
			\DLDB\RespondJson::ResultPage( array( -1, '아이디를 입력하세요' ) );
		}
		$email = ($this->params['email'] ? $this->params['email'] : $this->params['member']['email']);

		$ret = \DLDB\Members\DBM::createFindAuthKey($email);
		if($ret['success'] == -1) {
			\DLDB\RespondJson::ResultPage( array( -1, '존재하지 않는 아이디입니다.' ) );
		} else if(!$ret['success']) {
			\DLDB\RespondJson::ResultPage( array( -2, '지원준비중입니다.' ) );
		} else if($ret['success'] == -2) {
			\DLDB\RespondJson::ResultPage( array( -3, $ret['message'] ) );
		}

		$args['site_title'] = ($site_title ? $site_title : $context->getProperty('service.title'));
		$args['subject'] = $args['site_title']." 임시 비밀번호 발급 안내";
		$args['name'] = $ret['name'];
		$args['user_id'] = $ret['user_id'];
		$args['password'] = $ret['password'];
		$args['link_title'] = '로그인하러 가기';
		$args['link'] = $ret['auth_link'];
		$recievers = array();
		$recievers[] = array( 'email'=> $ret['user_id'], 'name'=> $ret['name'] );

		$result = \DLDB\Mailer::sendMail("auth",$recievers,$args,0);

		if(!$result[0]) {
			\DLDB\RespondJson::ResultPage( array( -3, $result[1]) );
		} else {
			$this->result = array(
				'error' => -4,
				'message' => $ret['user_id'].'로 임시 비밀번호와 인증주소 정보를 보냈습니다. 메일을 확인한 후, 링크를 따라 임시발급 비밀번호로 로그인하신후, 개인정보수정 메뉴를 통해 비번을 재설정해주세요'
			);
		}
	}
}
?>
