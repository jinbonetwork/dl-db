<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width,user-scalable=0,initial-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
	<title><?php print $this->site_title; ?>: <?php print $this->title; ?></title>
	<link rel="stylesheet" href="<?php print \DLDB\Lib\base_uri(); ?>themes/minbyun/contrib/NanumBarunGothic/nanumbarungothic.css" />
	<link rel="stylesheet" href="<?php print \DLDB\Lib\base_uri(); ?>themes/minbyun/contrib/pe-icon-7-stroke/css/pe-icon-7-stroke.css" />
	<link rel="stylesheet" href="<?php print \DLDB\Lib\base_uri(); ?>themes/minbyun/contrib/pe-icon-7-stroke/css/helper.css" />
	<link rel="stylesheet" href="<?php print \DLDB\Lib\base_uri(); ?>themes/minbyun/contrib/pe-icon-7-filled/css/pe-icon-7-filled.css" />
	<link rel="stylesheet" href="<?php print \DLDB\Lib\base_uri(); ?>themes/minbyun/contrib/pe-icon-7-filled/css/helper.css" />
<?php  print $this->header(); ?>

</head>
<body class="<?php print $breadcrumbs_class; ?>">
<?php print $content; ?>
<?php print $this->footer(); ?>
<script>
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

	ga('create', 'UA-101874411-1', 'auto');
	ga('send', 'pageview');

</script>
</body>
</html>
