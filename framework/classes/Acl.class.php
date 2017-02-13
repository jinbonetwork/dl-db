<?php
namespace DLDB;
class Acl extends \DLDB\Objects {
	private $predefinedrole;
	private $acl;

	public static function instance() {
		return self::_instance(__CLASS__);
	}

	protected function __construct() {
		global $AclPreDefinedRole;

		$this->predefinedrole = $AclPreDefinedRole;
	}

	public function setAcl($Acl) {
		if( !isset( $this->acl ) ) {
			$this->getPrivilege();
		}
		if($Acl)
			$this->role = $this->predefinedrole[$Acl];
		else
			$this->role = BITWISE_ANONYMOUS;
	}

	public function getAcl() {
		return $this->acl;
	}

	public function check($output) {
		if($this->role == BITWISE_ANONYMOUS) {
			return true;
		}
		if($this->role < BITWISE_ANONYMOUS && !$_SESSION['user']['uid']) {
			\DLDB\Lib\importLibrary('auth');
			\DLDB\Lib\requireMembership($output);
		}
		if($this->role == BITWISE_AUTHENTICATED && !$_SESSION['user']['uid']) {
			\DLDB\Lib\Error('접근 권한이 없습니다.',$output);
			exit;
		} else if( $this->role < BITWISE_AUTHENTICATED && $_SESSION['user']['uid'] && !in_array( BITWISE_ADMINISTRATOR, $this->acl ) && !in_array( $this->role, $this->acl ) ) {
			\DLDB\Lib\Error('접근 권한이 없습니다.',$output);
			exit;
		}
	}

	function getPrivilege() {
		$context = \DLDB\Model\Context::instance();

		$domain = $context->getProperty('service.domain');
		$session_type = $context->getProperty('session.type');
		if($session_type == 'xe' && $_SESSION['member_srl'] && !$_SESSION['user']['uid']) {
			$_SESSION['user']['uid'] = $_SESSION['member_srl'];
		}
		if( !isset( $this->acl ) ) {
			if($_SESSION['user']['uid']) {
				$dbm = \DLDB\DBM::instance();
				$que = "SELECT * FROM {user_roles} WHERE `uid` = ".$_SESSION['user']['uid'];
				$row = $dbm->getFetchArray($que);
				$this->acl = unserialize($row['role']);
				$_SESSION['acl'][$domain] = $this->acl;
			}
		}
	}

	public function imMaster() {
		if( !is_array($this->acl) ) return 0;
		if( in_array( BITWISE_ADMINISTRATOR, $this->acl ) ) return 1;
		else return 0;
	}

	public function checkAcl($role) {
		$permission = false;
		if( in_array($role, $this->acl) )
			$permission = true;

		return $permission;
	}

	public function getIdentity($domain) {
		return $_SESSION['user']['uid'];
	}
}
?>
