<?php
namespace DLDB\App\api;

$Acl = "authenticated";

class taxonomy extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';
		$context = \DLDB\Model\Context::instance();

		$cids = array();
		if($this->params['cid']) {
			$taxonomies = \DLDB\Taxonomy::getTaxonomy($this->params['cid']);
		} else {
			$taxonomies = \DLDB\Taxonomy::getTaxonomy(null);
		}
		foreach($taxonomies as $cid => $taxo) {
			$cids[] = $cid;
		}
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
					'name' => $term['name'],
					'slug' => $term['slug']
				);
			}
		}
	}
}
?>
