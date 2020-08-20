		<p style="margin-bottom:15px; text-align: center;">
			<span style="font-weight:bold; font-size:1.0em;"><?php print $name; ?></span>님 '<?php print $site_title; ?>' 임시 비밀번호가 발급되었습니다.
		</p>
		<table style="background: #e4eaff; margin: 0 auto; border: 1px solid #fff; border-radius: 3px; font-size: 1.0em;" cellpadding="0" cellspacing="0">
			<tbody>
				<tr>
					<td style="border-bottom: 1px solid #fff; border-right: 1px solid #fff; padding:10px 20px;">접속 아이디: </td>
					<td style="border-bottom: 1px solid #fff; padding:10px 20px;"><?php print $user_id; ?></td>
				</tr>
				<tr>
					<td style="border-bottom: 1px solid #fff; border-right: 1px solid #fff; padding:10px 20px;">접속 임시 비밀번호: </td>
					<td style="border-bottom: 1px solid #fff; padding:10px 20px;"><?php print $password; ?></td>
				</tr>
			</tbody>
		</table>
		<p style="margin-top: 15px; text-align: center; font-size: 1.0em;">
			비밀번호 임시 변경 인증을 하지 않으시면, 비밀번호는 원래대로 유지됩니다.
		</p>
		<p style="margin-top: 15px; text-align: center; font-size: 1.0em;">
			아래 '로그인하러 가기' 링크를 클릭해주세요.<br>임시발급 인증을 위한 사이트로 이동해 인증을 완료하시면,<br>임시로 발급된 비밀번호로 변경됩니다.<br>인증후 로그인 페이지로 이동한후 임시로 발급된 비밀번호를 이용하여 로그인해주십니다.
		</p>
		<p style="margin-top: 15px; text-align: center; font-size: 1.0em;">
			회원정보 수정 메뉴를 통해 원하시는 비밀번호로 다시 수정하실 수 있습니다.
		</p>
<?php if($link) {?>
		<div style="text-align: center; padding-top: 15px; padding-bottom: 15px;">
			<a href="<?php print $link; ?>" target="_blank" style="display:inline-block; background-color: #989cff; border-radius: 3px; font-size: 1.0em; font-weight: bold; color: #fff; padding: 10px 15px; text-decoration: none;"><?php print ($link_title ? $link_title : "바로기기"); ?></a>
		</div>
<?php }?>
