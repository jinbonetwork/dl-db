<?php
namespace DLDB\App\api\file;

$Acl = 'write';

class parsing_state extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';

		if(!$this->params['id'] && !$this->params['fid']) {
			\DLDB\RespondJson::ResultPage( array( -1, '문서번호나 파일번호를 입력하세요') );
		}
		if($this->params['id']) {
			$_files = \DLDB\Files::getListParseStatus($this->params['id']);
			if( is_array($_files) ) {
				foreach($_files as $_file) {
					$files[$_file['fid']] = $_file;
				}
			}
			if( !$files || @count($files) < 1 ) {
				\DLDB\RespondJson::ResultPage( array( -2, '첨부파일목록을 검색할 수 없습니다.') );
			} else {
				$this->result = array(
					'error' => 0,
					'files' => $files
				);
			}
		} else if($this->params['fid']) {
			$file = \DLDB\Files::getFileParseStatus($this->params['fid']);
			if( !$file ) {
				\DLDB\RespondJson::ResultPage( array( -2, '첨부파일정보를 검색할 수 없습니다.') );
			} else {
				$this->result = array(
					'error' => 0,
					'file' => $file
				);
			}
		}
	}
}
?>
