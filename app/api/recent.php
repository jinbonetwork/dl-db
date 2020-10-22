<?php
namespace DLDB\app\api;

$Acl = 'authenticated';

class recent extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';

		$limit = ($this->params['limit'] ? $this->params['limit'] : 6);
		$context = \DLDB\Model\Context::instance();

		$this->fields = \DLDB\Fields::getFields('documents');

		$documents = \DLDB\Document::recent($limit);
		if(is_array($documents)) {
			for($i=0; $i<@count($documents); $i++) {
				foreach($documents[$i] as $k => $doc) {
					$skip = 0;
					if($k == 'custom') continue;
					if($k == 'created') $doc = date("Y-m-d",$doc);
					if(is_array($doc)) {
						if($doc['year']) {
							$v = '';
							foreach($doc as $value) {
								$v .= ($v ? '-' : '').$value;
							}
							$doc = $v;
						} else {
							$v = '';
							foreach($doc as $t => $value) {
								if($value['name']) {
									$v .= ($v ? ", " : '').$value['name'];
								} else if($value['filename']) {
									$skip = 1;
								}
							}
							$doc = $v;
						}
					}
					if(!$skip) $this->documents[$i][$k] = $doc;
				}
			}
		}
		$this->result = array(
			'error' => 0,
			'documents' => $this->documents
		);
	}
}
?>
