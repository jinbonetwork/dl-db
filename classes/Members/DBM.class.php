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

	public static function getMembers($ids) {
		$dbm = \DLDB\DBM::instance();

		if( is_array($ids) ) {
			$que = "SELECT * FROM {members} WHERE id IN (".implode(",",$ids).")";
			$members = array();
			while($row = $dbm->getFetchArray($que)) {
				$members[] = self::fetchMember($row);
			}
		}
		return $members;
	}

	public static function getMemberByEmail($email) {
		$dbm = \DLDB\DBM::instance();

		if($email) {
			$que = "SELECT * FROM {members} WHERE `email` = '".$email."'";
			$row = $dbm->getFetchArray($que);
			if($row['id']) {
				$member = self::fetchMember($row);;
			}
		}
		return $member;
	}

	public static function getMemberAuth($email,$auth) {
		$dbm = \DLDB\DBM::instance();

		if($email && $auth) {
			$que = "SELECT * FROM {member_auth} WHERE `email` = '".$email."' AND `auth` = '".$auth."'";
			$row = $dbm->getFetchArray($que);
			if($row['id']) {
				$member = unserialize(stripslashes($row['data']));
			}
		}
		return $member;
	}

	public static function insert($args) {
		$dbm = \DLDB\DBM::instance();

		$fields = self::getFields();

		$que = "INSERT INTO {members} (`name`,`class`, `email`, `phone`, `custom`, `license`";
		$que2 .= ") VALUES (?,?,?,?,?,?";
		$array1 = 'array("sssssd';
		$array2 = '$'."args['name'], ".'$'."args['class'], ".'$'."args['email'], ".'$'."args['phone'], serialize(".'$'."custom), 0";

		$fieldquery = \DLDB\FieldsQuery::instance();
		$fieldquery->setFields($fields);
		$fieldquery->setTaxonomy(self::$taxonomy);
		$fieldquery->setTaxonomyTerms(self::$taxonomy_terms);
		$result = $fieldquery->insertQue($que,$que2,$array1,$array2,$args);
		@extract($result);

		$que = $que.$que2;
		$eval_str = '$'."q_args = ".$array1.$array2.";";
		eval($eval_str);

		if($dbm->execute($que,$q_args) < 1) {
			self::setErrorMsg($que." 가 DB에 반영되지 않았습니다.");
			return -1;
		}
//		$dbm->execute($que,array("sssssd",$args['name'],$args['class'],$args['email'],$args['phone'],serialize($args['custom']),0));

		$insert_id = $dbm->getLastInsertId();

		if( is_array($taxonomy_map) ) {
			if( $fieldquery->reBuildTaxonomy('members', $insert_id, $taxonomy_map) < 0 ) {
				self::setErrorMsg( $fieldquery->getErrorMsg() );
				return -1;
			}
		}

		if($args['password']) {
			$uid = self::makeID($args);
			if($uid > 0) {
				$que = "UPDATE {members} SET uid = ? WHERE id = ?";
				$dbm->execute($que,array("dd",$uid,$insert_id));
				if($args['role']) {
					self::updateRole($uid,$args['role']);
				}
			} else {
				return -1;
			}
		}

		return $insert_id;
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
			if($args['role']) {
				self::updateRole($member['uid'],$args['role']);
			}
		} else if(!$member['uid'] && $args['password']) {
			$uid = \DLDB\Members\DBM::makeID($args);
			if($uid > 0) {
				$que = "UPDATE {members} SET uid = ? WHERE id = ?";
				$dbm->execute($que,array("dd",$uid,$args['id']));
				self::updateRole($uid,$args['role']);
			} else {
				return -1;
			}
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

		$que = "DELETE FROM {taxonomy_term_relative} WHERE `tables` = ? AND `did` = ?";
		$dbm->execute($que,array("sd",'members',$member['id']));

		$que = "DELETE FROM {user_roles} WHERE `uid` = ?";
		$dbm->execute($que,array("d",$member['id']));

		return 0;
	}

	public static function deletes($members) {
		if(is_array($members) && @count($members) > 0) {
			foreach($members as $member) {
				self::delete($member);
			}
		}

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
				if($uid < 0) {
					self::setErrorMsg(\DLDB\Members\XE\User::errorMsg());
				}
				break;
		}

		if($uid > 0 && !$context->getProperty('service.allow_join')) {
			$args['subject'] = $rows['name']."님 '".$context->getProperty('service.title')."' 사이트에 아이디가 개설되었습니다";
			$args['name'] = $rows['name'];
			$args['user_id'] = $rows['email'];
			$args['password'] = $rows['password'];
			$args['link'] = \DLDB\Lib\site_url($context->getProperty('service.ssl'));
			$args['link_title'] = '바로가기';
			$recievers = array();
			$recievers[] = array('email' => $rows['email'], 'name' => $rows['name'] );

			$result = \DLDB\Mailer::sendMail("regist",$recievers,$args,0);
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
		if($uid > 0 && !$context->getProperty('service.allow_join')) {
			$args['subject'] = $rows['name']."님 '".$context->getProperty('service.title')."' 사이트의 아이디 정보가 수정되었습니다.";
			$args['name'] = $rows['name'];
			$args['user_id'] = $rows['email'];
			$args['password'] = $rows['password'];
			$args['link'] = \DLDB\Lib\site_url($context->getProperty('service.ssl'));
			$args['link_title'] = '바로가기';
			$recievers = array();
			$recievers[] = array('email' => $rows['email'], 'name' => $rows['name'] );

			$result = \DLDB\Mailer::sendMail("modify",$recievers,$args,0);
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
			
			$que = "SELECT * FROM {user_roles} WHERE uid = ".$uid;
			$row = $dbm->getFetchArray($que);
			$role = unserialize($row['role']);
		}
		return $role;
	}

	private static function existsRole($uid) {
		$exists = 0;
		if($uid) {
			$dbm = \DLDB\DBM::instance();
			
			$que = "SELECT * FROM {user_roles} WHERE uid = ".$uid;
			$row = $dbm->getFetchArray($que);
			if($row['uid']) $exists = 1;
		}
		return $exists;
	}

	public static function updateRole($uid,$roles) {
		if(!$uid) return 0;
		if($roles && !is_array($roles)) {
			$roles = array($roles);
		}

		$dbm = \DLDB\DBM::instance();

		$role_exists = self::existsRole($uid);
		if($role_exists) {
			$que = "UPDATE {user_roles} SET `role` = ? WHERE `uid` = ?";
			$dbm->execute($que,array("sd",serialize($roles),$uid));
		} else {
			$que = "INSERT INTO {user_roles} (`uid`,`role`) VALUES (?,?)";
			$dbm->execute($que,array("ds",$uid,serialize($roles)));
		}
		return 0;
	}

	public static function createFindAuthKey($email) {
		$context = \DLDB\Model\Context::instance();
		$session_type = $context->getProperty('session.type');
		$domain = $context->getProperty('service.domain');
		$ssl = $context->getProperty('service.ssl');

		$member = self::getMemberByEmail($email);
		if(!$member['id']) {
			self::setErrorMsg('존재하지 않는 아이디입니다');
			$out['success'] = -1;

			return $out;
		}
		if(!$member['uid']) {
			self::setErrorMsg('사용자로 등록되지 않는 아이디입니다');
			$out['success'] = -1;

			return $out;
		}

		switch($session_type) {
			case 'gnu5':
				$out['success'] = 0;
				break;
			case 'xe':
			default:
				$out = \DLDB\Members\XE\User::createFindAuthKey($email,$member['uid']);
				if($out['success'] == -2) {
					self::setErrorMsg($out['message']);
					return $out;
				}
				$out['success'] = 1;
				$out['auth_link'] = 'http'.($ssl ? 's' : '')."://".$domain."/xe".$out['auth_link'];
				$out['name'] = $member['name'];
				$out['user_id'] = $email;
				break;
		}

		return $out;
	}

	public static function getAdminID() {
		$context = \DLDB\Model\Context::instance();
		$session_type = $context->getProperty('session.type');
		switch($session_type) {
			case 'gnu5':
				$admins = \DLDB\Members\Gnu5\User::getAdminID();
				break;
			case 'xe':
			default:
				$admins = \DLDB\Members\XE\User::getAdminID();
				break;
		}
		return $admins;
	}

	public static function getAuthKey() {
		$context = \DLDB\Model\Context::instance();
		$session_type = $context->getProperty('session.type');
		switch($session_type) {
			case 'gnu5':
			case 'xe':
			default:
				$auth = \DLDB\Members\XE\User::getAuthKey(40);
				break;
		}
		return $auth;
	}

	public static function getErrorMsg() {
		return self::$errmsg;
	}

	private static function setErrorMsg($msg) {
		self::$errmsg = $msg;
	}

	public static function fetchMember($row) {
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
