<?php
namespace DLDB\App\api\search\elastic;

$Acl = 'administrator';

class index extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';
		$context = \DLDB\Model\Context::instance();
		$index = $context->getProperty('service.elastic_index');

		$fields = \DLDB\Fields::getFields('documents');
		$cids = array();
		foreach($fields as $fid => $field) {
			if($field['type'] == 'taxonomy') {
				$cids[] = $field['cid'];
			}
		}
		$taxonomy = \DLDB\Taxonomy::getTaxonomy($cids);
		$taxonomy_terms = \DLDB\Taxonomy::getTaxonomyTerms($cids);

		$else = \DLDB\Search\Elastic::instance();
		$else->setFields( $fields, $taxonomy, $taxonomy_terms );

		if($else->check()) {
			$else->drop();
		}

		$types = array();
		foreach($taxonomy as $cid => $taxo) {
			if($taxo['skey'] && $taxo['active']) {
				if( is_array($taxonomy_terms[$cid]) ) {
					foreach( $taxonomy_terms[$cid] as $t => $terms) {
						$types[] = 't'.$t;
					}
				}
			}
		}
		$else->create($types);

		$documents = \DLDB\Search\Documents::getAllList();
		if($documents) {
			foreach($documents as $document) {
				$else->update($document['id'],$document,$document['memo']);
			}
		}

		$this->result = array(
			'error' => 0,
			'index' => $index,
			'types' => array_merge(array('main',$types)),
			'total_cnt' => @count($documents)
		);
	}
}
?>
