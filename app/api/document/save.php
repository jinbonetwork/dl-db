<?php
namespace DLDB\App\api\document;

$Acl = 'write';

class save extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';
		$context = \DLDB\Model\Context::instance();

		$this->fields = \DLDB\Document::getFields();
		$this->taxonomy = \DLDB\Document::getTaxonomy();

		/* check field type */
		if($this->params['mode'] != 'add') {
			if(!$this->params['id']) {
				\DLDB\RespondJson::ResultPage( array( -1, '문서번호를 입력하세요') );
			}
		}
		if($this->params['mode'] != 'delete') {
			if(!$this->params['subject']) {
				\DLDB\RespondJson::ResultPage( array( -4, '제목을 입력하세요') );
			}
			foreach($this->fields as $fid => $v) {
				if( $v['required'] ) {
					if(!$this->params['f'.$fid]) {
						\DLDB\RespondJson::ResultPage( array( $fid, $v['subject'].'를 입력하세요') );
					}
				}
				if( $v['type'] == 'taxonomy' ) {
					if( is_array($this->params['f'.$fid]) ) {
						foreach( $this->params['f'.$fid] as $tx ) {
							if(!$this->taxonomy[$v['cid']][$tx]) {
								\DLDB\RespondJson::ResultPage( array( $fid, $v['subject'].'에 지정된 분류값은 존재하지 않습니다.') );
							}
						}
					} else if( $this->params['f'.$fid] ) {
						if(!$this->taxonomy[$v['cid']][$this->params['f'.$fid]]) {
							\DLDB\RespondJson::ResultPage( array( $fid, $v['subject'].'에 지정된 분류값은 존재하지 않습니다.') );
						}
					}
				}
				if( $v['type'] == 'image' || $v['type'] == 'file' ) {
					if($_FILES['f'.$fid]) {
						if($v['type'] == 'image')
							$permit = 'jpg|jpeg|gif|bmp|png';
						else
							$permit = 'pdf|hwp|doc|docx';
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
							$fid = \DLDB\Files::insertFile( ( $this->params['id'] ? $this->params['id'] : 0 ), $filename);
							if($fid) {
								if(!$this->params['f'.$fid]) $this->params['f'.$fid] = array();
								$this->params['f'.$fid][] = $fid;
							}
						}
					}
				}
			}
		}
		if($this->params['id']) {
			$this->document = \DLDB\Document::get($this->params['id']);
			if(!$this->document) {
				\DLDB\RespondJson::ResultPage( array( -2, '존재하지 않는 문서입니다.') );
			}
			if($this->params['mode'] == 'delete') {
				$ret = \DLDB\Document::delete($this->params['id']);
			} else {
				$ret = \DLDB\Document::modify($this->document, $this->params);
			}
			if($ret < 0) {
				\DLDB\RespondJson::ResultPage( array( -3, '데이터베이스를 수정하는 도중 >장애가 발생했습니다.' ) );
			}
			$this->did = $this->params['id'];
		} else if($this->params['mode'] == 'add') {
			$ret = \DLDB\Document::insert($this->params);
			$this->did = $ret;
		}

		if($this->params['mode'] != 'delete') {
			$this->document = \DLDB\Document::get($this->did);
		}
	}
}
?>
