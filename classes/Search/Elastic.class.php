<?php
namespace DLDB\Search;

class Elastic extends \DLDB\Objects {
	private static $fields;
	private static $cids;
	private static $taxonomy;
	private static $errmsg;
	private static $params;

	public static function instance() {
		return self::_instance(__CLASS__);
	}

	public static function setFields($fields,$taxonomy) {
		self::$fields = \DLDB\Fields::getFields('documents');

		foreach( self::$fields as $f => $field ) {
			if( $field['type'] == 'taxonomy' ) {
				self::$cids[] = $field['cid'];
			}
		}

		self::$taxonomy = $taxonomy;
	}

	public static function getList($q,$args=null,$order="score",$page=1,$limit=20) {
		require_once DLDB_CONTRIBUTE_PATH."/elasticsearch/vendor/autoload.php";

		$context = \DLDB\Model\Context::instance();
		$index = $context->getProperty('service.elastic_index');

		$taxonomy_exist = false;
		$types = array();
		if( $args ) {
			foreach( $args as $k => $v ) {
				$t = substr($k,0,1);
				$key = (int)substr($k,1);
				if($t == 'f') {
					switch( self::$fields[$key]['type'] ) {
						case 'taxonomy':
							if(!is_array($v)) $v = array($v);
							foreach($v as $_t) {
								$types[] = 't'.$t;
							}
							$taxonomy_exists = true;
						case 'date':
							$period = explode("-",$v);
							if($period[0]) {
								$filter[$k]['from'] = str_replace(".","-",$v);
							}
							if($period[1]) {
								$filter[$k]['to'] = str_replace(".","-",$v);
							}
							break;
						default:
							break;
					} /* end of switch */
				} /* end of if($t=='f') */
			} /* end of foreach */
		}
		if(!$taxonomy_exist) {
			$types = array('main');
		}

		$client = \Elasticsearch\ClientBuilder::create()->build();

		$q_params['must'] = [];
		$q_params['should'] = [];
		$q_params['must_not'] = [];

		foreach($q as $que) {
			switch($que['type']) {
				case 'string':
					if(preg_match("/^\"(.+)\"$/i",$que['que'])) {
						$q_params['must'][] = [
							"query_string" => [
								"default_field" => "_all",
								"query" => $que['que']
							]
						]; 
					} else {
						$q_params['should'][] = [
							"query_string" => [
								"default_field" => "_all",
								"query" => $que['que']
							]
						];
					}
					break;
				case 'and':
					$q_params['must'][] = [
						"match" => [
							"_all" => [
								"query" => implode(" ",$que['que']),
								"operator" => "and"
							]
						]
					];
					break;
				case 'not':
					$q_params['must'][] = [
						"query_string" => [
							"default_field" => "_all",
							"query" => $que['que'][0]
						]
					];
					for($i=1; $i<@count($que[$i]); $i++) {
						$q_params['must_not'][] = [
							"query_string" => [
								"default_field" => "_all",
								"query" => $_q
							]
						];
					}
					break;
				default:
					break;
			} /* end of switch */
		} /* end of foreach */

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
			$params['body']['sort'] = array(
				array (
					$order => array("order","desc")
				)
			);
		}
		if($filter) {
			$params['body']['filter'] = array(
				"and" => array(
					"filters" => array(
						array("range" => array())
					)
				)
			);
			foreach($filter as $fk => $_v) {
				$params['body']['filter']['and']['filters']['range'][$fk] = $_v;
			}
		}

		self::$params = $params;

		return $client->search($params);
	}

	public static function getParams() {
		return self::$params;
	}
}
?>
