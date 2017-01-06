<?php
namespace DLDB\App\api\admin\member;

$Acl = 'administrator';

class fields extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';

		$fields = \DLDB\Fields::getFields('members');
		$this->fields = array();
		$cids = array();
		foreach($fields as $f => $field) {
			$this->fields[] = $field;
			if($field['type'] == 'taxonomy') {
				$cids[] = $field['cid'];
			}
		}
		if(count($cids) > 0) {
			$taxonomy = \DLDB\Taxonomy::getTaxonomyTerms($cids,0);
			foreach($taxonomy as $cid => $terms) {
				if(!$this->taxonomy[$cid]) {
					$this->taxonomy[$cid] = array();
				}
				foreach($terms as $tid => $term) {
					$this->taxonomy[$cid][] = $term;
				}
			}
		}
	}
}
?>
