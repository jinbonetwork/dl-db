<?php
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
$context->setProperty('service.base_uri',DLDB_URI);

try {
	if(!is_null($context->getProperty('database.DB'))) {
		$db = $context->getProperty('database.*');
		$dbm = \DLDB\DBM::instance();
		$dbm->bind($db,1);
		register_shutdown_function( array($dbm,'release') );
	}

/*	$args['subject'] = '민변디비 메일보내기 테스트';
	$args['name'] = "황규만";
	$args['user_id'] = "hwangkm@member.jinbo.net";
	$args['password'] = "1232421r4514";
	$args['link'] = 'https://dl.jinbo.net';
	$args['link_title'] = '바로가기';
	$recievers = array();
	$recievers[] = array('email' => 'hwangkm@member.jinbo.net', 'name'=>'황규만');

	$result = \DLDB\Mailer::sendMail("regist",$recievers,$args,3); */
	$args['name'] = '황규만';
	$args['subject'] = $context->getProperty('service.title')."에 새 자료가 업로드 되었습니다.";
	$args['title'] = '월성1호기 판결문';
	$args['content'] = "별첨 '80km에서 250km 이내 거주 원고목록 ’및 별첨 ‘250㎞ 이상 거주 원고 목록' 기재 원고들의 소는 부적합하여 각하하고, 나머지 원고들의 주의적 청구는 이유 없어 기각하고, 예비적 청구는 이유 있어 인용하며, 소송비용은 별첨 '80km에서 250km 이내 거주 원고목록 ’및 별첨 ‘250㎞ 이상 거주 원고 목록' 기재 원고들과 피고가 부담하도록 하여, 주문과 같이 판결";
	$args['files'] = array();
	$args['files'][] = array('filename'=>'월성1호기_판결문.pdf','status'=>'parsed');
	$args['link'] = \DLDB\Lib\full_url('document/19',array('ssl'=>$context->getProperty('service.ssl')));
	$fp = fopen("/tmp/dldb.log","a+");
	fputs($fp,$args['link']."\n");
	fclose($fp);
	$args['link_title'] = '문서보기';
	$recievers = array();
	$recievers[] = array('email' => 'hwangkm@member.jinbo.net', 'name'=>'황규만');

	$result = \DLDB\Mailer::sendMail("upload",$recievers,$args,3);
	$dbm->release();

	print print_r($result);
} catch(Exception $e) {
	$logger = \DLDB\Logger::instance();
	$logger->Error($e,DLDB_ERROR_ACTION_AJAX);
}
?>
