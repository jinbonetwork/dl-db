<?php
$result = array(
	'error' => 0,
	'user' => $user_info,
	'role' => $role,
	'sessiontype' => $sessiontype,
	'menu' => $menu
);
print json_encode($result);
?>
