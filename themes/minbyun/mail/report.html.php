		<p style="margin-bottom:15px; text-align: center;">
			<span style="font-weight:bold; font-size:1.0em;"><?php print $reporter_name; ?></span>님이 '<?php print $site_title; ?>' 에 신고내용을 접수하셨습니다.
		</p>
		<table style="background: #e4eaff; margin: 0 auto; border: 1px solid #fff; border-radius: 3px; font-size: 1.0em;" cellpadding="0" cellspacing="0">
			<tbody>
				<tr>
					<td style="border-bottom: 1px solid #fff; border-right: 1px solid #fff; padding:10px 20px;" nowrap>신고자: </td>
					<td style="border-bottom: 1px solid #fff; padding:10px 20px;"><?php print $reporter_name; ?>(<?php print $reporter_email; ?>)</td>
				</tr>
				<tr>
					<td style="border-bottom: 1px solid #fff; border-right: 1px solid #fff; padding:10px 20px;" nowrap>문서 제목: </td>
					<td style="border-bottom: 1px solid #fff; padding:10px 20px;"><?php print $title; ?></td>
				</tr>
				<tr>
					<td style="border-bottom: 1px solid #fff; border-right: 1px solid #fff; padding:10px 20px;" nowrap>작성자: </td>
					<td style="border-bottom: 1px solid #fff; padding:10px 20px;"><?php print $name; ?></td>
				</tr>
				<tr>
					<td style="border-bottom: 1px solid #fff; border-right: 1px solid #fff; padding:10px 20px;" nowrap>신고 내용: </td>
					<td style="border-bottom: 1px solid #fff; padding:10px 20px;"><?php print $content; ?></td>
				</tr>
			</tbody>
		</table>
		<p style="margin-top: 15px; text-align: center; font-size: 1.0em;">
			사이트에 접속하셔서, 신고내용을 검토해주세요.
		</p>
		<div style="text-align: center; padding-top: 15px; padding-bottom: 15px;">
<?php	if($link) {?>
			<a href="<?php print $link; ?>" target="_blank" style="display:inline-block; background-color: #989cff; border-radius: 3px; font-size: 1.0em; font-weight: bold; color: #fff; padding: 10px 15px; text-decoration: none;"><?php print ($link_title ? $link_title : "바로기기"); ?></a>
<?php	}?>
		</div>
