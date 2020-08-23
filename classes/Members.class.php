<?php
namespace DLDB;

class Members extends \DLDB\Objects {
	private static $fields;
	private static $cids;
	private static $taxonomy;
	private static $taxonomy_terms;
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
			self::$taxonomy = \DLDB\Taxonomy::getTaxonomy(self::$cids);
		}
		if(!self::$taxonomy_terms) {
			self::$taxonomy_terms = \DLDB\Taxonomy::getTaxonomyTerms(self::$cids);
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

	public static function memberfield() {
		$dbm = \DLDB\DBM::instance();

		$que = "SHOW COLUMNS FROM {members}";
		$member = array();
		while( $row = $dbm->getFetchArray($que) ) {
			if( preg_match("/^int/i",$row['Type']) ) {
				$member[$row['Field']] = 0;
			} else {
				$member[$row['Field']] = '';
			}
		}
		return $member;
	}

	public static function modify($member,$args) {
		$dbm = \DLDB\DBM::instance();

		$fields = self::getFields();

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
		$fieldquery->setTaxonomyTerms(self::$taxonomy_terms);
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

	public static function registAuth($args) {
		$dbm = \DLDB\DBM::instance();

		$pre_member = \DLDB\Members\DBM::getMemberByEmail($args['email']);
		if($pre_member['id']) {
			self::setErrorMsg( '이미 회원가입된 이메일입니다.' );
			return -1;
		}

		$regdate = time();

		$que = "SELECT * FROM {member_auth} WHERE email = '".$args['email']."'";
		$row = $dbm->getFetchArray($que);
		if($row['id']) {
			if( ( $regdate - $row['regdate'] ) < 3600 ) {
				$retry = (int)(($regdate - $row['regdate']) / 60);
				self::setErrorMsg( '1시간 이내에 회원가입 신청하셨습니다. 이메일을 확인해보세요. 다시 신청하시려면 '.$retry."분후에 다시 신청해주세요" );
				return -2;
			} else {
				$que = "DELETE FROM {member_auth} WHERE email = ?";
				$dbm->execute($que,array("s",$args['email']));
			}
		}

		$auth = $args['auth'];
		unset($args['auth']);
		$data = serialize($args);

		$que = "INSERT {member_auth} (`email`,`auth`,`data`,`regdate`) VALUES (?,?,?,?)";
		$dbm->execute($que,array("sssd",$args['email'],$auth,$data,$regdate));
		$id = $dbm->getLastInsertId();

		return $auth;
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

	public static function getErrorMsg() {
		return self::$errmsg;
	}

	private static function setErrorMsg($msg) {
		self::$errmsg = $msg;
	}
}
?>
