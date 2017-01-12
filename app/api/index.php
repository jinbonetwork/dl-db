<?php
namespace DLDB\App\api;

$Acl = "anonymous";

class index extends \DLDB\Controller {
	public function process() {
		global $AclPreDefinedRole;
		$this->params['output'] = 'json';
		$context = \DLDB\Model\Context::instance();

		$this->user_info = \DLDB\Member::getUser($_SESSION['user']['uid']);
		$member = \DLDB\Members::getByUid($_SESSION['user']['uid']);
		$this->agreement = $member['license'];
		$acl = \DLDB\Acl::instance();
		$this->role = $acl->getAcl();
		$this->roles = array();
		foreach($AclPreDefinedRole as $name => $bitwise) {
			$this->roles[$bitwise] = $name;
		}
		$this->sessiontype = $context->getProperty('session.type');
		$this->menu = \DLDB\Menu::getMenu();
	}
}
?>
