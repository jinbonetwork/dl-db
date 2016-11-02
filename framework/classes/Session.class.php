<?php
final class Session {
	private static $sessionName = null;
	private static $mc = null;
	private static $context;
	private static function initialize() {
		global $memcache;
		self::$mc = $memcache;
		self::$context = Model_Context::instance();
	}

	public static function open($savePath, $sessionName) {
		return true;
	}

	public static function close() {
	}

	public static function getName() {
		if(is_null(self::$mc)) self::initialize();
		if( self::$sessionName == null ) {
			if( !is_null(self::$context->getProperty('service.session_cookie'))) {
				self::$sessionName = self::$context->getProperty('service.session_cookie');
			} else {
				self::$sessionName = 'JSESSION'.self::$context->getProperty('service.domain');
				self::$sessionName = preg_replace( '/[^a-zA-Z0-9]/', '', self::$sessionName );
			}
		}
		return self::$sessionName;
	}

	public static function read($id) {
		if(is_null(self::$mc)) self::initialize();
		if(!$id) return false;
		return self::$mc->get(self::$context->getProperty('service.domain')."/sessions/{$id}/{$_SERVER['REMOTE_ADDR']}");
	}

	public static function write($id, $data) {
		if(is_null(self::$mc)) self::initialize();
		return self::$mc->set(self::$context->getProperty('service.domain')."/sessions/{$id}/{$_SERVER['REMOTE_ADDR']}",$data,0,self::$context->getProperty('session.timeout'));
	}

	public static function destroy($id,$setCookie = false) {
		self::$mc->delete(self::$context->getProperty('service.domain')."/sessions/{$id}/{$_SERVER['REMOTE_ADDR']}");
	}

	public static function gc($maxLifeTime = false) {
		return true;
	}

	private static function newAnonymousSession() {
		for ($i = 0; $i < 3; $i++) {
			$id = dechex(rand(0x10000000, 0x7FFFFFFF)) . dechex(rand(0x10000000, 0x7FFFFFFF)) . dechex(rand(0x10000000, 0x7FFFFFFF)) . dechex(rand(0x10000000, 0x7FFFFFFF));
			$result = self::$mc->set(self::$context->getProperty('service.domain')."/sessions/{$id}/{$_SERVER['REMOTE_ADDR']}",true,0,self::$context->getProperty('session.timeout'));      
			return $id;
		}
		return false;
	}

	public static function set() {
		if(is_null(self::$mc)) self::initialize();
		if( !empty($_GET['JSESSION']) ) {
			$id = $_GET['JSESSION'];
			$_COOKIE[session_name()] = $id;
		} else if ( !empty($_COOKIE[session_name()]) ) {
			$id = $_COOKIE[session_name()];
		} else {
			$id = '';
		}
		if ((strlen($id) < 32) || !(self::read($id))) {
			$id = self::newAnonymousSession();
		}
	}
}
