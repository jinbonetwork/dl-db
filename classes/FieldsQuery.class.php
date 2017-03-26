<?php
namespace DLDB;

class FieldsQuery extends \DLDB\Objects {
	private $fields;
	private $taxonomy;
	private $taxonomy_terms;
	private $errmsg;
	private $reindex;

	public static function instance() {
		return self::_instance(__CLASS__);
	}

	public function setFields($fields) {
		$this->fields = $fields;
	}

	public function setTaxonomy($taxonomy) {
		$this->taxonomy = $taxonomy;
	}

	public function setTaxonomyTerms($taxonomy_terms) {
		$this->taxonomy_terms = $taxonomy_terms;
	}

	public function insertQue($que,$que2,$array1,$array2,$args) {
		$fields = $this->fields;
		$taxonomy_terms = $this->taxonomy_terms;
		$files = array();

		foreach($args as $k => $v) {
			if(substr($k,0,1) == 'f') {
				$key = (int)substr($k,1);
				$field = $this->fields[$key];
				if($field['iscolumn']) {
					$que .= ",`f".$key."`";
					$que2 .= ",?";
					switch($field['type']) {
						case 'int':
							$array1 .= "d";
							break;
						case 'date':
							$array1 .= "s";
							$args['f'.$key] = $this->buildDate($field,$args['f'.$key]);
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
							if($v && !is_array($v)) {
								$v = array($v);
							}
							if(is_array($v) && @count($v) > 0) {
								foreach($v as $t) {
									$custom[$key][$t] = array(
										'cid' => $cid,
										'name' => $taxonomy_terms[$cid][$t]['name']
									);
									$taxonomy_map[$cid]['add'][$t] = array(
										'cid' => $cid,
										'tid' => $t
									);
								}
							}
							break;
						case "date":
							$v = $this->buildDate($field,$v);
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
										'fileuri' => \DLDB\Files::getFileUrl($file),
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

		$array1 .= '",';
        $array2 .= ")";

		return array('que' => $que, 'que2' => $que2.")", 'array1' => $array1, 'array2' => $array2, 'custom' => $custom, 'files' => $files, 'taxonomy_map' => $taxonomy_map, 'args' => $args);
	}

	public function modifyQue($que,$array1,$array2,$old,$args) {
		$fields = $this->fields;
		$taxonomy_terms = $this->taxonomy_terms;
		$files = array();

		foreach($args as $k => $v) {
			if(substr($k,0,1) == 'f') {
				$key = (int)substr($k,1);
				$field = $fields[$key];
				if($field['iscolumn']) {
					$que .= ", `f".$key."` = ?";
					switch($field['type']) {
						case 'int':
							$array1 .= "d";
							break;
						case 'date':
							$array1 .= "s";
							$args['f'.$key] = $this->buildDate($field,$args['f'.$key]);
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
							if( is_array($old['f'.$key]) && count($old['f'.$key]) ) {
								foreach( $old['f'.$key] as $_t => $terms ) {
									$old_terms[$field['cid']][$_t] = $terms;
								}
							}
							if($v && !is_array($v)) {
								$v = array($v);
							}
							if( is_array( $v ) ) {
								foreach($v as $t) {
									$custom[$key][$t] = array(
										'cid' => $cid,
										'name' => $taxonomy_terms[$cid][$t]['name']
									);
									$new_terms[$field['cid']][$t] = $taxonomy_terms[$cid][$t];
									if( !$old_terms[$field['cid']][$t] ) {
										$taxonomy_map[$cid]['add'][$t] = array(
											'cid' => $cid,
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
						case "date":
							$v = $this->buildDate($field,$v);
							break;
						case "file":
						case "image":
							if( $old['f'.$key] && @count($old['f'.$key]) > 0 ) {
								if( is_array($old['f'.$key]) ) {
									foreach( $old['f'.$key] as $_fd => $_o_file ) {
										$old_files[$_fd] = $_o_file;
									}
								}
							}
							if($v && !is_array($v)) {
								$v = array($v);
							}
							if(is_array($v)) {
								foreach($v as $f) {
									$file = \DLDB\Files::getFile($f);
									$custom[$key][$f] = array(
										'fileuri' => \DLDB\Files::getFileUrl($file),
										'filepath' => $file['filepath'],
										'filename' => $file['filename'],
										'mimetype' => $file['mimetype']
									);
									$files[] = $file;
									$n_files[$f] = $file;
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

		if( is_array($old_files) ) {
			$del_files = array();
			foreach( $old_files as $_fd => $_file ) {
				if( !$n_files[$_fd] ) {
					$del_files[$_fd] = $_file;
				}
			}
		}

		return array('que' => $que, 'que2' => $que2.")", 'array1' => $array1, 'array2' => $array2, 'custom' => $custom, 'files' => $files, 'del_files' => $del_files, 'taxonomy_map' => $taxonomy_map, 'old_files' => $old_files, 'args' => $args);
	}

	public function buildDate($field,$value) {
		$out = '';
		for($i=0; $i<strlen($field['form']); $i++) {
			switch($field['form'][$i]) {
				case 'Y':
					if($value['year']) $out .= ($out ? "-" : "").sprintf("%4d",(int)$value['year']);
					break;
				case 'm':
					if($value['month']) $out .= ($out ? "-" : "").sprintf("%02d",(int)$value['month']);
					break;
				case 'd':
					if($value['day']) $out .= ($out ? "-" : "").sprintf("%02d",(int)$value['day']);
					break;
				case 'H':
					if($value['month']) $out .= ($out ? " " : "").sprintf("%02d",(int)$value['month']);
					break;
				case 'i':
					if($value['minute']) $out .= ($out ? ":" : "").sprintf("%02d",(int)$value['minute']);
					break;
				case 's':
					if($value['second']) $out .= ($out ? ":" : "").sprintf("%02d",(int)$value['second']);
					break;
				default:
					break;
			}
		}

		return $out;
	}

	public function reBuildTaxonomy($table, $id,$taxonomy_map) {
		$dbm = \DLDB\DBM::instance();

		$this->reindex = false;
		if( is_array($taxonomy_map) ) {
			foreach($taxonomy_map as $cid => $option_taxonomies) {
				if( is_array($option_taxonomies) ) {
					foreach($option_taxonomies as $option => $taxonomies) {
						switch($option) {
							case 'add':
								if( is_array($taxonomies) ) {
									foreach( $taxonomies as $tid => $term ) {
										$que = "INSERT INTO {taxonomy_term_relative} (`tid`, `tables`, `did`) VALUES (?,?,?)";
										if( $dbm->execute( $que, array("dsd",$tid,$table,$id) ) < 1 ) {
											$this->setErrorMsg( $que." 가 DB에 반영되지 않았습니다." );
											return -1;
										}
										if( $this->taxonomy[$cid]['skey'] ) {
											$this->reindex = true;
										}
									}
								}
								break;
							case 'delete':
								if( is_array($taxonomies) ) {
									foreach( $taxonomies as $tid => $term ) {
										$que = "DELETE FROM {taxonomy_term_relative} WHERE `tid` = ? AND `tables` = ? AND `did` = ?";
										$dbm->execute( $que, array("dsd",$tid,$table,$id) );
										if( $this->taxonomy[$cid]['skey'] ) {
											\DLDB\Parser::remove($id, $tid);
										}
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

	public function requireIndex() {
		return ($this->reindex == true ? 1 : 0);
	}

	public function getErrorMsg() {
		return $this->errmsg;
	}

	private function setErrorMsg($msg) {
		$this->errmsg = $msg;
	}
}
?>
