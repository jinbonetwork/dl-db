		<p style="margin-bottom:15px; text-align: center;">
			<span style="font-weight:bold; font-size:1.0em;"><?php print $name; ?></span>님 '<?php print $site_title; ?>' 회원가입 인증메일입니다.
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
			아래 <?php print ($link_title ? $link_title : '회원가입 인증하기'); ?> 링크를 클릭해주세요.<br>인증후 로그인 페이지로 이동한후 신청하신 아이디/비밀번호를 이용하여 로그인해주십니다.
		</p>
		<p style="margin-top: 15px; text-align: center; font-size: 1.0em;">
			회원님에게는 아직 어떤 권한도 부여되지 있지 않아 정상적인 이용은 아직 안되십니다. <?php print $site_title; ?>는 민변회원들을 위한 사이트입니다.<br>운영자가 민변 회원임을 확인한후, 적절한 권한을 부여하면, 안내메일이 발송됩니다. 이용자님께서는 그 이후 정상적으로 사용가능하십니다.<br>빠른 이용권한을 원하시면, 사이트에 있는 연락처로 연락주십시오.
		</p>
		<p style="margin-top: 15px; text-align: center; font-size: 1.0em;">
			회원정보 수정 메뉴를 통해 다시 수정하실 수 있습니다.
		</p>
<?php if($link) {?>
		<div style="text-align: center; padding-top: 15px; padding-bottom: 15px;">
			<a href="<?php print $link; ?>" target="_blank" style="display:inline-block; background-color: #989cff; border-radius: 3px; font-size: 1.0em; font-weight: bold; color: #fff; padding: 10px 15px; text-decoration: none;"><?php print ($link_title ? $link_title : "회원가입 인증하기"); ?></a>
		</div>
<?php }?>
