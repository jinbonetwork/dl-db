<?php
switch($type) {
	case 401:
		$error_class = "UNAUTHORIZED";
		break;
	case 403:
		$error_class = "ACCESS_DENIED";
		break;
	case 404:
		$error_class = "PAGE_NOT_FOUND";
		break;
	case 423:
		$error_class = "PAGE_LOCKED";
		break;
	case 503:
		$error_class = "SERVICE_UNAVAIL";
		break;
	case 505:
	default:
		$error_class = "SYSTEM_ERROR";
		break;
}
?>
<div class="error <?php print $error_class; ?>" style="width:100%; height:100%; vertical-align:middle; text-align:center;">
	<div style="display:inline-block; margin-top:35px; max-width:600px;">
		<div style="border:2px solid #f00; border-radius: 10px;">
			<div style="padding:20px;">
				<div style="text-align:justify;font-size:1.2em;">
					<p><?php print $message; ?></p>
				</div>
			</div>
		</div>
	</div>
</div>
