<?php
namespace DLDB\App\login;

\DLDB\Lib\importLibrary('auth');

class index extends \DLDB\Controller {

	public function process() {
		$context = \DLDB\Model\Context::instance();

		switch($context->getProperty('session.type')) {
			case "gnu5":
				$this->params['login_uri'] = "gnu5/bbs/login_check.php";
				$this->params['login_args'] = array();
				$this->params['login_forms'] = array('mb_id','mb_password');
				$this->params['return_url'] = 'url';
				if($this->params['output'] != "json" && $this->params['output'] != "xml")
					\DLDB\Lib\importResource('app-gnu5-login',true);
				break;
			case "xe":
			default;
				$this->params['login_uri'] = "xe/";
				$this->params['login_args'] = array('query'=>array('act'=>'procMemberLogin'));
				$this->params['login_forms'] = array('user_id','password');
				$this->params['return_url'] = 'success_return_url';
				if($this->params['output'] != "json" && $this->params['output'] != "xml")
					\DLDB\Lib\importResource('app-xe-login',true);
				break;
		}

		if($this->params['request_URI'])
			$redirect_uri .= "?requestURI=".rawurldecode($this->params['request_URI']);

		if(\DLDB\Lib\doesHaveMembership()) {
			if($this->params['output'] == "xml") {
				Respond::ResultPage(array(2,"이미 로그인하셨습니다"));
			} else if($this->params['output'] == "json") {
				RespondJson::ResultPage(array(2,"이미 로그인하셨습니다"));
			} else { 
				Respond::ResultPage(array(-3, "이미 로그인하셨습니다."));
			}
		}
		$this->title = $context->getProperty('service.title')." 로그인";
	}
}
?>
