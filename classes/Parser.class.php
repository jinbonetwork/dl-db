<?php
namespace DLDB;

class Parser extends \DLDB\Objects {
	private static $filter;

	public static function insert($did,$args,$memo) {
		$context = \DLDB\Model\Context::instance();

		$dbm = \DLDB\DBM::instance();
		$que = "UPDATE {documents} SET `memo` = ? WHERE id = ?";
		$dbm->execute($que,array("sd",$memo,$did));
		switch($context->getProperty('service.search_type')) {
			case 'elastic':
				$else = \DLDB\Search\Elastic::instance();
				$else->setFields();
				$else->update($did,$args,$memo);
				break;
			default:
				break;
		}
	}

	public static function getFilter() {
		if(!self::$filter) {
			$dbm = \DLDB\DBM::instance();

			$que = "SELECT * FROM {file_filter} ORDER BY id ASC";
			while( $row = $dbm->getFetchArray($que) ) {
				self::$filter[$row['ext']][$row['id']] = self::fetchFilter($row);
			}
		}
		return self::$filter;
	}
	
	public static function parseFile($file) {
		self::getFilter();

		$dbm = \DLDB\DBM::instance();

		$que = "UPDATE {files} SET `status` = ?, `progress` = ? WHERE fid = ?";
		$dbm->execute($que, array("sdd", 'parsing', 0, $file['fid'] ) );

		switch($file['mimetype']) {
			case 'application/pdf':
				$out = self::parsePDF($file);
				break;
			case 'application/msword':
			case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
				$out = self::parseDoc($file);
				break;
			default:
				break;
		}
		if($out['text']) {
			$que = "UPDATE {files} SET `status` = ?, `textsize` = ?, `text` = ?, `header` = ? WHERE fid = ?";
			$dbm->execute($que, array('sdssd','parsed', strlen($out['text']), $out['text'], serialize($out['header']), $file['fid'] ) );
		} else if( $out['header']['error'] ) {
			$que = "UPDATE {files} SET `status` = ?, `header` = ? WHERE fid = ?";
			$dbm->execute($que, array("ssd", 'unparsed',serialize($out['header']), $file['fid'] ) );
		}
		return $out['text'];
	}

	public static function parsePDF($file_info) {
		include_once DLDB_CONTRIBUTE_PATH."/pdfparser/vendor/autoload.php";

		$dbm = \DLDB\DBM::instance();

		$parser = new \Smalot\PdfParser\Parser();
		$filename = \DLDB\Files::getFilePath($file_info);
		try {
			$pdf = $parser->parseFile($filename);

			$details  = $pdf->getDetails();
			if ( is_array($details) ) {
				foreach( $details as $property => $value ) {
					if ( is_array( $value ) ) {
						$value = implode(', ', $value);
					}
					$header[$property] = mb_convert_encoding($value, 'UTF-8', 'UTF-8');
				}
			}

			$errmsg = self::validPDF( $header );

			if(!$errmsg) {
				$pages = $pdf->getPages();
				$total_page = @count($pages);

				$cnt = 0;
				foreach( $pages as $page ) {
					$text .= mb_convert_encoding($page->getText(), 'UTF-8', 'UTF-8')."\n";
					$cnt++;
					$progress = (int)( ( $cnt / $total_page ) * 100 );
					$que = "UPDATE {files} SET `progress` = ? WHERE `fid` = ?";
					$dbm->execute($que, array("dd",$progress,$file_info['fid']) );
				}
			} else {
				$header['error'] = $errmsg;
			}
		} catch(Exception $e) {
			$header['error'] = $e;
		} finally {
			return array('text'=>trim($text),'header'=>$header);
		}
	}

	public static function parseDoc($file_info) {
		$filename = \DLDB\Files::getFilePath($file_info);
		$docObj = new Filetotext($filename);

		$text = $docObj->convertToText();
		$header = '';

		return array('text'=>trim($text),'header'=>$header);
	}

	public static function updateParse($file_info,$text) {
		$dbm = \DLDB\DBM::instance();

		$que = "UPDATE {files} SET `status` = ?, `textsize` = ?, `text` = ? WHERE fid = ?";
		$dbm->execute($que,array('sdsd','parsed', strlen(trim($text)), trim($text), $file_info['fid']) );
	}

	public static function validPDF($header) {
		$filters = self::getFilter();
		if( $filters['pdf'] && is_array($filters['pdf']) ) {
			foreach( $filters['pdf'] as $fid => $filter ) {
				if( preg_match($filter['pattern'], $header[$filter['field']] ) ) {
					return $filter['message'];
				}
			}
		}
		return '';
	}

	private static function fetchFilter($row) {
		if(!$row) return null;
		foreach($row as $k => $v) {
			if(is_string($v)) {
				$v = stripslashes($v);
			}
			$filter[$k] = $v;
		}
		return $filter;
	}
}
?>
