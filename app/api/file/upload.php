<?php
namespace DLDB\App\api\file;

$Acl = 'write';

class upload extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';

		$context = \DLDB\Model\Context::instance();

		if( !$this->params['did'] ) {
			\DLDB\RespondJson::ResultPage( array( -1, '문서번호를 입력하세요') );
		}
		$this->document = \DLDB\Document::get( $this->params['did'] );
		if(!$this->document) {
			\DLDB\RespondJson::ResultPage( array( -1, '존재하지 않는 문서입니다') );
		}

		$fields = \DLDB\Document::getFields();
		$this->fields = array();
		$attated_exists = false;
		$custom_update = false;
		$custom = $this->document['custom'];
		foreach( $fields as $fid => $v ) {
			if( $v['type'] == 'image' || $v['type'] == 'file' ) {
				if( $_FILES['f'.$fid] ) {
					if( $v['type'] == 'image' ) {
						$permit = 'jpg|jpeg|gif|bmp|png';
					} else {
						$permit = 'pdf|hwp|doc|docx';
						$attated_exists = true;
					}
					if( is_array( $_FILES['f'.$fid]['name'] ) && @count( $_FILES['f'.$fid]['name'] ) ) {     
						foreach( $_FILES['f'.$fid]  as $k => $arr ) {
							for($i=0; $i<@count($arr); $i++) {
								$__files[$i][$k] = $arr[$i];
							}
						}
					} else {
						$__files = array($_FILES['f'.$fid]);
					}
					foreach($__files as $_file) {
						$filename = \DLDB\Files::uploadFile($_file,$permit);
						if(!$filename) {
							\DLDB\RespondJson::ResultPage( array( $fid, $v['subject'].': '.\DLDB\Files::errMsg() ) );
						}
						$fd = \DLDB\Files::insertFile( ( $this->params['did'] ? $this->params['did'] : 0 ), $filename);
						if($fd) {
//							if(!isset($this->document['f'.$fid])) $this->document['f'.$fid] = array();
//							$this->document['f'.$fid][] = $fd;
							$fileinfo = \DLDB\Files::getFile($fd);
							$custom[$fid][$fd] = array(
								'fileuri' => \DLDB\Files::getFileUrl($fileinfo),
								'filepath' => $fileinfo['filepath'],
								'filename' => $fileinfo['filename'],
								'mimetype' => $fileinfo['mimetype']
							);
							$custom_update = true;
							$this->files[$fid][$fd] = array(
								'filename' => $fileinfo['filename'],
								'fileuri' => \DLDB\Files::getFileUrl($fileinfo),
								'status' => $fileinfo['status'],
								'anonymity' => $fileinfo['anonymity']
							);
						}
					}
				}
			}
		}
		if($custom_update) {
			\DLDB\Document::updateCustom($this->params['did'],$custom);
		}
		if($attated_exists) {
			\DLDB\Parser::forkParser($this->params['did']);
		}
		$this->result = array(
			'error' => 0,
			'files' => $this->files
		);
	}
}
?>
