<?php
namespace DLDB\app\api;

$Acl = 'view';

class search extends \DLDB\Controller {
	public function process() {
		$this->params['output'] = 'json';

		if(!$this->params['q']) {
			\DLDB\RepondJson::ResultPage( array(-1,'검색어를 입력하세요') );
		}

		$context = \DLDB\Model\Context::instance();

		$this->fields = \DLDB\Fields::getFields('documents');
		$this->ofields = array();
		foreach($this->fields as $fid => $field) {
			$this->ofields[] = array(
				'fid' => $field['fid'],
				'parent' => $field['parent'],
				'idx' => $field['idx'],
				'subject' => $field['subject'],
				'type' => $field['type'],
				'multiple' => $field['multiple'],
				'required' => $field['required'],
				'cid' => $field['cid'],
				'form' => $field['form']
			);
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
	}
	
	function do_dbm_search() {
	}

	function do_elastic_search() {
		require_once DLDB_CONTRIBUTE_PATH."/elasticsearch/vendor/autoload.php";
		$client = \Elasticsearch\ClientBuilder::create()->build();

		$params = [
		    'index' => 'dldb',
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
							]
						]
					]
        		]
    		]
		];

		$this->results = $client->search($params);
	}

	function do_solr_search() {
	}
}
?>
