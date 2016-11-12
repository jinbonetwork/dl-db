<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width,user-scalable=0,initial-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
	<title>민변 디지털 도서관: <?php print $this->title; ?></title>
	<link rel="stylesheet" href="<?php print \DLDB\Lib\base_uri(); ?>themes/minbyun/contrib/NanumBarunGothic/nanumbarungothic.css" />
	<link rel="stylesheet" href="<?php print \DLDB\Lib\base_uri(); ?>themes/minbyun/contrib/pe-icon-7-stroke/css/pe-icon-7-stroke.css" />
<?php  print $this->header(); ?>

</head>
<body class="<?php print $breadcrumbs_class; ?>">
<?php print $content; ?>
<?php print $this->footer(); ?>
</body>
</html>
