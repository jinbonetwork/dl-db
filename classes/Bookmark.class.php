<?php
namespace DLDB;

class Bookmark extends \DLDB\Objects {
	public static function instance() {
		return self::_instance(__CLASS__);
	}

	public static function totalCnt($uid) {
		$dbm = \DLDB\DBM::instance();

		$que = "SELECT count(*) AS cnt FROM {bookmark} WHERE uid = ".$uid;
		$row = $dbm->getFetchArray($que);
		return ($row['cnt'] ? $row['cnt'] : 0);
	}

	public static function getList($uid, $page=1,$limit=20) {
		$dbm = \DLDB\DBM::instance();

		$que = "SELECT * FROM {bookmark} AS b LEFT JOIN {documents} AS d ON b.did = d.id WHERE b.uid = ".$uid." ORDER BY b.bid DESC LIMIT ".( ($page - 1)* $limit ).",".$limit;
		$bookmarks = array();
		 while($row = $dbm->getFetchArray($que)) {
			$bookmarks[] = self::fetchBookmark($row,'view');
		}
		return $bookmarks;
	}

	public static function get($uid,$bid) {
		$dbm = \DLDB\DBM::instance();

		$que = "SELECT * FROM {bookmark} AS b LEFT JOIN {documents} AS d ON b.did = d.id WHERE b.uid = ".$uid." AND b.bid = ".$bid;
		$bookmark = self::fetchBookmark( $dbm->getFetchArray($que) );

		return $bookmark;
	}

	public static function getByDID($uid,$did) {
		$dbm = \DLDB\DBM::instance();

		$que = "SELECT * FROM {bookmark} AS b LEFT JOIN {documents} AS d ON b.did = d.id WHERE b.uid = ".$uid." AND b.did = ".$did;
		$bookmark = self::fetchBookmark( $dbm->getFetchArray($que) );

		return $bookmark;
	}

	public static function insert($uid,$did) {
		$dbm = \DLDB\DBM::instance();

		$que = "INSERT INTO {bookmark} (`uid`,`did`,`regdate`) VALUES (?,?,?)";
		$dbm->execute($que,array("ddd",$uid,$did,time()));

		$insert_bid = $dbm->getLastInsertId();

		return $insert_bid;
	}

	public static function delete($bid) {
		$dbm = \DLDB\DBM::instance();

		$que = "DELETE FROM {bookmark} WHERE bid = ?";
		$dbm->execute( $que, array( "d", $bid ) );
	}

	private static function fetchBookmark($row,$mode='') {
		if(!$row) return null;
		foreach($row as $k => $v) {
			if( $k == 'custom' ) $v = unserialize($v);
			else if( $k == 'memo' ) continue;
			else if(is_string($v)) $v = stripslashes($v);
			$bookmark[$k] = $v;
		}
		if( $bookmark['custom'] && is_array($bookmark['custom']) ) {
			foreach($bookmark['custom'] as $k => $v) {
				$bookmark["f".$k] = $v;
			}
		}
		$acl = \DLDB\Acl::instance();
		if($bookmark['uid'] == $_SESSION['user']['uid']) {
			$bookmark['owner'] = 1;
		} else if( $acl->imMaster() ) {
			$bookmark['owner'] = 1;
		} else {
			$bookmark['owner'] = 0;
		}
		return $bookmark;
	}
}
?>
