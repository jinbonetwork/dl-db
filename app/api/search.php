<?php
namespace DLDB\app\api;

$Acl = 'view';

class search extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';

		if(!$this->params['q']) {
			\DLDB\RepondJson::ResultPage( array(-1,'검색어를 입력하세요') );
		}
		$this->que = \DLDB\Search\ParseQue::parse($this->params['q']);

		$context = \DLDB\Model\Context::instance();

		$this->fields = \DLDB\Fields::getFields('documents');
		$this->ofields = array();
		foreach($this->fields as $fid => $field) {
			if($field['type'] == 'taxonomy') {
				$cids[] = $field['cid'];
			}
			$this->ofields[] = array(
				'fid' => $field['fid'],
				'parent' => $field['parent'],
				'idx' => $field['idx'],
				'subject' => $field['subject'],
				'type' => $field['type'],
				'multiple' => $field['multiple'],
				'required' => $field['required'],
				'cid' => $field['cid'],
				'form' => $field['form'],
				'sefield' => $field['sefield'],
			);
		}
		if($cids && is_array($cids) ) {
			$this->taxonomies = \DLDB\Taxonomy::getTaxonomy($cids);
			$this->taxonomy = \DLDB\Taxonomy::getTaxonomyTerms($cids);
		}

		if(!$this->params['page']) $this->params['page'] = 1;
		if(!$this->params['limit']) $this->params['limit'] = 20;
		if(!$this->params['order']) $this->params['order'] = 'score';

		switch($context->getProperty('service.search_type')) {
			case 'db':
				$this->do_dbm_search();
				break;
			case 'elastic':
				$this->do_elastic_search();
				break;
			case 'solr':
				$this->do_solr_search();
				break;
		}

		if( $this->total_cnt ) {
			$this->search_history();
			$this->result['query_hash'] = $this->query_hash;
		}
	}
	
	function do_dbm_search() {
		\DLDB\Search\DBM::setFields($this->fields,$this->taxonomies,$this->taxonomy);
		$this->total_cnt = \DLDB\Search\DBM::totalCnt($this->que, $this->params);
		if($this->total_cnt) {
			$this->total_page = (int)( ( $this->total_cnt - 1 ) / $this->params['limit'] ) + 1;
			$this->taxonomy_cnt = \DLDB\Search\DBM::taxonomyCnt($this->que, $this->params);
		} else {
			$this->total_page = 0;
		}
		$this->documents = \DLDB\Search\DBM::getList($this->que, $this->params, $this->params['order'], $this->params['page'], $this->params['limit']);
		$this->query = \DLDB\Search\DBM::getQue();
		$this->result = array(
			'error' => 0,
			'result' => array(
				'total_cnt' => $this->total_cnt,
				'taxonomy_cnt' => $this->taxonomy_cnt,
				'total_page' => $this->total_page,
				'page' => $this->params['page'],
				'cnt' => @count($this->documents)
			),
			'fields' => $this->ofields,
			'query' => $this->query,
			'documents' => $this->documents
		);
	}

	function do_elastic_search() {
		$else = \DLDB\Search\Elastic::instance();
		$else->setFields($this->fields,$this->taxonomies,$this->taxonomy);
		$this->documents = $else->getList($this->que, $this->params, $this->params['order'], $this->params['page'], $this->params['limit']);
		$this->total_cnt = ( $this->documents['hits']['total'] ? $this->documents['hits']['total'] : 0 );
		if($this->total_cnt) {
			$this->total_page = (int)( ( $this->total_cnt - 1 ) / $this->params['limit'] ) + 1;
			$this->taxonomy_cnt = $else->taxonomyCnt($this->que,$this->params);
		} else {
			$this->total_page = 0;
		}
		$this->query = $else->getParams();
		$this->result = array(
			'error' => 0,
			'result' => array(
				'total_cnt' => $this->total_cnt,
				'taxonomy_cnt' => $this->taxonomy_cnt,
				'total_page' => $this->total_page,
				'page' => $this->params['page'],
				'cnt' => @count($this->documents['hits']['hits'])
			),
			'fields'=>$this->ofields,
			'query' => $this->query,
			'documents' => $this->documents['hits']['hits']
		);
	}
/*	function do_elastic_search() {
		require_once DLDB_CONTRIBUTE_PATH."/elasticsearch/vendor/autoload.php";
		$client = \Elasticsearch\ClientBuilder::create()->build();

		$params = [
			'index' => 'dldb1',
			'type' => 'main',
			'body' => [
				'query' => [
					"bool" => [
						"should" => [
							[
								"match" => [ "subject" => $this->params['q'] ]
							],
							[
								"match" => [ "content" => $this->params['q'] ]
							],
							[
								"match" => [ "memo" => $this->params['q'] ]
							],
							[
								"match" => [ "f13" => $this->params['q'] ]
							]
						]
					]
				]
			]
		];

		$this->result = $client->search($params);
	} */

	function do_solr_search() {
		$this->result = array(
			'error' => 0,
			'message' => '준비중입니다.'
		);
	}

	function search_history() {
		$query_string = \DLDB\History::getQuery();
		$this->query_hash = \DLDB\History::getQueryHash($query_string);
		$last = \DLDB\History::getLast($this->user['uid']);
		if($last['hash'] == $this->query_hash) {
			return;
		}
		$options = array();
		foreach($this->params as $k => $v) {
			if( substr($k,0,1) == 'f' ) {
				$key = (int)substr($k,1);
				if($v) {
					switch( $this->fields[$key]['type'] ) {
						case 'taxonomy':
							if(!is_array($v)) {
								$v = array($v);
							}
							$c = 0;
							foreach($v as $t) {
								$options[$k] .= ($c++ ? "," : "").$this->taxonomy[$this->fields[$key]['cid']][$t]['name'];
							}
							break;
						case 'date':
							$_date = explode("-",$v);
							$options[$k]['from'] = $_date[0];
							$options[$k]['to'] = $_date[1];
							break;
					}
				}
			}
		}
		\DLDB\History::insert($this->user['uid'],$this->params['q'],$options,$query_string);
	}
}
?>
