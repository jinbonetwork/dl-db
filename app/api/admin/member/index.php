<?php
namespace DLDB\App\api\admin\member;

$Acl = 'administrator';

class index extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';

		if(!$this->params['page']) $this->params['page'] = 1;
		if(!$this->params['limit']) $this->params['limit'] = 20;
		if(!$this->params['order']) $this->params['order'] = "asc";
		$total_cnt = \DLDB\Members\DBM::totalCnt($this->params['s_mode'],$this->params['s_args']);
		if($total_cnt) {
			$total_page = (int)( ($total_cnt - 1) / $this->params['limit'] ) + 1;
		}
		$members = \DLDB\Members\DBM::getList($this->params['page'],$this->params['limit'],$this->params['order'],$this->params['s_mode'],$this->params['s_args']);
		
		$this->result = array(
			'result' => array(
				's_mode' => $this->params['s_mode'],
				's_args' => $this->params['s_args'],
				'total_cnt' => $total_cnt,
				'total_page' => $total_page,
				'page' => $this->params['page'],
				'count' => @count($members)
			),
			'members' => $members
		);
	}
}
?>
