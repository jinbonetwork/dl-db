<?php
namespace DLDB;

class Parser extends \DLDB\Objects {

	public static function insert($did,$memo) {
		$context = \DLDB\Model\Context::instance();

		switch($context->getProperty('service.search_type')) {
			case 'db':
				$dbm = \DLDB\DBM::instance();
				$que = "UPDATE {documents} SET `memo` = ? WHERE id = ?";
				$dbm->execute($que,array("sd",$memo,$did));
				break;
			case 'elastic':
				break;
		}
	}
	
	public static function parseFile($file) {
		switch($file['mimetype']) {
			case 'application/pdf':
				$memo = self::parsePDF($file);
				break;
			case 'application/msword':
			case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
				$memo = self::parseDoc($file);
				break;
			default:
				break;
		}
		if(trim($memo)) {
			$dbm = \DLDB\DBM::instance();
			$que = "UPDATE {files} SET `status` = ?, `textsize` = ?, `text` = ? WHERE fid = ?";
			$dbm->execute($que,array('sdsd','parsed', strlen(trim($memo)), trim($memo), $file['fid']) );
		}
		return trim($memo);
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

	public static function updateParse($file_info,$text) {
		$dbm = \DLDB\DBM::instance();

		$que = "UPDATE {files} SET `status` = ?, `textsize` = ?, `text` = ? WHERE fid = ?";
		$dbm->execute($que,array('sdsd','parsed', strlen(trim($text)), trim($text), $file_info['fid']) );
	}
}
?>
