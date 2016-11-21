<?php
$result = array(
	'error' => 0,
	'user' => $user_info,
	'role' => $role,
	'sessiontype' => $sessiontype
);
print json_encode($result);
?>
