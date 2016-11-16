<?php
namespace DLDB\App\api\document;

$Acl = 'write';

class text extends \DLDB\Controller {
	public function process() {
		$this->params['output']= 'json';
		$context = \DLDB\Model\Context::instance();

		if(!$this->params['id']) {
			\DLDB\RespondJson::ResultPage( array( -1, '문서번호를 입력하세요') );
		}
		$this->document = \DLDB\Document::getTexts($this->params['id']);
		$acl = \DLDB\Acl::instance();
		if(!$acl->imMaster() && !$this->document['uid'] != $this->user['uid']) {
			\DLDB\RespondJson::ResultPage( array( -2, '권한이 없습니다') );
		}
		$this->result = array(
			'error' => 0,
			'memo' => $this->document['memo']
		);
	}
}
?>
