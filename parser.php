<?php
set_time_limit(0);
ini_set("memory_limit", '2048M');

define('__DLDB__',true);
if(!defined('ROOT'))
	define('ROOT',dirname(__FILE__));

define('DLDB_URI','/');

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
	$data = json_decode($input,true);
	if($data['did']) {
		$did = (int)$data['did'];
	} else if($data['fid']) {
		$fid = (int)$data['fid'];
	} else {
		\DLDB\RespondJson::ResultPage( array( -1, 'invalid input') );
	}

	openlog("dldb_parser", LOG_PID,LOG_LOCAL0);

	if($did) {
		syslog(LOG_INFO, "start parsing of did [".$did."]");
		$document = \DLDB\Document::get($did);
		if(!$document) {
			syslog(LOG_INFO, "no exists document [".$did."]");
			closelog();
			\DLDB\RespondJson::ResultPage( array( -3, 'no exists document') );
		}
		print json_encode(array('error'=>0,'message'=>'parsing start'));
		$files = \DLDB\Files\DBM::getAttached($did);
		if(is_array($files)) {
			foreach($files as $file) {
				if($file['status'] == 'parsed') {
					$memo .= $file['text'];
				} else {
					syslog(LOG_INFO, "parsing file [".$file['filename']."]");
					$memo .= \DLDB\Parser::parseFile($file);
				}
			}
		}
	} else if($fid) {
		syslog(LOG_INFO, "start parsing of fid [".$fid."]");
		$file = \DLDB\Files::getFile($fid);
		if($file['fid']) {
			$did = $file['did'];
			$document = \DLDB\Document::get($did);
			if(!$document) {
				closelog();
				\DLDB\RespondJson::ResultPage( array( -3, 'no exists document') );
			}
			print json_encode(array('error'=>0,'message'=>'parsing start'));
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
			closelog();
			\DLDB\RespondJson::ResultPage( array( -2, ' no exists file') );
		}
	}
	syslog(LOG_INFO, "success paring file of did [".$did."]");

	if($did && $document) {
		syslog(LOG_INFO, "start indexing of did [".$did."]");
		\DLDB\Parser::insert($did,$document,$memo);
		syslog(LOG_INFO, "success indexing of did [".$did."]");
	}

	$send_mail = (int)$data['mail'];
	if( $send_mail && $document['id'] ) {
		if($document['uid']) {
			$member = \DLDB\Members::getByUid($document['uid']);
		}
		$admins = \DLDB\Members\DBM::getAdminID();
		if( @count($admins) > 0 ) {
			syslog(LOG_INFO, "start sendmail to administrator emails");
			$args['name'] = ($member['name'] ? $member['name'] : '익명의 회원');
			$args['subject'] = $context->getProperty('service.title')."에 새 자료가 업로드 되었습니다.";
			$args['title'] = $document['subject'];
			$args['content'] = nl2br($document['content']);
			$args['files'] = $files;
			$args['link'] = \DLDB\Lib\full_url('document/'.$document['id'],array('ssl'=>$context->getProperty('service.ssl')));
			$args['link_title'] = '문서보기';
			$recievers = array();
			foreach($admins as $adminID) {
				$recievers[] = array('email' => $adminID['email'], 'name' => $adminID['name'] );
			}

			$result = \DLDB\Mailer::sendMail("upload",$recievers,$args,0);
			if(!$result[0]) {
				syslog(LOG_INFO, "failure to sendmail because of '".$result[1]."'");
			} else {
				syslog(LOG_INFO, "success to sendmail");
			}
		}
	}
	closelog();

	$dbm->release();
} catch(Exception $e) {
	$logger = \DLDB\Logger::instance();
	$logger->Error($e,DLDB_ERROR_ACTION_AJAX);
}
?>
