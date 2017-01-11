<?php
namespace DLDB\App\api\user;

$Acl = 'authenticated';

class bookmark extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';

		switch( $this->params['mode'] ) {
			case 'add':
				if(!$this->params['did']) {
					\DLDB\RespondJson::ResultPage( array( -1, '분서번호를 입력하세요') );
				}
				$bookmark = \DLDB\Bookmark::getByDID($this->user['uid'], $this->params['did']);
				if($bookmark) {
					\DLDB\RespondJson::ResultPage( array( -1, '이미 북마크된 문서입니다') );
				}
				$this->bid = \DLDB\Bookmark::insert($this->user['uid'], $this->params['did']);
				if(!$this->bid) {
					\DLDB\RespondJson::ResultPage( array( -1, '북마크 하는 도중 데이터베이스 장애가 발생했습니다') );
				}
				$this->result = array(
					'error' => 0,
					'message' => '북마크 되었습니다.',
					'bid' => $this->bid
				);
				break;
			case 'delete':
				if(!$this->params['bid']) {
					\DLDB\RespondJson::ResultPage( array( -1, '북마크번호를 입력하세요') );
				}
				\DLDB\Bookmark::delete($this->params['bid']);
				$this->result = array(
					'error' => 0,
					'bid' => $this->params['bid'],
					'message' => '북마크에서 삭제되었습니다.'
				);
				break;
			default:
				if(!$this->params['page']) $this->params['page'] = 1;
				if(!$this->params['limit']) $this->params['limit'] = 10;
				if($this->params['bid']) {
					$this->bookmark = \DLDB\Bookmark::get($this->user['uid'],$this->params['bid']);
					if(!$this->bookmark) {
						$this->result = array('error' => -1, 'message' => '존재하지 않는 북마크입니다.');
					} else {
						$this->result = array('error' => 0, 'bookmark' => $this->bookmark);
					}
				} else {
					$this->total_cnt = \DLDB\Bookmark::totalCnt($this->user['uid']);
					if($this->total_cnt) {
						$this->total_page = (int)( ( $this->total_cnt - 1 ) / $this->params['limit'] ) + 1;
						$this->bookmarks = \DLDB\Bookmark::getList( $this->user['uid'], $this->params['page'], $this->params['limit'] );
					} else {
						$this->total_page = 0;
						$this->bookmarks = array();
					}
					$this->result = array(
						'error' => 0,
						'result' => array(
							'total_cnt' => $this->total_cnt,
							'total_page' => $this->total_page,
							'page' => $this->params['page'],
							'cnt' => @count( $this->bookmarks )
						),
						'bookmarks' => $this->bookmarks
					);
				}
				break;
		}
	}
}
?>
