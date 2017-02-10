<?php
define('__DLDB__',true);
if(!defined('ROOT'))
	define('ROOT','.');

/**
 * @brief 필요한 설정 파일들 include
 **/
require_once(ROOT.'/config/config.php');
define('__DLDB_LOADED_CLASS__',true);

global $context, $config;
$config = \DLDB\Model\Config::instance();
$context = \DLDB\Model\Context::instance();
$uri = \DLDB\Model\URIHandler::instance();
$context->setProperty('uri',$uri);
$context->setProperty('service.base_uri',$uri->uri['root']);

try {
	if(!is_null($context->getProperty('database.DB'))) {
		$db = $context->getProperty('database.*');
		$dbm = \DLDB\DBM::instance();
		$dbm->bind($db,1);
		register_shutdown_function( array($dbm,'release') );
	}

	$handle = fopen('php://stdin','r');
	$input = trim(fgets($handle));
	$data = preg_split("/:/i",$input);
	if(count($data) != 2) {
		\DLDB\RespondJson::ResultPage( array( -1, '입력형식이 올바르지 않습니다.') );
	}

	switch($data[0]) {
		case 'did':
			$did = (int)$data[1];
			$document = \DLDB\Document::get($did);
			if(!$document) {
				\DLDB\RespondJson::ResultPage( array( -3, '존재하지 않는 문서입니다.') );
			}
			$files = \DLDB\Files\DBM::getAttached($did);
			if(is_array($files)) {
				foreach($files as $file) {
					if($file['status'] == 'parsed') {
						$memo .= $file['text'];
					} else {
						$memo .= \DLDB\Parser::parseFile($file);
					}
				}
			}
			break;
		case 'fid':
		default:
			$file = \DLDB\Files::getFile((int)$data[1]);
			if($file['fid']) {
				$fid = $file['fid'];
				$did = $file['did'];
				$document = \DLDB\Document::get($did);
				if(!$document) {
					\DLDB\RespondJson::ResultPage( array( -3, '존재하지 않는 문서입니다.') );
				}
				$_memo = \DLDB\Parser::parseFile($file);
				if($did) {
					$files = \DLDB\Files\DBM::getAttached($fid);
					if(is_array($files)) {
						foreach($files as $file) {
							if($file['status'] == 'parsed') {
								$memo .= $file['text'];
							}
						}
					}
				}
			} else {
				\DLDB\RespondJson::ResultPage( array( -2, '파일이 존재하지 않습니다.') );
			}
			break;
	}

	if($did && $document) {
		\DLDB\Parser::insert($did,$document,$memo);
	}

	$dbm->release();

	\DLDB\RespondJson::ResultPage( array( 0, '파일 parsing이 완료되었습니다.') );
} catch(Exception $e) {
	$logger = \DLDB\Logger::instance();
	$logger->Error($e,DLDB_ERROR_ACTION_AJAX);
}
?>
