<?php
namespace DLDB\App\api\user;

$Acl = 'authenticated';

class profile extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';

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

		$this->profile = \DLDB\Member::getUser($this->user['uid']);
		$this->member = \DLDB\Members::getByUid($this->user['uid']);

		switch($this->params['mode']) {
			case 'modify':
				if(!$this->params['member']['name']) {
					\DLDB\RespondJson::ResultPage( array( -1, '이름을 입력하세요' ) );
				}
				if(!$this->params['member']['email']) {
					\DLDB\RespondJson::ResultPage( array( -2, '이메일을 입력하세요' ) );
				}
				if($this->params['member']['password']) {
					if(!$this->params['member']['password_confirm']) {
						\DLDB\RespondJson::ResultPage( array( -3, '비밀번호 확인을 입력하세요' ) );
					}
					if($this->params['member']['password'] != $this->params['member']['password_confirm']) {
						\DLDB\RespondJson::ResultPage( array( -3, '비밀번호가 서로 일치하지 않습니다.' ) );
					}
				}

				$ret = \DLDB\Members::modify($this->member,$this->params['member']);
				if($ret < 0) {
					\DLDB\RespondJson::ResultPage( array( -4, \DLDB\Members::getErrorMsg() ) );
				}
				$this->member = \DLDB\Members::getByUid($this->user['uid']);
				$this->profile = array_merge($this->profile,$this->member);
				break;
			default:
				if($this->member) {
					$this->profile = array_merge($this->profile,$this->member);
				}
				break;
		}
		$this->result = array(
			'error' => 0,
			'fields' => $this->fields,
			'taxonomy' => $this->taxonomy,
			'profile' => $this->profile
		);
	}
}
?>
