<?php
define("DEBUG_MODE",true);

$database['MYSQL_ERRNO_DUPKEY'] = '1062';
$database['HOST'] = 'localhost';
$database['USER'] = '데이터베이스 접속 아이디';
$database['PWD'] = '데이터베이스 접속 비밀번호';
$database['DB'] = '데이터베이스명';
$database['CHARSET'] = 'utf8';
$database['TIMEOUT'] = 5;
$database['RECONN_COUNT'] = 2;
$database['TB_PREFIX'] = 'dldb_';

$service['domain'] = 'domain.com';
$service['title'] = "단체협약DB";
$service['ssl'] = false;
$service['themes'] = 'minbyun';
$service['timezone'] = 'Asia/Seoul';
$service['encoding'] = 'UTF-8';
$service['LOG_TYPE'] = 1;
$service['search_type'] = 'elastic';

$session['type'] = 'xe';
$session['server'] = '127.0.0.1';
$session['cookie_domain'] = 'domain.com';
$session['cookie_path'] = '/';
$session['timeout'] = 14400;
?>
