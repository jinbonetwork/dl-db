<?php
namespace DLDB\App\api\file;

$Acl = 'write';

class upload extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';

		$context = \DLDB\Model\Context::instance();
		$acl = \DLDB\Acl::instance();

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

		if($this->params['fid']) {
			$old_file = \DLDB\Files::getFile($this->params['fid']);
			if(!$old_file) {
				\DLDB\RespondJson::ResultPage( array( -2, '존재하지 않는 파일입니다') );
			}
			if($old_file['did'] != $this->params['did']) {
				\DLDB\RespondJson::ResultPage( array( -3, '해당 파일('.$this->params['fid'].')은 해당 문서('.$this->params['did'].')에 소속되지 않은 파일입니다') );
			}
			foreach( $fields as $fid => $v ) {
				if( $v['type'] == 'image' || $v['type'] == 'file' ) {
					if($custom[$fid][$this->params['fid']]) {
						if( $_FILES['f'.$fid] ) {
							if(file_exists(DLDB_DATA_PATH.$old_file['filepath'])) {
								\DLDB\Files::unlinkFile(DLDB_DATA_PATH.$old_file['filepath']);
							}
							if( $v['type'] == 'image' ) {
								$permit = 'jpg|jpeg|gif|bmp|png';
							} else {
								$permit = 'pdf|hwp|doc|docx';
								$attated_exists = true;
							}
							$_file = $_FILES['f'.$fid];
							$filename = \DLDB\Files::uploadFile($_file,$permit);
							if(!$filename) {
								\DLDB\RespondJson::ResultPage( array( $fid, $v['subject'].': '.\DLDB\Files::errMsg() ) );
							}
							$fd = \DLDB\Files::modifyFile( $this->params['fid'], $filename);
							$fileinfo = \DLDB\Files::getFile($fd);
							if(!preg_match("/^image/i",$fileinfo['mimetype']) && $acl->imMaster()) {
							}
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
		} else {
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
//								if(!isset($this->document['f'.$fid])) $this->document['f'.$fid] = array();
//								$this->document['f'.$fid][] = $fd;
								$fileinfo = \DLDB\Files::getFile($fd);
								if(!preg_match("/^image/i",$fileinfo['mimetype']) && $acl->imMaster()) {
									\DLDB\Files::anonymity($fd,1);
									$fileinfo['anonymity'] = 1;
								}
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
		}
		if($custom_update) {
			\DLDB\Document::updateCustom($this->params['did'],$custom);
		}
		if($attated_exists) {
			if(!$acl->imMaster()) {
				$_sendmail = 1;
			} else {
				$_sendmail = 0;
			}
			\DLDB\Parser::forkParser( $this->params['did'], $_sendmail );
		}
		$this->result = array(
			'error' => 0,
			'files' => $this->files
		);
	}
}
?>
