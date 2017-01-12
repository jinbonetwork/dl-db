<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width,user-scalable=0,initial-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
	<title><?php print $site_title; ?>: 관리페이지</title>
	<link rel="stylesheet" href="<?php print \DLDB\Lib\base_uri(); ?>contribute/fonts/NanumBarunGothic/nanumbarungothic.css" />
    <link rel="stylesheet" href="<?php print \DLDB\Lib\base_uri(); ?>contribute/fonts/pe-icon-7-stroke/css/pe-icon-7-stroke.css" />
    <link rel="stylesheet" href="<?php print \DLDB\Lib\base_uri(); ?>contribute/fonts/pe-icon-7-stroke/css/helper.css" />
    <link rel="stylesheet" href="<?php print \DLDB\Lib\base_uri(); ?>contribute/fonts/pe-icon-7-filled/css/pe-icon-7-filled.css" />
    <link rel="stylesheet" href="<?php print \DLDB\Lib\base_uri(); ?>contribute/fonts/pe-icon-7-filled/css/helper.css" />
<?php  print $this->header(); ?>

</head>
<body class="<?php print $breadcrumbs_class; ?>">
<?php print $content; ?>
<?php print $this->footer(); ?>
</body>
</html>
