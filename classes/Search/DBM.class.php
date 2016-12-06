<?php
namespace DLDB\Search;

class DBM extends \DLDB\Objects {
	private static $fields;
	private static $cids;
	private static $taxonomy;
	private static $taxonomy_terms;
	private static $types;
	private static $que;
	private static $errmsg;

	public static function instance() {
		return self::_instance(__CLASS__);
	}

	public static function setFields($fields=null,$taxonomy=null,$taxonomy_terms=null) {
		self::$fields = $fields;
		if(!self::$fields) {
			self::$fields = \DLDB\Fields::getFields('documents');
		}

		foreach( self::$fields as $f => $field ) {
			if( $field['type'] == 'taxonomy' ) {
				self::$cids[] = $field['cid'];
			}
		}

		self::$taxonomy = $taxonomy;
		if(!self::$taxonomy) {
			self::$taxonomy =  \DLDB\Taxonomy::getTaxonomy(self::$cids);
		}

		self::$taxonomy_terms = $taxonomy_terms;
		if(!self::$taxonomy_terms) {
			self::$taxonomy_terms =  \DLDB\Taxonomy::getTaxonomyTerms(self::$cids);
		}
	}

	public static function totalCnt($q,$args=null) {
		$dbm = \DLDB\DBM::instance();

		$que = self::makeQuery($q,$args,'count(*) AS cnt');
		$row = $dbm->getFetchArray($que);
		return ($row['cnt'] ? $row['cnt'] : 0);
	}
	
	public static function getList($q,$args=null,$order="score",$page=1,$limit=20) {
		$dbm = \DLDB\DBM::instance();
		$context = \DLDB\Model\Context::instance();

		if(!$page) $page = 1;

		$que = self::makeQuery($q,$args,"d.*, ".self::makeMatch($q)." AS score");
		$que .= " ORDER BY ".$order." DESC LIMIT ".( ($page - 1) * $limit ).",".$limit;
		self::$que = $que;

		$documents = array();
		while($row = $dbm->getFetchArray($que)) {
			$d = self::fetchDocument($row);
			$documents[] = array(
				'_index' => $context->getProperty('database.DB'),
				'_type' => (self::$types ? self::$types : 'main'),
				'_id' => $d['id'],
				'_score' => $d['score'],
				'_source' => $d
			);
		}
		return $documents;
	}

	private static function makeMatch($q) {
		$n_mode = $b_mode = '';
		foreach($q as $type => $que) {
			if($que) {
				switch($type) {
					case 'string':
						$n_mode .= ($n_mode ? " " : "").'"'.$q['string'].'"';
						break;
					case 'or':
						$n_mode .= ($n_mode ? " " : "").implode( " ", $que);
						break;
					case 'and':
						$b_mode .= ($b_mode ? " " : "").implode( " +", $que);
						break;
					case 'not':
						$b_mode .= ($b_mode ? " " : "").implode( " -", $que);
						break;
				}
			}
		}
		if($n_mode) {
			$query = "match(d.subject,d.content,d.memo) against('".$n_mode."' IN NATURAL LANGUAGE MODE)";
		}
		if($b_mode) {
			$query .= ($query ? " AND " : "")."match(d.subject,d.content,d.memo) against('".$b_mode."' IN BOOLEAN MODE)";
		}
		return $query;
	}

	private static function makeQuery($q,$args=null,$result) {
		$select_que = "SELECT ".$result." FROM ";
		$taxonomy_que = $que."{taxonomy_term_relative} AS t LEFT JOIN {documents} AS d ON t.did = d.id WHERE ";
		$document_que = $que."{documents} AS d WHERE ";
		$que = "";
		$taxonomy_exist = false;
		if($args) {
			foreach( $args as $k => $v ) {
				$t = substr($k,0,1);
				$key = (int)substr($k,1);
				if($t == 'f') {
					switch(self::$fields[$key]['type']) {
						case 'taxonomy':
							if(!is_array($v)) $v = array($v);
							$que .= ($que ? " AND " : "")."t.tid IN (".implode(',',$v).")";
							self::$types = implode(",",$v);
							$taxonomy_exist = true;
							break;
						case 'date':
							$period = explode("-",$v);
							if($period[0]) {
								$que .= ($que ? " AND " : "")."d.".$k." >= '".str_replace(".","-",$period[0])."'";
							}
							if($period[1]) {
								$que .= ($que ? " AND " : "")."d.".$k." <= '".str_replace(".","-",$period[1])."'";
							}
							break;
						default:
							break;
					}
				}
			}
		}
		$que .= ($que ? " AND " : "").self::makeMatch($q);

		$query = $select_que.($taxonomy_exist ? $taxonomy_que : $document_que).$que;

		return $query;
	}
	
	public static function getQue() {
		return self::$que;
	}

	private static function fetchDocument($row) {
		$fields = self::$fields;
		if(!$row) return null;
		foreach($row as $k => $v) {
			if($k == 'custom') $v = unserialize($v);
			else if(is_string($v)) $v = stripslashes($v);
			$document[$k] = $v;
		}
		if( $document['custom'] && is_array($document['custom']) ) {
			foreach($document['custom'] as $k => $v) {
				if($v) {
					if($fields[$k]['sefield'] && $fields[$k]['type'] == 'taxonomy') {
						$c = 0;
						if(is_array($v)) {
							foreach( $v as $t => $vv ) {
								$document['f'.$k] .= ($c++ ? "," : "").self::$taxonomy_terms[$vv['cid']][$t]['name'];
							}
						}
					} else {
						$document["f".$k] = $v;
					}
				}
			}
		}
		if($document['uid'] == $_SESSION['user']['uid']) {
			$document['owner'] = 1;
		} else if( \DLDB\Acl::isMaster() ) {
			$document['owner'] = 1;
		} else {
			$document['owner'] = 0;
		}
		unset($document['custom']);

		return $document;
	}
}
?>
