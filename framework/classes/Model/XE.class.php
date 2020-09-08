<?php
namespace DLDB\Model;

class XE extends \DLDB\Objects {
	private $prefix;

	public static function instance() {
		return self::_instance(__CLASS__);
	}

	function __construct() {
		$context = \DLDB\Model\Context::instance();
		$this->prefix = $context->getProperty('service.xe_prefix');
	}

	public function getAcl($domain) {
		if( $_SESSION['member_srl'] && ( !$_SESSION['user']['uid'] || ( $_SESSION['member_srl'] != $_SESSION['user']['uid'] ) ) ) {
			$dbm = \DLDB\DBM::instance();

			if($_SESSION['member_srl']) {
				$que = "SELECT * FROM `".$this->prefix."member` WHERE `member_srl` = ".$_SESSION['member_srl'];
				$row = $dbm->getFetchArray($que);
				if($row['member_srl']) {
					$_SESSION['user'] = array(
						'uid' => $row['member_srl']
					);
				}
			}
		}
	}

	public function getMember($member_srl) {
		$dbm = \DLDB\DBM::instance();

		$que = "SELECT * FROM `".$this->prefix."member` WHERE `member_srl` = ".$member_srl;
		$row = $dbm->getFetchArray($que);
		if($row['member_srl']) {
			$member = array(
				'uid' => $row['member_srl'],
				'user_id' => stripslashes($row['user_id']),
				'email' => stripslashes($row['email_address']),
				'user_name' => stripslashes($row['user_name']),
				'nick_name' => stripslashes($row['nick_name'])
			);
		}
		return $member;
	}

	public function getMenu() {
		$context = \DLDB\Model\Context::instance();
		$dbm = \DLDB\DBM::instance();

		$menu_srl = $context->getProperty('service.xe_menu_srl');

		$menu = array();
		$que = "SELECT * FROM `".$this->prefix."menu_item` WHERE menu_srl = ".$menu_srl." ORDER BY parent_srl ASC, listorder DESC";
		while($row = $dbm->getFetchArray($que)) {
			if($row['url'] == 'index') continue;
			if(!preg_match("/^http:\/\//i",$row['url'])) {
				$row['url'] = \DLDB\Lib\base_uri()."xe/".$row['url'];
			}
			if($row['parent_srl']) {
				$menu[$row['parent_srl']]['sub'][] = $row;
			} else {
				$row['sub'] = array();
				$menu[$row['menu_item_srl']] = $row;
			}
		}
		return $menu;
	}
}
?>
