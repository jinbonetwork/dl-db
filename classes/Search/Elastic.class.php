<?php
namespace DLDB\Search;

class Elastic extends \DLDB\Objects {
	private $fields;
	private $cids;
	private $taxonomy;
	private $errmsg;
	private $params;
	private $client;

	public static function instance() {
		return self::_instance(__CLASS__);
	}

	protected function __construct() {
		require_once DLDB_CONTRIBUTE_PATH."/elasticsearch/vendor/autoload.php";

		$this->client = \Elasticsearch\ClientBuilder::create()->build();
	}

	public function setFields($fields=null,$taxonomy=null,$taxonomy_terms=null) {
		$this->fields = $fields;
		if(!$this->fields) {
			$this->fields = \DLDB\Fields::getFields('documents');
		}

		foreach( $this->fields as $f => $field ) {
			if( $field['type'] == 'taxonomy' ) {
				$this->cids[] = $field['cid'];
			}
		}

		$this->taxonomy = $taxonomy;
		if(!$this->taxonomy) {
			$this->taxonomy = \DLDB\Taxonomy::getTaxonomy($this->cids);
		}

		$this->taxonomy_terms = $taxonomy_terms;
		if(!$this->taxonomy_terms) {
			$this->taxonomy_terms = \DLDB\Taxonomy::getTaxonomyTerms($this->cids);
		}
	}

	public function taxonomyCnt($q,$args) {
		$context = \DLDB\Model\Context::instance();
		$index = $context->getProperty('service.elastic_index');

		list($types, $q_params, $f_params) = $this->makeParams($q,$args);

		foreach($this->taxonomy as $cid => $taxo) {
			if( $taxo['skey'] ) {
				foreach($this->taxonomy_terms[$cid] as $tid => $term) {

					$params = array(
						'index' => $index,
						'type' => 't'.$tid,
						'body' => array(
							'query' => array(
								"bool" => $q_params
							)
						)
					);
					$response = $this->client->count($params);
					$taxonomy_cnt[$tid] = $response['count'];
				}
			}
		}
		return $taxonomy_cnt;
	}

	public function getList($q,$args=null,$order="score",$page=1,$limit=20) {
		$context = \DLDB\Model\Context::instance();
		$index = $context->getProperty('service.elastic_index');

		list($types, $q_params, $f_params) = $this->makeParams($q,$args);

		$params = array(
			'index' => $index,
			'type' => implode(',',$types),
			'body' => array(
				'query' => array(
					"bool" => $q_params
				),
				'from' => ( ( $page - 1 ) * $limit ),
				'size' => $limit
			)
		);
		if($order != 'score') {
			$params['body']['sort'] = array (
				$order => array("order" => "desc")
			);
		}
		if($f_params) {
			$params['body']['filter'] = $f_params;
		}

		$this->params = $params;

		return $this->client->search($params);
	}

	public function makeParams($q,$args=null) {
		$taxonomy_exist = false;
		$types = array();
		if( $args ) {
			foreach( $args as $k => $v ) {
				$t = substr($k,0,1);
				$key = (int)substr($k,1);
				if($t == 'f') {
					switch( $this->fields[$key]['type'] ) {
						case 'taxonomy':
							if( $this->taxonomy[$this->fields[$key]['cid']]['skey'] ) {
								if(!is_array($v)) $v = array($v);
								foreach($v as $_t) {
									$types[] = 't'.$_t;
								}
								$taxonomy_exists = true;
							}
							break;
						case 'date':
							$period = preg_split("/-/i",$v);
							if($period[0]) {
								$filter[$k]['from'] = str_replace(".","-",$period[0]);
							}
							if($period[1]) {
								$filter[$k]['to'] = str_replace(".","-",$period[1]);
							}
							break;
						default:
							break;
					} /* end of switch */
				} /* end of if($t=='f') */
			} /* end of foreach */
		}
		if(!$taxonomy_exists) {
			$types = array('main');
		}

		$q_params['must'] = [];
		$q_params['should'] = [];
		$q_params['must_not'] = [];

		$multi_field = array("subject","content","memo");
		foreach($this->fields as $fid => $field) {
			if($field['sefield'] && $field['type'] != 'date') {
				$multi_field[] = "f".$fid;
			}
		}

		foreach($q as $type => $que) {
			if($que) {
				switch($type) {
					case 'string':
						$q_params['must'][] = array(
							"multi_match" => array(
								"query" => $que,
								"fields" => $multi_field,
								'type' => 'phrase'
							)
						);
						break;
					case 'or':
						$q_params['should'][] = array(
							"multi_match" => array(
								"query" => implode(" ", $que),
								"fields" => $multi_field
							)
						);
						break;
					case 'and':
						$q_params['must'][] = array(
							"multi_match" => array(
								"query" => implode(" ",$que),
								"operator" => "and",
								"fields" => $multi_field
							)
						);
						break;
					case 'not':
						$q_params['must_not'][] = array(
							"multi_match" => array(
								"query" => implode(" ", $que),
								"fields" => $multi_field
							)
						);
						break;
					default:
						break;
				} /* end of switch */
			} /* end of que */
		} /* end of foreach */

		if($filter) {
			$f_params = array(
				"and" => array(
					"filters" => array(
						array("range" => array())
					)
				)
			);
			foreach($filter as $fk => $_v) {
				$f_params['and']['filters'][0]['range'][$fk] = $_v;
			}
		}

		return array(
			$types,
			$q_params,
			$f_params
		);
	}

	public function create($types) {
		$context = \DLDB\Model\Context::instance();

		$index = $context->getProperty('service.elastic_index');
		$shards = $context->getProperty('service.elastic_shards');
		$replicas = $context->getProperty('service.elastic_replicas');
		$analyzer = $context->getProperty('service.elastic_analyzer');
		$tokenizer = $context->getProperty('service.elastic_tokenizer');

		$this->setFields();

		$default_properties = array(
			'subject' => array(
				'type' => 'string',
				'analyzer' => 'korean',
				'term_vector' => 'yes'
			),
			'content' => array(
				'type' => 'string',
				'analyzer' => 'korean',
				'term_vector' => 'yes'
			),
			'memo' => array(
				'type' => 'string',
				'analyzer' => 'korean',
				'term_vector' => 'yes'
			)
		);
		foreach( $this->fields as $fid => $field ) {
			if($field['sefield']) {
				switch($field['type']) {
					case 'int':
						$property_type = 'numeric';
						break;
					default:
						$property_type = 'string';
						break;
				}
				if( $field['type'] != 'date') {
					$default_properties['f'.$fid] = array(
						'type' => $property_type,
						'analyzer' => 'korean',
						'term_vector' => 'yes'
					);
				} else {
					$default_properties['f'.$fid] = array(
						'type' => $property_type,
						'index' => 'not_analyzed'
					);
				}
			}
		}
	
		$params = array(
		    'index' => $index,
			'body' => array(
				'settings' => array(
					'number_of_shards' => $shards,
					'number_of_replicas' => $replicas,
					'analysis' => array(
						'analyzer' => array(
							'korean' => array(
								'type' => 'custom',
								'tokenizer' => $analyzer
							)
						),
						'tokenizer' => array(
							$analyzer => array(
								'type' => $tokenizer,
								"pos_tagging" => false
							)
						)
					)
				),
				'mappings' => array(
					'main' => array(
						'properties' => $default_properties
					)
				)
			)
		);

		if( is_array($types) ) {
			foreach( $types as $type ) {
				$params['body']['mappings'][$type] = array( 'properties' => $default_properties );
			}
		}

		$this->client->indices()->create($params);
	}

	public function drop() {
		$context = \DLDB\Model\Context::instance();
		$index = $context->getProperty('service.elastic_index');

		$params = array('index' => $index);
		$response = $this->client->indices()->delete($params);
	}

	public function check($type=null) {
		$context = \DLDB\Model\Context::instance();
		$index = $context->getProperty('service.elastic_index');

		if($type) {
			$params = array(
				'index' => $index,
				'type' => $type
			);
		} else {
			$params = array(
				'index' => $index
			);
		}

		$response = $this->client->indices()->getMapping($params);
		if(!$response[$index]) {
			return false;
		}
		return true;
	}

	public function update($id,$args,$memo,$mode='index') {
		$context = \DLDB\Model\Context::instance();
		$index = $context->getProperty('service.elastic_index');

		$doc['subject'] = $args['subject'];
		$doc['content'] = $args['content'];
		$doc['memo'] = $memo;

		$fieldquery = \DLDB\FieldsQuery::instance();
		$types = array();
		foreach( $this->fields as $fid => $field ) {
			if( $field['type'] == 'taxonomy' && $this->taxonomy[$field['cid']]['skey'] ) {
				if( $args['f'.$fid] ) {
					if( !is_array( $args['f'.$fid] ) ) {
						$v = array( $args['f'.$fid] );
					} else {
						$v = $args['f'.$fid];
					}
					foreach($v as $t => $vv) {
						if( is_array($vv) ) {
							$types[] = 't'.$t;
						} else {
							$types[] = 't'.$vv;
						}
					}
				}
			}
			if( $field['sefield'] ) {
				switch( $field['type'] ) {
					case 'taxonomy':
						if( !is_array( $args['f'.$fid] ) ) {
							$v = array( $args['f'.$fid] );
						} else {
							$v = $args['f'.$fid];
						}
						$c = 0;
						foreach($v as $t => $vv) {
							if(is_array($vv)) {
								if($this->taxonomy_terms[$field['cid']][$t]) {
									$doc['f'.$fid] .= ($c++ ? "," : "").$this->taxonomy_terms[$field['cid']][$t]['name'];
								}
							} else {
								if($this->taxonomy_terms[$field['cid']][$vv]) {
									$doc['f'.$fid] .= ($c++ ? "," : "").$this->taxonomy_terms[$field['cid']][$vv]['name'];
								}
							}
						}
						break;
					case 'date':
						if( is_array( $args['f'.$fid] ) ) {
							$doc['f'.$fid] = $fieldquery->buildDate( $field, $args['f'.$fid] );
						} else {
							$doc['f'.$fid] = $args['f'.$fid];
						}
						break;
					default:
						$doc['f'.$fid] = $args['f'.$fid];
						break;
				}
			}
		}
		if($mode == 'index') {
			$params = array(
				'index' => $index,
				'type' => 'main',
				'id' => $id,
				'body' => $doc
			);
		} else {
			$params = array(
				'index' => $index,
				'type' => 'main',
				'id' => $id,
				'body' => array(
					'doc' => $doc
				)
			);
		}
		if($mode == 'index')
			$response = $this->client->index($params);
		else
			$response = $this->client->update($params);

		if( is_array( $types ) ) {
			foreach( $types as $type ) {
				if($mode == 'index') {
					$params = array(
						'index' => $index,
						'type' => $type,
						'id' => $id,
						'body' => $doc
					);
				} else {
					$params = array(
						'index' => $index,
						'type' => $type,
						'id' => $id,
						'body' => array(
							'doc' => $doc
						)
					);
				}
				if($mode == 'index')
					$response = $this->client->index($params);
				else
					$response = $this->client->update($params);
			}
		}
	}

	public function remove($id,$type) {
		$context = \DLDB\Model\Context::instance();
		$index = $context->getProperty('service.elastic_index');

		$params = array(
			'index' => $index,
			'type' => $type,
			'id' => $id
		);
		$response = $this->client->delete($params);
	}

	public function getParams() {
		return $this->params;
	}
}
?>
