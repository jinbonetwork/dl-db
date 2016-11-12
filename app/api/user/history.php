<?php
namespace DLDB\App\api\user;

$Acl = 'authenticated';

class history extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';

		switch( $this->params['mode'] ) {
			case 'add':
				if(!$this->params['q']) {
					\DLDB\RespondJson::ResultPage( array( -1, '검색어를 입력하세요') )
				}
				$hid = \DLDB\History::insert($this->user['uid'], $this->params['q'], $this->params['options'] );
				if( !$hid ) {
					\DLDB\RespondJson::ResultPage( array( -1, '검색기록을 저장할 수 없습니다') )
				}
				$this->result = array(
					'error' => 0,
					'message' => '검색기록을 저장했습니다',
					'hid' => $hid
				);
				break;
			case 'delete':
				if(!$this->params['hid']) {
					\DLDB\RespondJson::ResultPage( array( -1, '검색기록 번호를 입력하세요') )
				}
				if(!\DLDB\History::get($this->user['uid'], $this->params['hid'])) {
					\DLDB\RespondJson::ResultPage( array( -1, '존재하지 않거나 권한이 없는 검색기록입니다') )
				}
				\DLDB\History::delete($this->params['hid']);
				$this->result = array(
					'error' => 0,
					'hid' => $this->params['hid'],
					'message' => '검색기록에서 삭제되었습니다.'
				);
				break;
			default:
				if(!$this->params['page']) $this->params['page'] = 1;
				if(!$this->params['limit']) $this->params['limit'] = 20;

				if($this->params['hid']) {
					$this->history = \DLDB\History::get($this->user['uid'],$this->params['hid']);
					if(!$this->history) {
						$this->result = array('error' => -1, 'message' => '존재하지 않는 북마크입니다.');
					} else {
						$this->result = array('error' => 0, 'history' => $this->history);
					}
				} else {
					$this->total_cnt = \DLDB\History::totalCnt($this->user['uid']);
					if($this->total_cnt) {
						$this->total_page = (int)( ( $this->total_cnt - 1 ) / $this->params['limit'] ) + 1;
						$this->histories = \DLDB\History::getList( $this->user['uid'], $this->params['page'], $this->params['limit'] );
					} else {
						$this->total_page = 0;
						$this->histories = array();
					}
					$this->result = array(
						'error' => 0,
						'result' => array(
							'total_cnt' => $this->total_cnt,
							'total_page' => $this->total_page,
							'page' => $this->params['page'],
							'cnt' => @count( $this->histories )
						),
						'histories' => $this->histories
					);
				}
				break;
		}
	}
}
?>
