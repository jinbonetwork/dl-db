<?php
namespace DLDB\Stats;

class Members extends \DLDB\Objects {
	public static function instance() {
		return self::_instance(__CLASS__);
	}

	public static function totalCnt($s_mode,$s_args) {
		$dbm = \DLDB\DBM::instance();

		if( $s_mode && $s_args ) {
			$uids = self::getUids($s_mode,$s_args);
		}
		$que = "SELECT count(distinct f.uid) AS cnt FROM {files} AS f";
		if($uids && @count($uids) > 0) {
			$que .= " WHERE f.uid IN (".implode(",",$uids).")";
		}
		$row = $dbm->getFetchArray($que);
		return ($row['cnt'] ? $row['cnt'] : 0);
	}

	public static function getList($page,$limit,$orderby="cnt",$order="desc",$s_mode=null,$s_args=null) {
		$dbm = \DLDB\DBM::instance();

		if(!$orderby) $orderby = 'cnt';
		if(!$order) $orderby = 'DESC';

		if( $s_mode && $s_args ) {
			$uids = self::getUids($s_mode,$s_args);
		}

		$que = "SELECT uid, count(fid) AS cnt FROM {files}";
		if($uids && @count($uids) > 0) {
			$que .= " WHERE uid IN (".implode(",",$uids).")";
		}
		$que .= " GROUP BY uid";
		$que .= " ORDER BY ".$orderby." ".$order;
		$que .= " LIMIT ".( ($page-1) * $limit).", ".$limit;

		$members = array();
		while($row = $dbm->getFetchArray($que)) {
			$members[] = $row;
		}
		if(is_array($members)) {
			for($i=0; $i<@count($members); $i++) {
				$que = "SELECT * FROM {members} WHERE uid = ".$members[$i]['uid'];
				$row = $dbm->getFetchArray($que);
				$members[$i] += \DLDB\Members\DBM::fetchMember($row);
			}
		}

		return $members;
	}

	private static function getUids($s_mode,$s_args) {
		$dbm = \DLDB\DBM::instance();
		$uids = array();
		if( $s_mode && $s_args ) {
			$que = "SELECT uid FROM {member} WHERE ".$s_mode." LIKE '%".$s_args."%' AND uid > 0";
			while($row = $dbm->getFetchArray($que)) {
				$uids[] = $row['uid'];
			}
		}
		return $uids;
	}
}
?>
