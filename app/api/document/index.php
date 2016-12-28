<?php
namespace DLDB\App\api\document;

$Acl = 'view';

class index extends \DLDB\Controller {
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
				$bookmark = \DLDB\Bookmark::getByDID($this->user['uid'], $this->params['id']);
				if($bookmark) {
					$this->document['bookmark'] = $bookmark['bid'];
				} else {
					$this->document['bookmark'] = 0;
				}
				$this->result = array('error' => 0, 'fields' => $this->fields, 'document' => $this->document);
			}
		} else {
			if(!$this->params['page']) $this->params['page'] = 1;
			if(!$this->params['limit']) $this->params['limit'] = 20;
			$this->total_cnt = \DLDB\Document::totalCnt();
			if($this->total_cnt) {
				$this->total_page = (int)( ( $this->total_cnt - 1 ) / $this->params['limit'] ) + 1;
				$this->documents = \DLDB\Document::getList( 0, $this->params['page'], $this->params['limit'] );
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
