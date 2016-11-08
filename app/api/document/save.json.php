<?php
$result = array(
	'error' => 0,
	'message' => '완료되었습니다.',
	'did' => $did,
	'document' => $document
);
print json_encode($result);
?>
