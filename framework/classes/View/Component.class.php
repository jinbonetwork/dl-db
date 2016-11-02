<?php
namespace DLDB\View;

class Component extends \DLDB\Objects {
	public static function instance() {
		return self::_instance(__CLASS__);
	}

	function __construct() {
	}

	public static function getComponent($component,$args) {
		@extract($args);
		$component_path = DLDB_PATH."/component/".$component.".html.php";
		if(file_exists($component_path)) {
			include $component_path;
		}
	}
}
?>
