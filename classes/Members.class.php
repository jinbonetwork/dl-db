<?php
namespace DLDB;

class Members extends \DLDB\Objects {
	private static $fields;
	private static $cids;
	private static $taxonomy;
	private static $errmsg;

	public static function instance() {
		return self::_instance(__CLASS__);
	}

	public static function getFields() {
		if(!self::$fields) {
			self::$fields = \DLDB\Fields::getFields('members');
		}
		if(!self::$cids) {
			foreach(self::$fields as $f => $field) {
				if($field['type'] == 'taxonomy') {
					self::$cids[] = $field['cid'];
				}
			}
		}
		if(!self::$taxonomy) {
			self::$taxonomy = \DLDB\Taxonomy::getTaxonomyTerms(self::$cids);
		}
		return self::$fields;
	}

	public static function search($q,$page=0,$limit=0) {
		$context = \DLDB\Model\Context::instance();
		$dbm = \DLDB\DBM::instance();

		$fields = self::getFields();

		if($q) {
			$que = "SELECT * FROM {members} WHERE `name` LIKE '".$q."%'";
			if($page) {
				$que .= " ORDER BY name ASC LIMIT ".( ($page - 1) * $limit ).", ".$limit;
			}
			$members = array();
			while( $row = $dbm->getFetchArray($que) ) {
				$members[] = self::fetchMember($row);
			}
		}

		return $members;
	}

	public static function get($id) {
		$dbm = \DLDB\DBM::instance();

		$que = "SELECT * FROM {members} WHERE id = ".$id;
		$row = $dbm->getFetchArray($que);
		$member = self::fetchMember($row);

		return $member;
	}

	public static function getByUid($uid) {
		$dbm = \DLDB\DBM::instance();

		if($uid) {
			$que = "SELECT * FROM {members} WHERE uid = ".$uid;
			$row = $dbm->getFetchArray($que);
			$member = self::fetchMember($row);
		}

		return $member;
	}

	public static function modify($member,$args) {
		$dbm = \DLDB\DBM::instance();

		$que = "UPDATE {members} SET `name` = ?, `class` = ?, `email` = ?, `phone` = ?, `custom` = ?";
		$array1 = 'array("sssss';
		$array2 = ($args['name'] ? '$'."args['name']" : "''").", ";
		$array2 .= ($args['class'] ? '$'."args['class']" : "''").", ";
		$array2 .= ($args['email'] ? '$'."args['email']" : "''").", ";
		$array2 .= ($args['phone'] ? '$'."args['phone']" : "''").", ";
		$array2 .= "serialize(".'$'."custom)";

		$fieldquery = \DLDB\FieldsQuery::instance();
		$fieldquery->setFields(self::$fields);
		$fieldquery->setTaxonomy(self::$taxonomy);
		$result = $fieldquery->modifyQue($que,$array1,$array2,$member,$args);
		@extract($result);

		$que .= " WHERE `id` = ?";
		$array1 .= 'd",';
		$array2 .= ", ".'$'."args['id'])";

		$eval_str = '$'."q_args = ".$array1.$array2.";";
		eval($eval_str);

		$dbm->execute($que,$q_args);

		if( is_array($taxonomy_map) ) {
			if( $fieldquery->reBuildTaxonomy('members', $args['id'], $taxonomy_map) < 0 ) {             
				self::setErrorMsg( $fieldquery->getErrorMsg() );
				return -1;
			}
		}

		if($member['uid']) {
			\DLDB\Members\DBM::modifyID($member,$args);
		} else if(!$member['uid'] && $args['password']) {
			$uid = \DLDB\Members\DBM::makeID($args);
			$que = "UPDATE {members} SET uid = ? WHERE id = ?";
			$dbm->execute($que,array("dd",$uid,$args['id']));
		}

		return 0;
	}

	public static function agreement($uid) {
		$dbm = \DLDB\DBM::instance();

		$que = "UPDATE {members} SET license = ? WHERE uid = ?";
		$dbm->execute($que, array("dd",1,$uid));
	}

	private static function fetchMember($row) {
		if(!$row) return null;
		$member = array();
		foreach($row as $k => $v) {
			if($k == 'custom') {
				$member[$k] = unserialize($v);
			}else if(is_numeric($v)) {
				$member[$k] = $v;
			} else {
				$member[$k] = stripslashes($v);
			}
		}
		if( $member['custom'] && is_array($member['custom']) ) {
			foreach( $member['custom'] as $k => $v ) {
				$member['f'.$k] = $v;
			}
		}

		return $member;
	}
}
?>
