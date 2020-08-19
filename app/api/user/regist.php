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
				$this->params['member']['role'] = array(BITWISE_WRITE,BITWISE_DOWNLOAD,BITWISE_VIEW);

				$ret = \DLDB\Members\DBM::insert($this->params['member']);
				if($ret < 0) {
					\DLDB\RespondJson::ResultPage( array( -6, \DLDB\Members::getErrorMsg() ) );
				}
				$this->result = array(
					'error' => 0,
					'member' => $this->member
				);
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
