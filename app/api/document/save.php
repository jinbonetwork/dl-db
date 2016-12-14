<?php
namespace DLDB\App\api\document;

set_time_limit(0);
ini_set("memory_limit", '2048M');
$Acl = 'write';

class save extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';
		$context = \DLDB\Model\Context::instance();

		$fields = \DLDB\Document::getFields();
		$this->fields = array();
		$this->taxonomy = \DLDB\Document::getTaxonomy();
		$this->taxonomy_terms = \DLDB\Document::getTaxonomyTerms();

		/* check field type */
		if($this->params['mode'] != 'add') {
			if( $this->params['mode'] == 'delete' && !$this->params['document']['id'] && $this->params['id'] ) {
				$this->params['document']['id'] = $this->params['id'];
			}
			if(!$this->params['document']['id']) {
				\DLDB\RespondJson::ResultPage( array( -1, '문서번호를 입력하세요') );
			}
		}
		if($this->params['mode'] != 'delete') {
			if(!$this->params['document']['subject']) {
				\DLDB\RespondJson::ResultPage( array( -4, '제목을 입력하세요') );
			}
			foreach($fields as $fid => $v) {
				$this->fields[] = array(
					'fid' => $v['fid'],
					'parent' => $v['parent'],
					'idx' => $v['idx'],
					'subject' => $v['subject'],
					'type' => $v['type'],
					'multiple' => $v['multiple'],
					'required' => $v['required'],
					'cid' => $v['cid'],
					'form' => $v['form']
				);
				if( $v['type'] == 'group') continue;
				if( $v['required'] ) {
					if(!$this->params['document']['f'.$fid]) {
						\DLDB\RespondJson::ResultPage( array( $fid, $v['subject'].'를 입력하세요') );
					}
				}
				if( $v['type'] == 'taxonomy' ) {
					if( is_array($this->params['document']['f'.$fid]) ) {
						foreach( $this->params['document']['f'.$fid] as $tx ) {
							if(!$this->taxonomy_terms[$v['cid']][$tx]) {
								\DLDB\RespondJson::ResultPage( array( $fid, $v['subject'].'에 지정된 분류값은 존재하지 않습니다.') );
							}
						}
					} else if( $this->params['document']['f'.$fid] ) {
						if(!$this->taxonomy_terms[$v['cid']][$this->params['document']['f'.$fid]]) {
							\DLDB\RespondJson::ResultPage( array( $fid, $v['subject'].'에 지정된 분류값은 존재하지 않습니다.') );
						}
					}
				}
				if( $v['type'] == 'image' || $v['type'] == 'file' ) {
					if($this->params['mode'] == 'add') {
						$this->params['document']['f'.$fid] = array();
					}
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
							$fd = \DLDB\Files::insertFile( ( $this->params['document']['id'] ? $this->params['document']['id'] : 0 ), $filename);
							if($fd) {
								if(!isset($this->params['document']['f'.$fid])) $this->params['document']['f'.$fid] = array();
								$this->params['document']['f'.$fid][] = $fd;
							}
						}
					}
				}
			}
		}
		if($this->params['document']['id']) {
			$this->document = \DLDB\Document::get($this->params['document']['id']);
			if(!$this->document) {
				\DLDB\RespondJson::ResultPage( array( -2, '존재하지 않는 문서입니다.') );
			}
			if($this->params['mode'] == 'delete') {
				$ret = \DLDB\Document::delete($this->params['document']['id']);
			} else {
				$ret = \DLDB\Document::modify($this->document, $this->params['document']);
			}
			if($ret < 0) {
				\DLDB\RespondJson::ResultPage( array( -3, \DLDB\Document::getErrorMsg() ) );
			}
			$this->did = $this->params['document']['id'];
		} else if($this->params['mode'] == 'add') {
			$ret = \DLDB\Document::insert($this->params['document']);
			if($ret < 0) {
				\DLDB\RespondJson::ResultPage( array( -3, \DLDB\Document::getErrorMsg() ) );
			}
			$this->did = $ret;
		}

		if($this->params['mode'] != 'delete') {
			$this->document = \DLDB\Document::get($this->did,'view');
		}
	}
}
?>
