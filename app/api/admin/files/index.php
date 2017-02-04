<?php
namespace DLDB\App\api\admin\files;

$Acl = 'administrator';

class index extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';
		if(!$this->params['page']) $this->params['page'] = 1;
		if(!$this->params['limit']) $this->params['limit'] = 20;
		if(!$this->params['order']) $this->params['order'] = "desc";
		if($this->params['fid']) {
			$file = \DLDB\Files::getFile($this->params['fid']);
			if(!$file) {
				$this->result = array(
					'error' => -1,
					'message' => '존재하지 않는 파일입니다.'
				);
			} else {
				unset($file['text']);
				$this->result = array(
					'error' => 0,
					'result' => array(
						'fid' => $this->params['fid'],
						'page' => $this->params['page']
					),
					'file' => $file
				);
			}
		} else {
			$total_cnt = \DLDB\Files\DBM::totalFileCnt($this->params['s_mode'],$this->params['s_args']);
			if($total_cnt) {
				$total_page = (int)( ($total_cnt - 1) / $this->params['limit'] ) + 1;
			}
			$files = \DLDB\Files\DBM::getFiles($this->params['page'],$this->params['limit'],$this->params['order'],$this->params['s_mode'],$this->params['s_args']);

			$this->result = array(
				'error' => 0,
				'result' => array(
					's_mode' => $this->params['s_mode'],
					's_args' => $this->params['s_args'],
					'total_cnt' => $total_cnt,
					'total_page' => $total_page,
					'page' => $this->params['page'],
					'count' => @count($files)
				),
				'files' => $files
			);
		}
	}
}
?>
