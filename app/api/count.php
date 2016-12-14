<?php
namespace DLDB\App\api;

$Acl = "authenticated";

class count extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';
		$context = \DLDB\Model\Context::instance();

		$this->fields = \DLDB\Fields::getFields('documents');
		foreach($this->fields as $fid => $field) {
			if($field['type'] == 'taxonomy') {
				$cids[] = $field['cid'];
			}
		}
		if($cids && is_array($cids) ) {
			$this->taxonomies = \DLDB\Taxonomy::getTaxonomy($cids);
			$this->taxonomy = \DLDB\Taxonomy::getTaxonomyTerms($cids);
		}

		$this->total_cnt = \DLDB\Document::totalCnt();
		$tids = array();
		foreach( $this->taxonomies as $cid => $taxo ) {
			if( $taxo['skey'] ) {
				foreach( $this->taxonomy[$cid] as $tid => $term ) {
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
		$this->result = array(
			'total_cnt' => $this->total_cnt,
			'taxonomy_cnt' => $this->taxonomy_cnt
		);
	}
}
?>
