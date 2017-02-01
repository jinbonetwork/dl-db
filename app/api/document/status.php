<?php
namespace DLDB\App\api\document;

$Acl = 'write';

class status extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';

		if(!$this->params['fid']) {
			\DLDB\RespondJson::ResultPage( array( -1, '파일번호를 입력하세요.') );
		}
		$this->file = \DLDB\Files::getFile( $this->params['fid'] );
		if(!$this->file) {
			\DLDB\RespondJson::ResultPage( array( -2, '존재하지 않는 파일입니다.') );
		}
		if( !in_array($this->params['status'],array('uploaded','parsed')) ) {
			\DLDB\RespondJson::ResultPage( array( -3, '허용되지 않는 상태정보입니다.') );
		}

		$acl = \DLDB\Acl::instance();
		if(!$acl->imMaster() && $this->file['uid'] != $this->user['uid']) {
			\DLDB\RespondJson::ResultPage( array( -4, '수정 권한이 없습니다') );
		}

		$ret = \DLDB\Files::status( $this->params['fid'], $this->params['status'] );
		$this->result = array(
			'error' => 0,
			'fid' => $this->params['fid'],
			'status' => $this->params['status']
		);
	}
}
?>
