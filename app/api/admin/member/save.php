<?php
namespace DLDB\App\api\admin\member;

$Acl = 'administrator';

class save extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';
		if($this->params['mode'] != 'add') {
			if(!$this->params['member']['id']) {
				\DLDB\RespondJson::ResultPage( array( -2, '회원번호를 입력하세요') );
			}
			if( is_array($this->params['member']['id']) ) {
				$members = \DLDB\Members\DBM::getMembers($this->params['member']['id']);
				if(!$members || count($members) < 1) {
					\DLDB\RespondJson::ResultPage( array( -2, '삭제할 아이디를 검색할 수 없습니다.') );
				}
			} else {
				$member = \DLDB\Members::get($this->params['member']['id']);
			}
			if(!$member && !$members) {
				\DLDB\RespondJson::ResultPage( array( -2, '존재하지 않는 회원입니다.') );
			}
			if($this->params['mode'] != 'delete') {
				if(!$this->params['member']['name']) {
					\DLDB\RespondJson::ResultPage( array( -3, '이름을 입력하세요.') );
				}
			}
		}
		switch($this->params['mode']) {
			case 'add':
				$ret = \DLDB\Members\DBM::insert($this->params['member']);
				if($ret < 0) {
					\DLDB\RespondJson::ResultPage( array( -4, \DLDB\Members\DBM::getErrorMsg() ) );
				}
				$this->params['member']['id'] = $ret;
				break;
			case 'modify':
				$ret = \DLDB\Members\DBM::modify($member,$this->params['member']);
				if($ret < 0) {
					\DLDB\RespondJson::ResultPage( array( -4, \DLDB\Members::getErrorMsg() ) );
				}
				break;
			case 'delete':
				if( is_array($this->params['member']['id']) && @count($members) > 0 ) {
					$ret = \DLDB\Members\DBM::deletes($members);
				} else {
					$ret = \DLDB\Members\DBM::delete($member);
				}
				break;
		}

		if($this->params['mode'] != 'delete') {
			$member = \DLDB\Members::get($this->params['member']['id']);
			if($member['uid']) {
				$member['role'] = \DLDB\Members\DBM::getRole($member['uid']);
			} else {
				$member['role'] = array();
			}
			$this->result = array(
				'error' => 0,
				'member' => $member
			);
		} else {
			$this->result = array(
				'error' => 0,
				'message' => '삭제되었습니다.'
			);
		}
	}
}
?>
