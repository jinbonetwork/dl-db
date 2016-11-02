<?php
namespace DLDB\Model;

final class URIHandler extends \DLDB\Objects {
	public $uri, $params, $appPath;

	public static function instance() {
		return self::_instance(__CLASS__);
	}

	protected function __construct() {
		$this->__URIinterpreter();
	}

	public function URIParser() {
		$this->__URIParser();
	}

	private function __URIinterpreter() {
		global $context;

		$uri = parse_url(($_SERVER['HTTPS'] == 'on' ? "https" : "http")."://".$_SERVER['HTTP_HOST'].str_replace('index.php', '', $_SERVER['REQUEST_URI']));
		if($uri) {
			$uri += array (
				'fullpath'  => str_replace('index.php', '', $_SERVER["REQUEST_URI"]),
				'root'      => rtrim(str_replace('index.php', '', $_SERVER["SCRIPT_NAME"]), 'index.php')
			);
		}
		$uri['fullpath'] = $uri['root'].substr($uri['fullpath'], strlen($uri['root']) - 1);
		if($uri['fullpath'] == "/") {
			$uri['fullpath'] .= "react";
		}
		$uri['fullpath'] = rtrim($uri['fullpath'],"/");
		$uri['input'] = ltrim(substr($uri['fullpath'],strlen($uri['root'])));
		$path = strtok($uri['input'], '/');
		if(in_array($path,array('resources','contribute','themes','files'))) {
			$use_filehandler = $context->getProperty('service.use_filehandler');
			if($use_filehandler) {
				include_once $use_filehandler;
				exit;
			}
			else {
				$part = ltrim(rtrim($uri['input']), '/');
				$part = (($qpos = strpos($part, '?')) !== false) ? substr($part, 0, $qpos) : $part;
				if(file_exists($part)) {
					require_once DLDB_LIB_PATH.'/file.php';
					\DLDB\Lib\dumpWithEtag($part);
					exit;
				} else {
					header("HTTP/1.0 404 Not Found");exit;
				}
			}
		}
		$uri['input'] = $uri['input'].'/';
		unset($uri['fragment']);
		$uri['fragment'] = array_values(array_filter(explode('/',strtok($uri['input'],'?'))));
		unset($part);


		if(!count($uri['fragment'])) {
			$uri['appType'] = 'react';
			$pathPart = DLDB_APP_PATH."react";
		} else if($uri['fragment'][0] == 'search') {
			$uri['appType'] = 'react';
			$pathPart = DLDB_APP_PATH."react";
		} else if( in_array($uri['fragment'][0], array( 'user', 'document', 'error' ) ) ) {
			$uri['appType'] = 'react';
			$pathPart = DLDB_APP_PATH."react";
		} else {
			if (isset($uri['fragment'][0]) && file_exists(DLDB_APP_PATH.$uri['fragment'][0])) {
				$uri['appType'] = $uri['fragment'][0];
				$pathPart = DLDB_APP_PATH.implode("/",$uri['fragment']);
			} else {
				header("HTTP/1.0 404 Not Found");exit;
			}
		}

		$pathPart = strtok($pathPart,'?&');

		if(file_exists($pathPart.".php")) {
			$uri['appPath'] = dirname($pathPart);
			$uri['appFile'] = basename($pathPart);
			$uri['appSpace'] = "DLDB\\App\\".str_replace( "/", "\\", dirname( substr($pathPart, strlen(DLDB_APP_PATH)) ) );
			$uri['appClass'] = $uri['appSpace']."\\".$uri['appFile'];
			$uri['appProcessor'] = "process";
		} else if(file_exists($pathPart."/index.php")) {
			$uri['appPath'] = $pathPart;
			$uri['appFile'] = "index";
			$uri['appSpace'] = "DLDB\\App\\".str_replace( "/", "\\", rtrim(substr($pathPart, strlen(DLDB_APP_PATH) ) ,"/") );
			$uri['appClass'] = $uri['appSpace']."\\"."index";
			$uri['appProcessor'] = "process";
		} else if(file_exists(dirname($pathPart)."/index.php")) {
			$uri['appPath'] = dirname($pathPart);
			$uri['appFile'] = "index";
			$uri['appSpace'] = "DLDB\\App\\".str_replace( "/", "\\", rtrim(dirname( substr($pathPart, strlen(DLDB_APP_PATH)) ) ,"/") );
			$uri['appClass'] = $uri['appSpace']."\\"."index";
			$uri['appProcessor'] = basename($pathPart);
		} else {
			header("HTTP/1.0 404 Not Found");exit;
		}
		$this->uri = $uri;
	}

	private function __URIParser() {
		if(!isset($this->uri)) $this->__URIinterpreter();

		if(!$this->uri['appPath'] || !$this->uri['appFile']) {
			\DLDB\Respond::NotFoundPage();
		}
		$this->params = array_merge($_GET, $_POST);
		$fp = fopen("/tmp/cadb2.txt","w");
		fputs($fp,serialize($this->params));
		fclose($fp);
		foreach($this->params as $k => $v) {
			if(!is_array($v) && $this->isJson($v)) {
				$this->params[$k] = json_decode($v,true);
			}
		}
		$this->params['appType'] = $this->uri['appType'];
		$this->params['path'] = substr($this->uri['appPath'],strlen(DLDB_PATH)+1);
		$this->params['browserType'] = $this->uri['browserType'];
		$this->params['controller']['path'] = $this->uri['appPath'];
		$this->params['controller']['uri'] = rtrim($this->uri['root'].substr($this->uri['appPath'],strlen(DLDB_PATH)+1),"/");
		$this->params['controller']['file'] = $this->uri['appFile'];
		$this->params['controller']['class'] = $this->uri['appClass'];
		$this->params['controller']['process'] = $this->uri['appProcessor'];
	}

	private function isJson($json_string) {
		call_user_func_array('json_decode',func_get_args());
		    return (json_last_error()===JSON_ERROR_NONE);
//		return !preg_match('/[^,:{}\\[\\]0-9.\\-+Eaeflnr-u \\n\\r\\t]/',
//		       preg_replace('/"(\\.|[^"\\\\])*"/', '', $json_string));
	}
}
?>
