<?php
namespace DLDB;

class Document extends \DLDB\Objects {
	private static $fields;
	private static $cids;
	private static $taxonomy;
	private static $errmsg;

	public static function instance() {
		return self::_instance(__CLASS__);
	}

	public static function getFields() {
		if(!self::$fields) {
			self::$fields = \DLDB\Fields::getFields();
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

	public static function setFields($fields) {
		self::$fields = $fields;
	}

	public static function getTaxonomy() {
		if( self::$cids && !self::$taxonomy ) {
			self::$taxonomy = \DLDB\Taxonomy::getTaxonomyTerms(self::$cids);
		}
		return self::$taxonomy;
	}

	public static function get($id,$mode='') {
		$dbm = \DLDB\DBM::instance();

		$que = "SELECT * FROM {documents} WHERE `id` = ".$id;
		$row = $dbm->getFetchArray($que);
		if($row) {
			$document = self::fetchDocument($row);
		}
		if($mode == 'view') {
			unset($document['memo']);
			foreach( self::$fields as $fid => $field ) {
				if( $field['type'] == 'group' ) {
					unset($document['f'.$fid]);
				}
			}
		}
		return $document;
	}

	public static function totalCnt() {
		$dbm = \DLDB\DBM::instance();

		$que = "SELECT count(*) AS cnt FROM {documents}";
		$row = $dbm->getFetchArray($que);

		return ($row['cnt'] ? $row['cnt'] : 0);
	}

	public static function getList($page,$limit) {
		$dbm = \DLDB\DBM::instance();

		$que = "SELECT * FROM {documents} ORDER BY id DESC LIMIT " .( ( $page-1 ) * $limit ) . ", ". $limit;
		$documents = array();
		while($row = $dbm->getFetchArray($que)) {
			$documents[] = self::fetchDocument($row);
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
		$files = array();
		$attach_exists = false;
		foreach($args as $k => $v) {
			if(substr($k,0,1) == 'f') {
				$key = (int)substr($k,1);
				$field = self::$fields[$key];
				if($field['iscolumn']) {
					$que .= ",`f".$key."`";
					$que2 .= ",?";
					switch($field['type']) {
						case 'int':
							$array1 .= "d";
							break;
						default:
							$array1 .= "s";
							break;
					}
					$array2 .= ", ".($args['f'.$key] ? '$'."args[f".$key."]" : "''");
				} else {
					switch($field['type']) {
						case 'taxonomy':
							$cid = $field['cid'];
							if(is_array($v) && @count($v) > 0) {
								foreach($v as $t) {
									$custom[$key][$t] = array(
										'cid' => $cid,
										'name' => self::$taxonomy[$cid][$t]['name']
									);
									$taxonomy_map[$cid]['add'][$t] = array(
										'oid' => 0,
										'tid' => $t
									);
								}
							}
							break;
						case "file":
						case "image":
							if($v && !is_array($v)) {
								$v = array($v);
							}
							if(is_array($v)) {
								foreach($v as $f) {
									$file = \DLDB\Files::getFile($f);
									$custom[$key][$f] = array(
										'filepath' => $file['filepath'],
										'filename' => $file['filename'],
										'mimetype' => $file['mimetype']
									);
									$files[] = $file;
								}
							}
							break;
						default:
							$custom[$key] = $v;
							break;
					}
				}
			}
		}

		$que = $que.$que2.")";

		$array1 .= '",';
		$array2 .= ")";
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
				$que = "UPDATE {files} SET `did` = ? WHERE `fid` = ?";
				$dbm->execute($que,array("dd", $insert_id, $file['fid']));
			}
			switch($file['mimetype']) {
				case 'application/pdf':
					$memo .= self::parsePDF($file);
					break;
				case 'application/msword':
				case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
					$memo .= self::parseDoc($file);
					break;
			}
		}
		if($memo) {
			$que = "UPDATE {documents} SET memo = ? WHERE id = ?";
			$dbm->execute($que,array("sd",$memo,$insert_id));
		}
		if( is_array($taxonomy_map) ) {
			if( self::reBuildTaxonomy($insert_id, $taxonomy_map) < 0 ) {
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
		$files = array();
		$attach_exists = false;
		foreach($args as $k => $v) {
			if(substr($k,0,1) == 'f') {
				$key = (int)substr($k,1);
				$field = self::$fields[$key];
				if($field['iscolumn']) {
					$que .= ", `f".$key."` = ?";
					switch($field['type']) {
						case 'int':
							$array1 .= ",d";
							break;
						default:
							$array1 .= ",s";
							break;
					}
					$array2 .= ", ".($args['f'.$key] ? '$'."args[f".$key."]" : "''");
				} else {
					switch($field['type']) {
						case 'taxonomy':
							$cid = $field['cid'];
							if( is_array($document['f'.$key]) && count($document['f'.$key]) ) {
								foreach( $document['f'.$key] as $terms ) {
									$old_terms[$field['cid']][$terms['tid']] = $terms;
								}
							}
							if( is_array( $v ) ) {
								foreach($v as $t) {
									$custom[$key][$t] = array(
										'cid' => $cid,
										'name' => self::$taxonomy[$cid][$t]['name']
									);
									$new_terms[$field['cid']][$t] = self::$taxonomy[$cid][$t];
									if( !$old_terms[$field['cid']][$t] ) {
										$taxonomy_map[$cid]['add'][$t] = array(
											'oid' => 0,
											'tid' => $t
										);
									}
								}
							}
							if( @count($old_terms[$cid]) > 0 ) {
								foreach( $old_terms[$cid] as $ot => $ov ) {
									if( !$new_terms[$cid][$ot] ) {
										$taxonomy_map[$cid]['delete'][$ot] = $ov;
									}
								}
							}
							break;
						case "file":
						case "image":
							if( $document['f'.$key] && @count($document['f'.$key]) > 0 ) {
								$old_files = $document['f'.$key];
							}
							if($v && !is_array($v)) {
								$v = array($v);
							}
							if(is_array($v)) {
								foreach($v as $f) {
									$file = \DLDB\Files::getFile($f);
									$custom[$key][$f] = array(
										'filepath' => $file['filepath'],
										'filename' => $file['filename'],
										'mimetype' => $file['mimetype']
									);
									$files[] = $file;
									if($file['mimetype'] == 'application/pdf') {
										$attach_exists = true;
									}
								}
							}
							break;
						default:
							$custom[$key] = $v;
							break;
					}
				}
			}
		}
		$memo = '';
		if(is_array($files)) {
			foreach($files as $file) {
				switch($file['mimetype']) {
					case 'application/pdf':
						$memo .= self::parsePDF($file);
						break;
					case 'application/msword':
					case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
						$memo .= self::parseDoc($file);
						break;
				}
			}
		}

		$que .= ", `memo` = ? WHERE `id` = ?";
		$array1 .= 'sd",';
		$array2 .= ", ".'$'."memo, ".'$'."args['id'])";

		$eval_str = '$'."q_args = ".$array1.$array2.";";
		eval($eval_str);

		$dbm->execute($que,$q_args);

		if( is_array($taxonomy_map) ) {
			if( self::reBuildTaxonomy($args['id'], $taxonomy_map) < 0 ) {
				return -1;
			}
		}
		return 0;
	}

	public static function delete($id) {
		$dbm = \DLDB\DBM::instance();

		/* delete file */
		$files = \DLDB\Files::getList($id);
		if(is_array($files)) {
			foreach( $files as $file ) {
				$filename = \DLDB\Files::getFilePath($file['filepath']);
				\DLDB\Files::unlinkFile($filename);
				\DLDB\Files::deleteFile($file['fid']);
			}
		}

		/* delete document */
		$que = "DELETE FROM {document} WHERE `id` = ?";
		$dbm->execute($que,$id);

		/* delete term_relative */
		$que = "DELETE FROM {taxonomy_term_relative} WHERE `did` = ?";
		$dbm->execute($que,$id);

		/* delete bookmark */
		$que = "DELETE FROM {bookmark} WHERE `did` = ?";
		$dbm->execute($que,$id);
	}

	public static function reBuildTaxonomy($id,$taxonomy_map) {
		$dbm = \DLDB\DBM::instance();

		if( is_array($taxonomy_map) ) {
			foreach($taxonomy_map as $cid => $option_taxonomies) {
				if( is_array($option_taxonomies) ) {
					foreach($option_taxonomies as $option => $taxonomies) {
						switch($option) {
							case 'add':
								if( is_array($taxonomies) ) {
									foreach( $taxonomies as $tid => $term ) {
										$que = "INSERT INTO {taxonomy_term_relative} (`tid`, `did`) VALUES (?,?)";
										if( $dbm->execute( $que, array("dd",$id,$tid) ) < 1 ) {
											self::setErrorMsg( $que." 가 DB에 반영되지 않았습니다." );
											return -1;
										}
									}
								}
								break;
							case 'delete':
								if( is_array($taxonomies) ) {
									foreach( $taxonomies as $tid => $term ) {
										$que = "DELETE FROM {taxonomy_term_relative} WHERE `tid` = ? AND `did` = ?";
										$dbm->execute( $que, array("dd",$tid,$id) );
									}
								}
								break;
							default:
								break;
						} /* end of switch */
					} /* end of foreach($option_taxonomies) */
				}
			} /* end of foreach($taxonomy_map) */
		}

		return 0;
	}

	public static function parsePDF($file_info) {
		include_once DLDB_CONTRIBUTE_PATH."/pdfparser/vendor/autoload.php";
		$parser = new \Smalot\PdfParser\Parser();
		$filename = \DLDB\Files::getFilePath($file_info);
		$pdf = $parser->parseFile($filename);

		$pages = $pdf->getPages();

		foreach( $pages as $page ) {
			$text .= $page->getText()."\n";
		}
		return $text;
	}

	public static function parseDoc($file_info) {
		$filename = \DLDB\Files::getFilePath($file_info);
		$docObj = new Filetotext($filename);

		$text = $docObj->convertToText();

		return $text;
	}

	public static function getErrorMsg() {
		return self::$errmsg;
	}

	private static function setErrorMsg($msg) {
		self::$errmsg = $msg;
	}

	private static function fetchDocument($row) {
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
		return $document;
	}
}
?>
