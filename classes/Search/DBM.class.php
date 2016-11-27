<?php
namespace DLDB\Search;

class DBM extends \DLDB\Objects {
	private static $fields;
	private static $cids;
	private static $taxonomy;
	private static $errmsg;

	public static function instance() {
		return self::_instance(__CLASS__);
	}

	public static function setFields($fields,$taxonomy) {
		self::$fields = \DLDB\Fields::getFields('documents');

		foreach( self::$fields as $f => $field ) {
			if( $field['type'] == 'taxonomy' ) {
				self::$cids[] = $field['cid'];
			}
		}

		self::$taxonomy = $taxonomy;
	}

	public static function totalCnt($q,$args=null) {
		$dbm = \DLDB\DBM::instance();

		$que = self::makeQuery($q,$args,'count(*) AS cnt');
		$row = $dbm->getFetchArray($que);
		return ($row['cnt'] ? $row['cnt'] : 0);
	}
	
	public static function getList($q,$args=null,$order="score",$page=1,$limit=20) {
		if(!$page) $page = 1;
		$dbm = \DLDB\DBM::instance();

		$que = self::makeQuery($q,$args,"d.*, match(d.subject,d.content,d.memo) against('".$q."' IN NATURAL LANGUAGE MODE) AS score");
		$que .= " ORDER BY ".$order." DESC LIMIT ".( ($page - 1) * $limit ).",".$limit;

		$documents = array();
		while($row = $dbm->getFetchArray($que)) {
			$documents[] = self::fetchDocument($row);
		}
		return $documents;
	}

	private static function makeQuery($q,$args=null,$result) {
		$select_que = "SELECT ".$result." FROM ";
		$taxonomy_que = $que."{taxonomy_term_relative} AS t LEFT JOIN {documents} AS d ON t.did = d.id WHERE ";
		$document_que = $que."{documents} AS d WHERE "
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
							$taxonomy_exist = true;
							break;
						case 'date':
							$period = explode("-",$v);
							if($period[0]) {
								$que .= ($que ? " AND " : "")."d.".$k." >= '".str_replace(".","-",$v)."'";
							}
							if($period[1]) {
								$que .= ($que ? " AND " : "")."d.".$k." <= '".str_replace(".","-",$v)."'";
							}
							break;
						default:
							break;
					}
				}
			}
		}
		$que .= ($que ? " AND " : "")."match(d.subject,d.content,d.memo) against('".$q."' IN NATURAL LANGUAGE MODE)";

		$query = $select_que.($taxonomy_exist ? $taxonomy_que : $document_que).$que;

		return $query;
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
				$document["f".$k] = $v;
			}
		}
		if($document['uid'] == $_SESSION['user']['uid']) {
			$document['owner'] = 1;
		} else if( \DLDB\Acl::isMaster() ) {
			$document['owner'] = 1;
		} else {
			$document['owner'] = 0;
		}
	}
}
?>
