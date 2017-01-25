<?php
namespace DLDB;

class Document extends \DLDB\Objects {
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
			self::$fields = \DLDB\Fields::getFields('documents');
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

	public static function setFields($fields) {
		self::$fields = $fields;
	}

	public static function getTaxonomy() {
		if( self::$cids && !self::$taxonomy ) {
			self::$taxonomy = \DLDB\Taxonomy::getTaxonomy(self::$cids);
		}
		return self::$taxonomy;
	}

	public static function getTaxonomyTerms() {
		if( self::$cids && !self::$taxonomy_terms ) {
			self::$taxonomy_terms = \DLDB\Taxonomy::getTaxonomyTerms(self::$cids);
		}
		return self::$taxonomy_terms;
	}

	public static function get($id,$mode='') {
		$dbm = \DLDB\DBM::instance();

		$que = "SELECT * FROM {documents} WHERE `id` = ".$id;
		$row = $dbm->getFetchArray($que);
		if($row) {
			$document = self::fetchDocument($row);
		}
		$fields = self::getFields();
		if($mode == 'view') {
			unset($document['memo']);
			foreach( $fields as $fid => $field ) {
				if( $field['type'] == 'group' ) {
					unset($document['f'.$fid]);
				} else if( $field['type'] == 'file' ) {
					if( is_array($document['f'.$fid]) ) {
						foreach( $document['f'.$fid] as $fd => $file ) {
							$_file = \DLDB\Files::getFile($fd);
							$document['f'.$fid][$fd]['status'] = $_file['status'];
							$document['f'.$fid][$fd]['anonymity'] = $_file['anonymity'];
							$document['f'.$fid][$fd]['textsize'] = $_file['textsize'];
						}
					}
				}
			}
		}
		return $document;
	}

	public static function getTexts($id) {
		$dbm = \DLDB\DBM::instance();

		$que = "SELECT memo,uid FROM {documents} WHERE `id` = ".$id;
		$row = $dbm->getFetchArray($que);

		if($row) {
			$row['memo'] = trim(stripslashes($row['memo']));
		}

		return $row;
	}

	public static function modifyText($id,$memo) {
		$dbm = \DLDB\DBM::instance();

		$que = "UPDATE {documents} SET `memo` = ? WHERE `id` = ?";
		$dbm->execute($que,array("sd",$memo,$id));
	}

	public static function totalCnt($uid=0) {
		$dbm = \DLDB\DBM::instance();

		$que = "SELECT count(*) AS cnt FROM {documents}";
		if($uid) $que .= " WHERE `uid` = ".$uid;
		$row = $dbm->getFetchArray($que);

		return ($row['cnt'] ? $row['cnt'] : 0);
	}
	
	public static function totalTaxonomy($tid,$uid=0) {
		$dbm = \DLDB\DBM::instance();

		$que = "SELECT t.tid, count(*) AS cnt FROM {taxonomy_term_relative} AS t".($uid ? " LEFT JOIN {documents} AS d ON t.`tables` = 'documents' AND t.did = d.id " : " ")."WHERE t.`tid` ".(is_array($tid) ? "IN (".implode(",",$tid).")" : "= ".$tid)." AND t.`tables` = 'documents' GROUP BY t.tid";
		while( $row = $dbm->getFetchArray($que) ) {
			$cnt[$row['tid']] = $row['cnt'];
		}
		return $cnt;
	}

	public static function getList($uid=0,$page,$limit) {
		$dbm = \DLDB\DBM::instance();

		$fields = self::getFields();

		$que = "SELECT * FROM {documents} ".( $uid ? "WHERE `uid` = ".$uid." " : '' )."ORDER BY `id` DESC LIMIT " .( ( $page-1 ) * $limit ) . ", ". $limit;
		$documents = array();
		while($row = $dbm->getFetchArray($que)) {
			$documents[] = self::fetchDocument($row,'view');
		}
		return $documents;
	}

	public static function insert($args) {
		$dbm = \DLDB\DBM::instance();

		$fields = self::getFields();
		$uid = $_SESSION['user']['uid'];

		$que = "INSERT INTO {documents} (`subject`,`content`,`custom`,`uid`,`created`";
		$que2 .= ") VALUES (?,?,?,?,?";
		$array1 = 'array("sssdd';
		$array2 = '$'."args['subject'], ".'$'."args['content'], serialize(".'$'."custom), ".'$'."uid, time()";

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
		$insert_id = $dbm->getLastInsertId();

		$memo = '';
		if(is_array($files)) {
			foreach($files as $file) {
				$memo .= \DLDB\Parser::parseFile($file);
				$que = "UPDATE {files} SET `did` = ? WHERE `fid` = ?";
				$dbm->execute($que,array("dd", $insert_id, $file['fid']));
			}
		}
//		if(trim($memo)) {
			\DLDB\Parser::insert($insert_id,$args,$memo);
//		}
		if( is_array($taxonomy_map) ) {
			if( $fieldquery->reBuildTaxonomy('documents', $insert_id, $taxonomy_map) < 0 ) {
				self::setErrorMsg( $fieldquery->getErrorMsg() );
				return -1;
			}
		}
		return $insert_id;
	}

	public static function modify($document,$args) {
		$dbm = \DLDB\DBM::instance();

		$fields = self::getFields();

		$que = "UPDATE {documents} SET `subject`=?, `content`=?, `custom`=?";
		$array1 = 'array("sss';
		$array2 = '$'."args['subject'], ".'$'."args['content'], serialize(".'$'."custom)";

		$fieldquery = \DLDB\FieldsQuery::instance();
		$fieldquery->setFields($fields);
		$fieldquery->setTaxonomy(self::$taxonomy);
		$fieldquery->setTaxonomyTerms(self::$taxonomy_terms);
		$result = $fieldquery->modifyQue($que,$array1,$array2,$document,$args);
		@extract($result);

		$que .= " WHERE `id` = ?";
		$array1 .= 'd",';
		$array2 .= ", ".'$'."args['id'])";

		$eval_str = '$'."q_args = ".$array1.$array2.";";
		eval($eval_str);

		$dbm->execute($que,$q_args);

		$memo = '';
		$new_parse = false;
		if( is_array($files) ) {
			foreach($files as $file) {
				if($old_files[$file['fid']]) {
					$memo .= $file['text'];
				} else {
					$new_parse = true;
					$memo .= \DLDB\Parser::parseFile($file);
				}
			}
		}
		if( is_array($del_files) ) {
			foreach($del_files as $d_fd => $d_file) {
				\DLDB\Files::deleteFile($d_fd);
				\DLDB\Files::unlinkFile(DLDB_DA_PATH.$d_file['filepath']);
			}
		}
//		if(trim($memo) && $new_parse) {
			\DLDB\Parser::insert($args['id'],$args,$memo);
//		}

		if( is_array($taxonomy_map) ) {
			if( $fieldquery->reBuildTaxonomy('documents', $args['id'], $taxonomy_map) < 0 ) {
				return -1;
			}
		}
		return 0;
	}

	public static function delete($id) {
		$context = \DLDB\Model\Context::instance();
		$dbm = \DLDB\DBM::instance();

		/* delete file */
		$files = \DLDB\Files::getList($id);
		if(is_array($files)) {
			foreach( $files as $file ) {
				$filename = \DLDB\Files::getFilePath($file);
				if(\DLDB\Files::unlinkFile($filename)) {
					self::$errmsg = \DLDB\Files::errMsg();
					return -1;
				}
				\DLDB\Files::deleteFile($file['fid']);
			}
		}

		/* delete document */
		$que = "DELETE FROM {documents} WHERE `id` = ?";
		$dbm->execute($que,array("d",$id));

		switch($context->getProperty('service.search_type')) {
			case 'db':
				break;
			case 'elastic':
				$else = \DLDB\Search\Elastic::instance();
				$fields = self::getFields();
				$taxonomy = self::getTaxonomy();
				$taxonomy_terms = self::getTaxonomyTerms();
				$else->setFields($fields,$taxonomy,$taxonomy_terms);
				foreach( $taxonomy as $cid => $taxo ) {
					if($taxo['skey']) {
						$skey_taxonomy_terms = $taxonomy_terms[$cid];
					}
				}
				$que = "SELECT * FROM {taxonomy_term_relative} WHERE `tables` = 'documents' AND `did` = ".$id;
				while($row = $dbm->getFetchArray($que)) {
					if($skey_taxonomy_terms[$row['tid']]) {
						$else->remove($id,'t'.$row['tid']);
					}
				}
				$else->remove($id,'main');
				break;
			default:
				break;
		}

		/* delete term_relative */
		$que = "DELETE FROM {taxonomy_term_relative} WHERE `tables` = ? AND `did` = ?";
		$dbm->execute($que,array("sd",'documents',$id));

		/* delete bookmark */
		$que = "DELETE FROM {bookmark} WHERE `did` = ?";
		$dbm->execute($que,array("d",$id));

		return 0;
	}

	public static function getErrorMsg() {
		return self::$errmsg;
	}

	private static function setErrorMsg($msg) {
		self::$errmsg = $msg;
	}

	public static function fetchDocument($row,$mode='') {
		$acl = \DLDB\Acl::instance();
		$fields = self::getFields();
		if(!$row) return null;
		foreach($row as $k => $v) {
			if($k == 'custom') $v = unserialize($v);
			else if($mode == 'view' && $k == 'memo') continue;
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
		} else if( $acl->imMaster() ) {
			$document['owner'] = 1;
		} else {
			$document['owner'] = 0;
		}

		foreach($fields as $f => $field) {
			switch($field['type']) {
				case 'date':
					if(is_string($document['f'.$f])) {
						$_date = preg_split("/[\- :]+/i",$document['f'.$f]);
						for($i=0; $i<strlen($field['form']); $i++) {
							switch($field['form'][$i]) {
								case 'Y':
									$date['year'] = $_date[$i];
									break;
								case 'm':
									$date['month'] = $_date[$i];
									break;
								case 'd':
									$date['day'] = $_date[$i];
									break;
								case 'H':
									$date['hour'] = $_date[$i];
									break;
								case 'i':
									$date['minute'] = $_date[$i];
									break;
								case 's':
									$date['second'] = $_date[$i];
									break;
								default:
									break;
							}
						}
						$document['f'.$f] = $date;
					}
					break;
				default:
					break;
			}
		}

		return $document;
	}
}
?>
