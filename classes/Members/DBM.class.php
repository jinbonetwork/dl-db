<?php
namespace DLDB\Members;

class DBM extends \DLDB\Objects {
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
		if(self::$cids) {
			if(!self::$taxonomy) {
				self::$taxonomy = \DLDB\Taxonomy::getTaxonomy(self::$cids);
			}
			if(!self::$taxonomy_terms) {
				self::$taxonomy_terms = \DLDB\Taxonomy::getTaxonomyTerms(self::$cids);
			}
		}
		return self::$fields;
	}

	public static function totalCnt($s_mode='',$s_arg='') {
		$dbm = \DLDB\DBM::instance();

		$que = "SELECT count(*) AS cnt FROM {members}";
		if($s_mode && $s_arg) {
			$que .= " WHERE `".$s_mode."` LIKE '%".$s_arg."%'";
		}
		$row = $dbm->getFetchArray($que);
		return ($row['cnt'] ? $row['cnt'] : 0);
	}

	public static function getList($page,$limit,$order="desc",$s_mode='',$s_arg='') {
		$dbm = \DLDB\DBM::instance();

		if(!$page) $page = 1;
		$que = "SELECT * FROM {members} AS m LEFT JOIN {user_roles} AS r ON m.uid = r.uid";
		if($s_mode && $s_arg) {
			$que .= " WHERE `".$s_mode."` LIKE '%".$s_arg."%'";
		}
		$que .= " ORDER BY m.id ".$order;
		$que .= " LIMIT ".( ($page-1) * $limit ).",".$limit;

		$members = array();
		while($row = $dbm->getFetchArray($que)) {
			$members[] = self::fetchMember($row);
		}
		return $members;
	}

	public static function insert($args) {
		$dbm = \DLDB\DBM::instance();

		$que = "INSERT INTO {members} (`name`,`class`, `email`, `phone`, `custom`, `license`) VALUES (?,?,?,?,?,?)";
		$dbm->execute($que,array("sssssd",$args['name'],$args['class'],$args['email'],$args['phone'],serialize($args['custom']),0));

		$insert_id = $dbm->getLastInsertId();

		if($args['password']) {
			$uid = self::makeID($rows);
			$que = "UPDATE {members} SET uid = ? WHERE id = ?";
			$dbm->execute($que,array("dd",$uid,$insert_id));
		}

		return $insert_id;
	}

	public static function modify($member,$args) {
		$dbm = \DLDB\DBM::instance();

		$que = "UPDATE {members} SET `name` = ?, `class` = ?, `email` = ?, `phone` = ? WHERE id = ?";
		$dbm->execute($que,array("ssssd",$args['name'],$args['class'],$args['email'],$args['phone'],$member['id']));

		if($member['uid']) {
			self::modifyID($member,$args);
		} else if(!$member['uid'] && $args['password']) {
			$uid = self::makeID($rows);
			$que = "UPDATE {members} SET uid = ? WHERE id = ?";
			$dbm->execute($que,array("dd",$uid,$insert_id));
		}

		return 0;
	}

	public static function delete($member) {
		$dbm = \DLDB\DBM::instance();

		if($member['uid']) {
			self::deleteID($member['uid']);
		}

		$que = "DELETE FROM {members} WHERE id = ?";
		$dbm->execute($que,array("d",$member['id']));

		return 0;
	}

	public static function makeID($rows) {
		$context = \DLDB\Model\Context::instance();
		$session_type = $context->getProperty('session.type');
		switch($session_type) {
			case 'gnu5':
				$uid = \DLDB\Members\Gnu5\User::add($rows);
				break;
			case 'xe':
			default:
				$uid = \DLDB\Members\XE\User::add($rows);
				break;
		}

		return $uid;
	}

	public static function modifyID($member,$rows) {
		$context = \DLDB\Model\Context::instance();
		$session_type = $context->getProperty('session.type');
		switch($session_type) {
			case 'gnu5':
				$uid = \DLDB\Members\Gnu5\User::modify($member,$rows);
				break;
			case 'xe':
			default:
				$uid = \DLDB\Members\XE\User::modify($member,$rows);
				break;
		}
	}

	public static function deleteID($uid) {
		$context = \DLDB\Model\Context::instance();
		$session_type = $context->getProperty('session.type');
		switch($session_type) {
			case 'gnu5':
				\DLDB\Members\Gnu5\User::delete($uid);
				break;
			case 'xe':
			default:
				\DLDB\Members\XE\User::delete($uid);
				break;
		}
	}

	public static function getRole($uid) {
		if($uid) {
			$dbm = \DLDB\DBM::instance();
			
			$que = "SELECT * FROM {user_roles) WHERE uid = ".$uid;
			$row = $dbm->getFetchArray($que);
			$role = unserialize($row['role']);
		}
		return $role;
	}

	public static function updateRole($uid,$roles) {
		if(!$uid) return 0;
		if($roles && !is_array($roles)) {
			$roles = array($roles);
		}

		$dbm = \DLDB\DBM::instance();

		$role = self::getRole($uid);
		if($role) {
			$que = "UPDATE {user_roles) SET `role` = ? WHERE `uid` = ?";
			$dbm->execute($que,array("sd",serialize($roles),$uid));
		} else {
			$que = "INSERT INTO {user_roles) (`uid`,`role`) VALUES (?,?)";
			$dbm->execute($que,array("ds",$uid,serialize($roles)));
		}
		return 0;
	}

	private static function fetchMember($row) {
		if(!$row) return null;
		$member = array();
		foreach($row as $k => $v) {
			if($k == 'custom' || $k == 'role') {
				$member[$k] = unserialize($v);
			} else if(is_numeric($v)) {
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
