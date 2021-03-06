<?php
namespace DLDB;

class Taxonomy extends \DLDB\Objects  {
	private static $fields;
	private static $tree;
	private static $taxonomy;
	private static $taxonomy_terms;

	public static function instance() {
		return self::_instance(__CLASS__);
	}

	public static function getTaxonomy($cids) {
		$dbm = \DLDB\DBM::instance();

		$context = \DLDB\Model\Context::instance();

		if( $cids && !is_array($cids) ) $cids = array($cids);

		self::$taxonomy = $context->getProperty('taxonomy');
		if(!self::$taxonomy) {
			$que = "SELECT * FROM {taxonomy} ORDER BY cid ASC";
			while($row = $dbm->getFetchArray($que)) {
				self::$taxonomy[$row['cid']] = self::fetchTaxonomy($row);
			}
			$context->setProperty('taxonomy',self::$taxonomy);
		}

		
		if( $cids ) {
			foreach($cids as $cid) {
				$taxonomy[$cid] = self::$taxonomy[$cid];
			}
		} else {
			$taxonomy = self::$taxonomy;
		}

		return $taxonomy;
	}

	public static function getTaxonomyTerms($cids,$active=1) {
		$dbm = \DLDB\DBM::instance();

		$context = \DLDB\Model\Context::instance();

		if(!$cids) return null;
		if(!is_array($cids)) $cids = array($cids);
		self::$taxonomy_terms = $context->getProperty('taxonomy_terms');
		if(!self::$taxonomy_terms) {
			$que = "SELECT * FROM {taxonomy_terms} WHERE current = '1'".($active ? " AND active = '1'" : "")." ORDER BY cid ASC, parent ASC, idx ASC";
			while($row = $dbm->getFetchArray($que)) {
				self::$taxonomy_terms[$row['cid']][$row['tid']] = self::fetchTaxonomy($row);
			}
			$context->setProperty( 'taxonomy_terms', self::$taxonomy_terms );
		}
		foreach($cids as $cid) {
			$taxonomy_terms[$cid] = self::$taxonomy_terms[$cid];
		}

		return $taxonomy_terms;
	}

	public static function search($cids,$q) {
		$dbm = \DLDB\DBM::instance();
		if(!is_array($cids)) $cids = array($cids);
		$que = "SELECT * FROM {taxonomy_terms} WHERE cid IN (".implode(",",$cids).") AND name like '%".$q."%' AND current = '1' AND active = '1' ORDER BY cid ASC, parent ASC, idx ASC";
		while($row = $dbm->getFetchArray($que)) {
			$taxonomy_terms[$row['cid']][$row['tid']] = self::fetchTaxonomy($row);
		}
		return $taxonomy_terms;
	}

	public static function makeTree($taxonomy_terms) {
		$tree = array();
		foreach($taxonomy_terms as $t => $terms) {
			$tree[$terms['parent']][$terms['idx']] = $terms;
		}
		$taxonomy_list = self::buildTree($tree, 0, 0);

		return $taxonomy_list;
	}

	private static function buildTree($tree, $depth=0, $parent=0) {
		$taxonomy_list = array();
		if(!$tree[$parent]) return null;
		foreach($tree[$parent] as $idx => $terms) {
			$terms['depth'] = $depth;
			$taxonomy_list[] = $terms;
			if($terms['nsubs']) {
				$sub = self::buildTree($tree, ($depth+1), $terms['tid']);
				if($sub && count($sub) > 0) {
					$taxonomy_list = array_merge($taxonomy_list,$sub);
				}
			}
		}
		return $taxonomy_list;
	}

	private static function fetchTaxonomy($row) {
		$taxonomy = array();
		foreach($row as $k => $v) {
			if(is_numeric($v)) {
				$taxonomy[$k] = $v;
			} else {
				$taxonomy[$k] = stripslashes($v);
			}
		}
		return $taxonomy;
	}
}
?>
