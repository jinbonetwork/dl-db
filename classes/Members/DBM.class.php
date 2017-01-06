<?php
namespace DLDB\Members;

class DBM extends \DLDB\Objects {

	public static function instance() {
		return self::_instance(__CLASS__);
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
		$que = "SELECT * FROM {members}";
		if($s_mode && $s_arg) {
			$que .= " WHERE `".$s_mode."` LIKE '%".$s_arg."%'";
		}
		$que .= " ORDER BY id ".$order;
		$que .= " LIMIT ".( ($page-1) * $limit ).",".$limit;

		$members[] = array();
		while($row = $dbm->getFetchArray($que)) {
			$members[] = self::fetchMember($row);
		}
		return $members;
	}

	public static function add($args) {
		$dbm = \DLDB\DBM::instance();

		$que = "INSERT INTO {members} (`name`,`class`, `email`, `phone`, `custom`, `license`) VALUES (?,?,?,?,?,?)";
		$dbm->execute($que,array("sssssd",$args['name'],$args['class'],$args['email'],$args['phone'],serialize($args['custom']),0));
	}

	private static function fetchMember($row) {
		if(!$row) return null;
		$member = array();
		foreach($row as $k => $v) {
			if($k == 'custom') {
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
