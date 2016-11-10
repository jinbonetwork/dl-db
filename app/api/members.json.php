<?php
$result = array(
	'error' => 0,
	'result' => array(
		'q' => $params['q'],
		'total_cnt' => @count($members)
	),
	'members' => $members
);
print json_encode($result);
?>
