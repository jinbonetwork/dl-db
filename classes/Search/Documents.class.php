<?php
namespace DLDB\Search;

class Documents extends \DLDB\Objects {
	public static function getAllList() {
		$dbm = \DLDB\DBM::instance();

		$documents = array();

		$que = "SELECT * FROM {documents} ORDER BY id ASC";
		while( $row = $dbm->getFetchArray($que) ) {
			$documents[] = \DLDB\Document::fetchDocument($row);
		}

		return $documents;
	}
}
?>
