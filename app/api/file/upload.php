<?php
namespace DLDB\App\api\file;

$Acl = 'write';

class upload extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';

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
						$fd = \DLDB\Files::insertFile( ( $this->params['document']['id'] ? $this->params['document']['id'] : 0 ), $filename);
						if($fd) {
							if(!isset($this->document['f'.$fid])) $this->document['f'.$fid] = array();
							$this->document['f'.$fid][] = $fd;
						}
					}
				}
			}
		}
		if($attated_exists) {
			$fp = fsockopen("localhost",20031,$errno, $errstr, 30);
			$input = array('did'=>$this->params['did']);
			fwrite($fp, json_encode($input)."\n");
			fclose($fp);
		}
	}
}
?>
