<?php
namespace DLDB\App\api\document;

$Acl = 'administrator';

class anonymity extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';

		if(!$this->params['fid']) {
			\DLDB\RespondJson::ResultPage( array( -1, '파일번호를 입력하세요.') );
		}
		$this->file = \DLDB\Files::getFile( $this->params['fid'] );
		if(!$this->file) {
			\DLDB\RespondJson::ResultPage( array( -2, '존재하지 않는 파일입니다.') );
		}
		if(!$this->params['anonymity'])
			$this->params['anonymity'] = 0;

		$ret = \DLDB\Files::anonymity( $this->params['fid'], $this->params['anonymity'] );
		$this->result = array(
			'error' => 0,
			'fid' => $this->params['fid'],
			'anonymity' => $this->params['anonymity']
		);
	}
}
?>
