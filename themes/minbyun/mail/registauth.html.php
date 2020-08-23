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
			아래 <?php print ($link_title ? $link_title : '회원가입 인증하기'); ?> 링크를 클릭해주세요.<br>인증후 로그인 페이지로 이동한후 신청하신 아이디/비밀번호를 이용하여 로그인해주십니다.<br>회원님에게는 아직 쓰기 권한이 부여되지 않습니다. 쓰기 권한을 원하시면, 사이트에 있는 연락처로 연락주십시오.
		</p>
		<p style="margin-top: 15px; text-align: center; font-size: 1.0em;">
			회원정보 수정 메뉴를 통해 다시 수정하실 수 있습니다.
		</p>
<?php if($link) {?>
		<div style="text-align: center; padding-top: 15px; padding-bottom: 15px;">
			<a href="<?php print $link; ?>" target="_blank" style="display:inline-block; background-color: #989cff; border-radius: 3px; font-size: 1.0em; font-weight: bold; color: #fff; padding: 10px 15px; text-decoration: none;"><?php print ($link_title ? $link_title : "회원가입 인증하기"); ?></a>
		</div>
<?php }?>
