<?php
namespace DLDB\App\api\document;

$Acl = 'view';

class report extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';
		$context = \DLDB\Model\Context::instance();

		if(!$this->params['id']) {
			\DLDB\RespondJson::ResultPage( array( -1, '문서번호를 지정하세요') );
		}
		$this->document = \DLDB\Document::get($this->params['id'],'view');
		if(!$this->document) {
			\DLDB\RespondJson::ResultPage( array( -1, '존재하지 않는 문서입니다') );
		}

		if(!$this->params['memo']) {
			\DLDB\RespondJson::ResultPage( array( -2, '신고 내용을 적어주세요') );
		}
		$member = \DLDB\Members::getByUid($this->user['uid']);
		if($this->document['uid']) {
			$document_member = \DLDB\Members::getByUid($document['uid']);
		}
		$admins = \DLDB\Members\DBM::getAdminID();
		if( @count($admins) > 0 ) {
			$args['name'] = ($document_member['name'] ? ? $document_member['name'] : '익명의 회원');
			$args['reporter_name'] = $member['name'];
			$args['reporter_email'] = $member['email'];
			$args['subject'] = $member['name']."님이 ".$context->getProperty('service.title')." 에 신고내용을 접수하셨습니다.";
			$args['title'] = $document['subject'];
			$args['content'] = nl2br($this->params['memo']);
			$args['link'] = \DLDB\Lib\full_url('document/'.$document['id'],array('ssl'=>$context->getProperty('service.ssl')));
			$args['link_title'] = '문서보기';
			$recievers = array();
			foreach($admins as $adminID) {
				$recievers[] = array('email' => $adminID['email'], 'name' => $adminID['name'] );
			}

			$result = \DLDB\Mailer::sendMail("report",$recievers,$args,0);
			if(!$result[0]) {
				\DLDB\RespondJson::ResultPage( array( -3, $result[1]) );
			} else {
				$this->result = array(
					'error'=>0,
					'message'=>'신고내용이 운영자에게 메일로 전송되었습니다. 운영자가 확인후 처리하는데 시간이 걸릴 수 있습니다.'
				);
			}
		} else {
			\DLDB\RespondJson::ResultPage( array( -3, '운영자 정보를 검색할 수 없습니다.') );
		}
	}
}
?>
