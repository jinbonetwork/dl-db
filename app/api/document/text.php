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
		$this->document = \DLDB\Document::get($this->params['id']);
		$acl = \DLDB\Acl::instance();
		if(!$acl->imMaster() && $this->document['uid'] != $this->user['uid']) {
			\DLDB\RespondJson::ResultPage( array( -2, '권한이 없습니다') );
		}
		if($this->params['fid']) {
			$this->file = \DLDB\Files::getFile( $this->params['fid'] );
			if( $this->file['did'] != $this->params['id'] ) {
				\DLDB\RespondJson::ResultPage( array( -2, '권한이 없습니다') );
			}
			if(!preg_match("/image/i",$this->file['mimetype'])) { 
				if(!$this->file['anonymity'] && !$acl->imMaster() && $this->user['uid'] != $this->file['uid']) {
					\DLDB\RespondJson::ResultPage( array( -2, "아직 볼수 없는 파일입니다. 운영자가 확인한 파일만 보실 수 있습니다.") );
				}
			}
		}
		if($this->params['mode'] == 'modify') {
			if($this->params['fid']) {
				if(!$this->params['text']) {
					\DLDB\RespondJson::ResultPage( array( -3, '텍스트내용이 없습니다') );
				}
				\DLDB\Parser::updateParse($this->file,$this->params['text']);
				$files = \DLDB\Files::getList($this->params['id']);
				$memo = '';
				foreach($files as $_file) {
					if($_file['textsize']) {
						$memo .= $_file['text'];
					}
				}
				if(trim($memo) > 0) {
					\DLDB\Document::modifyText( $this->params['id'], trim($memo) );
					switch($context->getProperty('service.search_type')) {
						case 'elastic':
							$else = \DLDB\Search\Elastic::instance();
							$else->setFields();
							$else->update( $this->params['id'], $this->document, $memo);
							break;
						default:
							break;
					}
				}
				$this->result = array(
					'error' => 0,
					'fid' => $this->params['fid']
				);
			} else {
				if(!$this->params['memo']) {
					\DLDB\RespondJson::ResultPage( array( -3, '텍스트내용이 없습니다') );
				}
				\DLDB\Document::modifyText($this->params['id'], $this->params['memo']);
				switch($context->getProperty('service.search_type')) {
					case 'elastic':
						$else = \DLDB\Search\Elastci::instance();
						$else->setFields();
						$else->update( $this->params['id'], $this->document, $memo);
						break;
					default:
						break;
				}
				$this->result = array(
					'error' => 0,
					'did' => $this->params['id']
				);
			}
		} else {
			if( $this->params['fid'] ) {
				$this->result = array(
					'error' => 0,
					'text' => $this->file['text'],
					'header' => $this->file['header']
				);
			} else {
				$this->result = array(
					'error' => 0,
					'memo' => $this->document['memo']
				);
			}
		}
	}
}
?>
