<?php
namespace DLDB\App\api\user;

$Acl = 'anonymous';

class regist extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';

		if($this->user['uid']) {
			\DLDB\RespondJson::ResultPage( array( -1, '이미 로그인되어 있습니다. 로그아웃해주세요.' ) );
		}

		$fields = \DLDB\Fields::getFields('members');
		$this->fields = array();
		$cids = array();
		foreach($fields as $fid => $field) {
			if($field['type'] == 'taxonomy') {
				$cids[] = $field['cid'];
			}
			$this->fields[] = array(
				'fid' => $field['fid'],
				'parent' => $field['parent'],
				'idx' => $field['idx'],
				'slug' => $field['slug'],
				'subject' => $field['subject'],
				'type' => $field['type'],
				'multiple' => $field['multiple'],
				'required' => $field['required'],
				'cid' => $field['cid'],
				'system' => $field['system'],
				'form' => $field['form']
			);
		}
		$taxonomies = \DLDB\Taxonomy::getTaxonomy($cids);
		$cterms = \DLDB\Taxonomy::getTaxonomyTerms($cids);

		foreach($cterms as $cid => $terms) {
			if(!$this->taxonomy[$cid]) {
				$this->taxonomy[$cid] = array();
			}
			foreach($terms as $tid => $term) {
				$this->taxonomy[$cid][] = array(
					'tid' => $term['tid'],
					'cid' => $term['cid'],
					'parent' => $term['parent'],
					'idx' => $term['idx'],
					'nsubs' => $term['nsubs'],
					'name' => $term['name'],
					'slug' => $term['slug']
				);
			}
		}

		switch($this->params['mode']) {
			case 'check_dup':
				$m = \DLDB\Members\DBM::getMemberByEmail($this->params['email']);
				if($m['id']) {
					\DLDB\RespondJson::ResultPage( array( -3, '이미 회원가입된 이메일입니다.' ) );
				}
				break;
			case 'regist':
				if(!$this->params['member']['name']) {
					\DLDB\RespondJson::ResultPage( array( -2, '이름을 입력하세요' ) );
				}
				if(!$this->params['member']['email']) {
					\DLDB\RespondJson::ResultPage( array( -3, '이메일을 입력하세요' ) );
				}
				if(!$this->params['member']['password']) {
					\DLDB\RespondJson::ResultPage( array( -4, '비밀번호를 입력하세요' ) );
				}
				if(!$this->params['member']['password_confirm']) {
					\DLDB\RespondJson::ResultPage( array( -5, '비밀번호 확인을 입력하세요' ) );
				}
				if($this->params['member']['password'] != $this->params['member']['password_confirm']) {
					\DLDB\RespondJson::ResultPage( array( -5, '비밀번호가 서로 일치하지 않습니다.' ) );
				}
				//$this->params['member']['role'] = array(BITWISE_DOWNLOAD,BITWISE_VIEW);

				$auth = \DLDB\Members\DBM::getAuthKey();
				$this->params['member']['auth'] = $auth;
				$ret = \DLDB\Members::registAuth($this->params['member']);
				if($ret < 0) {
					\DLDB\RespondJson::ResultPage( array( $ret, \DLDB\Members::getErrorMsg() ) );
				}
				$context = \DLDB\Model\Context::instance();
				$domain = $context->getProperty('service.domain');
				$ssl = $context->getProperty('service.ssl');

				$args['site_title'] = ($site_title ? $site_title : $context->getProperty('service.title'));
				$args['subject'] = $args['site_title']." 회원가입 인증 안내";
				$args['name'] = $this->params['member']['name'];
				$args['user_id'] = $this->params['member']['email'];
				$args['password'] = $this->params['member']['password'];
				$args['link_title'] = '회원가입 인증하기';
				$args['link'] = 'http'.($ssl ? 's' : '')."://".$domain."/api/user/registAuth/?email=".$this->params['member']['email']."&auth_key=".$auth;
				$recievers = array();
				$recievers[] = array( 'email'=> $this->params['member']['email'], 'name'=> $this->params['member']['name'] );

				$result = \DLDB\Mailer::sendMail("registauth",$recievers,$args,0);

				if(!$result[0]) {
					\DLDB\RespondJson::ResultPage( array( -6, $result[1]) );
				} else {
					unset($this->params['member']['auth']);
					$this->result = array(
						'error' => 0,
						'message' => $this->params['member']['email'].'로 회원가입 인증 메일을 보냈습니다. 메일을 확인한 후, 링크를 따라 회원가입인증을 하신후, 로그인하시면 됩니다.',
						'member' => $this->params['member']
					);
				}
				break;
			default:
				$this->member = \DLDB\Members::memberfield();
				$this->member['role'] = array();
				$this->result = array(
					'error' => 0,
					'fields' => $this->fields,
					'taxonomy' => $this->taxonomy,
					'profile' => $this->member
				);
				break;
		}
	}
}
?>
