		<p style="margin-bottom:15px; text-align: center;">
			<span style="font-weight:bold; font-size:1.0em;"><?php print $name; ?></span>님 '<?php print $site_title; ?>' 서비스를 이용하실 수 있는 아이디가 발급되었습니다.
		</p>
		<table style="background: #e4eaff; margin: 0 auto; border: 1px solid #fff; border-radius: 3px; font-size: 1.0em;" cellpadding="0" cellspacing="0">
			<tbody>
				<tr>
					<td style="border-bottom: 1px solid #fff; border-right: 1px solid #fff; padding:10px 20px;">접속 아이디: </td>
					<td style="border-bottom: 1px solid #fff; padding:10px 20px;"><?php print $user_id; ?></td>
				</tr>
				<tr>
					<td style="border-bottom: 1px solid #fff; border-right: 1px solid #fff; padding:10px 20px;">접속 비밀번호: </td>
					<td style="border-bottom: 1px solid #fff; padding:10px 20px;"><?php print $password; ?></td>
				</tr>
			</tbody>
		</table>
		<p style="margin-top: 15px; text-align: center; font-size: 1.0em;">
			사이트에 접속하셔서, 원하시는 비밀번호로 재설정해주세요.
		</p>
<?php if($link) {?>
		<div style="text-align: center; padding-top: 15px; padding-bottom: 15px;">
			<a href="<?php print $link; ?>" target="_blank" style="display:inline-block; background-color: #989cff; border-radius: 3px; font-size: 1.0em; font-weight: bold; color: #fff; padding: 10px 15px; text-decoration: none;"><?php print ($link_title ? $link_title : "바로기기"); ?></a>
		</div>
<?php }?>
