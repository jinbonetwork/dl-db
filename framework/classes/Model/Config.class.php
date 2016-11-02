<?php
namespace DLDB\Model;

final class Config extends \DLDB\Objects {
	public $database, $service, $session;

	public static function instance() {
		return self::_instance(__CLASS__);
	}

	protected function __construct() {
		$this->ConfigLoader();
	}

	private function ConfigLoader() {
		global $database, $service, $session;
		$this->settings = array();
		if(file_exists(DLDB_PATH."/config/settings.php")) {
			@include(DLDB_PATH."/config/settings.php");
			$this->userdatabase = $userdatabase;
			$this->database = $database;
			$this->service = $service;
			$this->timeline = $timeline;
			$this->session = $session;
		}
		$this->updateContext();
	}

	public function updateContext() {
		$context = \DLDB\Model\Context::instance();
		$configs = array('database','service','session');
		foreach($configs as $namespace) {
			if($namespace) {
				foreach($this->$namespace as $k => $v) {
					$context->setProperty($namespace.".".$k,$v);
				}
			}
		}
	}

	public function readResourceMap() {
		if(!$this->resoure_map) {
			$context = \DLDB\Model\Context::instance();
			$map_file = DLDB_PATH."/config/resources.map.json";
			if(file_exists($map_file)) {
				$fp = fopen($map_file,"r");
				$json = trim(fread($fp,filesize($map_file)));
				fclose($fp);
				$this->resource_map = json_decode($json,true);
			}
		}
		return $this->resource_map;
	}

	public function mergeMap($map_file, $uri="", $override=true) {
		if( file_exists($map_file) ) {
			$fp = fopen($map_file, "r");
			$maps = json_decode(trim(fread($fp,filesize($map_file))), true);
			fclose($fp);

			if($maps) {
				foreach( $maps as $k => $r ) {
					if( $uri ) {
						for( $i = 0; $i < @count($r['css']); $i++ ) {
							$r['css'][$i] = $uri."/".$r['css'][$i];
						}
						for( $i = 0; $i < @count($r['js']); $i++ ) {
							$r['js'][$i] = $uri."/".$r['js'][$i];
						}
					}
					if( $override == true ) {
						$this->resource_map[$k] = $r;
					} else {
						if(!$this->resource_map[$k]) $this->resource_map[$k] = $r;
					}
				}
			}
		}
	}
}
?>
