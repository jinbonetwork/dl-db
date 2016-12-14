<?php
namespace DLDB\App\api;

$Acl = "authenticated";

class fields extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';
		$context = \DLDB\Model\Context::instance();

		$fields = \DLDB\Fields::getFields('documents');
		$this->fields = array();
		$cids = array();
		foreach($fields as $fid => $field) {
			if($field['type'] == 'taxonomy') {
				$cids[] = $field['cid'];
			}
			$this->fields[] = array(
				'fid' => $field['fid'],
				'parent' => $field['parent'],
				'idx' => $field['idx'],
				'subject' => $field['subject'],
				'type' => $field['type'],
				'multiple' => $field['multiple'],
				'required' => $field['required'],
				'cid' => $field['cid'],
				'form' => $field['form']
			);
		}
		$taxonomies = \DLDB\Taxonomy::getTaxonomy($cids);
		$cterms = \DLDB\Taxonomy::getTaxonomyTerms($cids);

		foreach($cterms as $cid => $terms) {
			if(!$this->taxonomy[$cid]) {
				$this->taxonomy[$cid] = array();
			}
			foreach($terms as $tid => $term) {
				$this->taxonomy[$cid][] = array(
					'tid' => $term['tid'],
					'cid' => $term['cid'],
					'parent' => $term['parent'],
					'idx' => $term['idx'],
					'nsubs' => $term['nsubs'],
					'name' => $term['name']
				);
			}
		}
		$this->total_cnt = \DLDB\Document::totalCnt();
		$tids = array();
			foreach( $taxonomies as $cid => $taxo ) {
				if( $taxo['skey'] ) {
					foreach( $cterms[$cid] as $tid => $term ) {
					$tids[] = $tid;
				}
			}
		}
		if( count($tids) > 0 ) {
			$taxonomy_cnt = \DLDB\Document::totalTaxonomy($tids);
			foreach( $tids as $_t ) {
				$this->taxonomy_cnt[$_t] = (int)($taxonomy_cnt[$_t] ? $taxonomy_cnt[$_t] : 0);
			}
		}
	}
}
?>
