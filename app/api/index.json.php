<?php
$result = array(
	'user' => $user_info,
	'role' => $role,
	'sessiontype' => $sessiontype
);
print json_encode($result);
?>
