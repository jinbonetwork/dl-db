<?php
/**
 * @file	config/config.php
 * @brief	기본적으로 사용하는 환경 설정 변수 값 설정 및 class 파일의 include
 **/

@error_reporting(E_ALL ^ E_NOTICE);
ini_set('display_errors','1');

if(!defined('__DLDB__')) exit();

/**
 * @brief JinboNet PHP Framework System의 전체 버젼 표기
 **/
define('DLDB_NAME', 'DLDB');
define('DLDB_VERSION', '0.5');

/**
 * @brief JinboNet PHP Framework System이 설치된 장소의 base path를 구함
 **/
define('DLDB_PATH',str_replace('/config/config.php','',str_replace('\\', '/', __FILE__)));
if(!defined('DLDB_URI')) {
	if(ROOT != '.') {
		$document_root = str_replace($_SERVER["SCRIPT_NAME"],'',$_SERVER['SCRIPT_FILENAME']);
		define('DLDB_URI','/'.str_replace($document_root,"",rtrim(dirname(__FILE__),"/config")));
	} else
		define('DLDB_URI',rtrim(str_replace('index.php', '', $_SERVER["SCRIPT_NAME"])));
}

/**
 * Path Configuration
 **/

define('DLDB_CLASS_PATH', DLDB_PATH.'/framework/classes');
define('DLDB_LIB_PATH', DLDB_PATH.'/framework/library');
define('DLDB_RESOURCE_URI', DLDB_URI.'resources');
define('DLDB_RESOURCE_PATH', DLDB_PATH.'/resources');
define('DLDB_CONTRIBUTE_URI', DLDB_URI.'contribute');
define('DLDB_CONTRIBUTE_PATH', DLDB_PATH.'/contribute');
define('DLDB_DATA_URI', DLDB_URI.'files');
define('DLDB_DATA_PATH', DLDB_PATH.'/files');
define('DLDB_CACHE_PATH', DLDB_PATH.'/files/cache');

define('DLDB_APP_PATH', DLDB_PATH.'/app/');
define('DLDB_API_PATH', DLDB_PATH.'/app/api');

define('DLDB_DEBUG',			1);

define("DLDB_LOG_TYPE_PRINT",	1);
define("DLDB_LOG_TYPE_FILE",	2);
define("DLDB_LOG_TYPE_ALL",		3);

define("DLDB_LOG_TYPE",			DLDB_LOG_TYPE_PRINT);

define("DLDB_LOG_ID", 'www');
define("DLDB_LOG_DATE_FORMAT", 'Y-m-d H:i:s');
define("DLDB_ERROR_LOG_PATH", DLDB_PATH."/files/log/");

define("DLDB_ERROR_ACTION_AJAX", 1);
define("DLDB_ERROR_ACTION_URL", 2);
define("DLDB_ERROR_AJAX_MSG", "FAIL");

define("DLDB_COMMON_ERROR_PAGE", "");

define("DLDB_REGHEIGHT_CONFIG_URL", "");

define('DIRECTORY_SEPARATOR','/');

require_once DLDB_CLASS_PATH."/Autoload.class.php";
require_once DLDB_CLASS_PATH."/Objects.class.php";
require_once DLDB_CLASS_PATH."/Controller.class.php";

require_once DLDB_LIB_PATH."/common.php";
require_once DLDB_LIB_PATH."/import.php";

//spl_autoload_register(array('Autoload', 'load'));
$autoloader = new \DLDB\Autoload;
$autoloader->register();

$autoloader->addNamespace('DLDB',DLDB_CLASS_PATH);
$autoloader->addNamespace('DLDB\Model',DLDB_CLASS_PATH."/Model");
$autoloader->addNamespace('DLDB',DLDB_PATH."/classes");
$autoloader->addNamespace('DLDB\App',DLDB_APP_PATH);
$autoloader->addNamespace('DLDB\CONTRIBUTE',DLDB_CONTRIBUTE_PATH);

define( 'BITWISE_ADMINISTRATOR', 1 );
define( 'BITWISE_WRITE', 3 );
define( 'BITWISE_DOWNLOAD', 5 );
define( 'BITWISE_VIEW', 7 );
define( 'BITWISE_AUTHENTICATED', 16 );
define( 'BITWISE_ANONYMOUS', 17 );

global $AclPreDefinedRole;
$AclPreDefinedRole = array(
	'administrator'=>BITWISE_ADMINISTRATOR,
	'write'=>BITWISE_WRITE,
	'download'=>BITWISE_DOWNLOAD,
	'view'=>BITWISE_VIEW,
	'anonymous'=>BITWISE_ANONYMOUS
);

define( 'PW_ALGO', 'sha256' );

global $dev;
$dev = array(
	'timestamp' => time(),
);
?>
