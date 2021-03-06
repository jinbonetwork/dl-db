<?php
namespace DLDB\App\api\user;

$Acl = 'write';

class documents extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';
		$context = \DLDB\Model\Context::instance();
		                
		$fields = \DLDB\Fields::getFields('documents');
		foreach($fields as $fid => $field) {
			$this->fields[] = array(
				'fid' => $field['fid'],
				'parent' => $field['parent'],
				'idx' => $field['idx'],
				'slug' => $field['slug'],
				'subject' => $field['subject'],
				'type' => $field['type'],
				'multiple' => $field['multiple'],
				'required' => $field['required'],
				'cid' => $field['cid'],
				'system' => $field['system'],
				'form' => $field['form']
			);
		}

		if($this->params['id']) {
			$this->document = \DLDB\Document::get($this->params['id'],'view');
			if(!$this->document) {
				$this->result = array('error' => -1,'message' => '존재하지 않는 문서입니다');
			} else {
				$this->result = array('error' => 0, 'fields' => $this->fields, 'document' => $this->document);
			}
		} else {
			if(!$this->params['page']) $this->params['page'] = 1;
			if(!$this->params['limit']) $this->params['limit'] = 10;
			$this->total_cnt = \DLDB\Document::totalCnt($this->user['uid']);
			if($this->total_cnt) {
				$this->total_page = (int)( ( $this->total_cnt - 1 ) / $this->params['limit'] ) + 1;
				if($this->params['page'] > $this->total_page || $this->params['page'] < 1) {
					$this->documents = array();
				} else {
					$this->documents = \DLDB\Document::getList( $this->user['uid'], $this->params['page'], $this->params['limit'] );
				}
			} else {
				$this->total_page = 0;
				$this->documents = array();
			}
			$this->result = array(
				'error' => 0,
				'result' => array(
					'total_cnt' => $this->total_cnt,
					'total_page' => $this->total_page,
					'page' => $this->params['page'],
					'cnt' => @count( $this->documents )
				),
				'fields' => $this->fields,
				'documents' => $this->documents
			);
		}
	}
}
?>
