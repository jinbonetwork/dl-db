<?php
$result = array(
	'error' => 0,
	'user' => $user_info,
	'agreement' => $agreement,
	'role' => $role,
	'roles' => $roles,
	'sessiontype' => $sessiontype,
	'menu' => $menu
);
print json_encode($result);
?>
