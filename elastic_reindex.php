<?php
set_time_limit(0);

$shell_uid = getmyuid();
$posix_uid = posix_geteuid();
if($shell_uid != $posix_uid) {
	"파일 소유자만이 사용수 있습니다.";
	exit;
}

$reindex_mode = 'refresh';
if($argc > 1) {
	if($argv[1] == '--init')
		$reindex_mode = 'init';
	else if($argv[1] == '--continue') {
		$reindex_mode = 'continue';
		$start = $argv[2];
	}
}

define('__DLDB__',true);
if(!defined('ROOT'))
	define('ROOT',dirname(__FILE__));

/**
 * @brief 필요한 설정 파일들 include
 **/
require_once(ROOT.'/config/config.php');
ini_set('memory_limit','-1');
define('__DLDB_LOADED_CLASS__',true);

global $context, $config;
$config = \DLDB\Model\Config::instance();
$context = \DLDB\Model\Context::instance();
$uri = \DLDB\Model\URIHandler::instance();
$context->setProperty('uri',$uri);
$context->setProperty('service.base_uri',$uri->uri['root']);

try {
	if(!is_null($context->getProperty('database.DB'))) {
		$db = $context->getProperty('database.*');
		$dbm = \DLDB\DBM::instance();
		$dbm->bind($db,1);
		register_shutdown_function( array($dbm,'release') );
	}

	openlog("elastic_reindex", LOG_PID,LOG_LOCAL0);

	$index = $context->getProperty('service.elastic_index');

	$fields = \DLDB\Fields::getFields('documents');
	$cids = array();
	foreach($fields as $fid => $field) {
		if($field['type'] == 'taxonomy') {
			$cids[] = $field['cid'];
		}       
	}               
	$taxonomy = \DLDB\Taxonomy::getTaxonomy($cids);
	$taxonomy_terms = \DLDB\Taxonomy::getTaxonomyTerms($cids);

	$else = \DLDB\Search\Elastic::instance();
	$else->setFields( $fields, $taxonomy, $taxonomy_terms );

	if($reindex_mode == 'refresh' && $else->check()) {
		print "drop elastic index [".$index."]\n";
		syslog(LOG_INFO, "drop elastic index [".$index."]");
		$else->drop();
	}

	$types = array();
	foreach($taxonomy as $cid => $taxo) {
		if($taxo['skey'] && $taxo['active']) {
			if( is_array($taxonomy_terms[$cid]) ) {
				foreach( $taxonomy_terms[$cid] as $t => $terms) {
					$types[] = 't'.$t;
				}
			}
		}
	}
	if($reindex_mode != 'continue') {
		syslog(LOG_INFO, "create elastic index [".$index."]");
		print "create elastic index [".$index."]\n";
		$else->create($types);
	}

	$documents = \DLDB\Search\Documents::getAllList();
	if($documents) {
		foreach($documents as $document) {
			if($reindex_mode == 'continue' && $start && $document['id'] < $start) continue;
			print "insert document[".$document['id']."] into index [".$index."]\n";
			$else->update($document['id'],$document,$document['memo']);
		}
	}
	syslog(LOG_INFO, "update complete elastic index [".$index."]");
	closelog();

	$result = array(
		'error' => 0,
		'index' => $index,
		'types' => array_merge(array('main',$types)),
		'total_cnt' => @count($documents)
	);

	$dbm->release();

	print print_r($result);
} catch(Exception $e) {
	$logger = \DLDB\Logger::instance();
	$logger->Error($e,DLDB_ERROR_ACTION_AJAX);
}
?>
