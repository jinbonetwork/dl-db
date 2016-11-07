<?php
namespace DLDB;

class Document extends \DLDB\Objects {
	private static $fields;
	private static $cids;
	private static $taxonomy;

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

	public static function getTaxonomy() {
	}

	public static function get($id) {
		$dbm = \DLDB\DBM::instance();

		$que = "SELECT * FROM {document} WHERE `id` = ".$id;
		$row = $dbm->getFetchArray();
		if($row) {
			$document = self::fetchDocument($row);
		}
		return $document;
	}

	public static function insert($args) {
		$dbm = \DLDB\DBM::instance();

		$fields = self::getFields();

		$que = "INSERT INTO {document} (`subject`,`content`,`custom`,`uid`,`created`";
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
					$que .= ",f".$key;
					$que2 .= ",?";
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
							foreach($v as $t) {
								$custom[$key][$t] = array(
									'cid' => $cid,
									'name' => self::$taxonomy[$cid][$t]['name']
								);
								$taxonomy_map[$cid]['add'][$t] = array(
									'oid' => 0,
									'fid' => $key
								);
							}
							break;
						case "file":
						case "image":
							if(!is_array($v)) {
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

		$que = $que.$que2;

		$array1 .= '",';
		$array2 .= ")";
		$eval_str = '$'."q_args = ".$array1.$array2.";";
		eval($eval_str);

		if($dbm->execute($que,$q_args) < 1) {
			self::setErrorMsg($que." 가 DB에 반영되지 않았습니다.");
			return -1;
		}
		$insert_id = $dbm->getLastInsertId();

		if($attach_exists == true) {
			$parser = new \Smalot\PdfParser\Parser();
		}
		if(is_array($files)) {
			foreach($files as $file) {
				$que = "UPDATE {files} SET `did` = ? WHERE `fid` = ?";
				$dbm->execute($que,array("dd", $insert_id, $file['fid']));
			}
		}
	}

	private static function fetchDocument($row) {
		if(!$row) return null;
		foreach($row as $k => $v) {
			if($k == 'custom') $v = unserialize($v);
			else if(is_string($v)) $v = stripslashes($v);
			$document[$k] = $v;
		}
		return $document;
	}
}
?>
