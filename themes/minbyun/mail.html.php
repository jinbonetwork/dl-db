<h3 style="margin: 0; padding: 0.4em; border-bottom: 2px solid #989cff; background: #fff;">
	<a href="<?php print $base_url; ?>" target="_blank" style="text-decoration: none;"><img src="<?php print $base_url; ?>/themes/minbyun/images/logo.png" border="0" align="absmiddle"><span style="color: #989cff; font-weight: bold; padding-left: 8px; font-size: 15px; letter-spacing: -.025em;">민주사회를 위한 변호사모임</span></a>
</h3>
<div style="background: #f2f2f2; margin:0 auto; padding: 20px;">
	<div style="background: #fff; border-radius: 5px; padding: 20px;">
		<?php print $content; ?>
<?php if($link) {?>
		<div style="text-align: center; padding-top: 15px; padding-bottom: 15px;">
			<a href="<?php print $link; ?>" target="_blank"><?php print ($link_title ? $link_title : "바로기기"); ?></a>
		</div>
<?php }?>
	</div>
</div>
