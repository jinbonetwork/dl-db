		<p style="margin-bottom:15px; text-align: center;">
			<span style="font-weight:bold; font-size:1.0em;"><?php print $name; ?></span>님이 '<?php print $site_title; ?>' 에 자료를 업로드하셨습니다.
		</p>
		<table style="background: #e4eaff; margin: 0 auto; border: 1px solid #fff; border-radius: 3px; font-size: 1.0em;" cellpadding="0" cellspacing="0">
			<tbody>
				<tr>
					<td style="border-bottom: 1px solid #fff; border-right: 1px solid #fff; padding:10px 20px;" nowrap>문서 제목: </td>
					<td style="border-bottom: 1px solid #fff; padding:10px 20px;"><?php print $title; ?></td>
				</tr>
				<tr>
					<td style="border-bottom: 1px solid #fff; border-right: 1px solid #fff; padding:10px 20px;" nowrap>작성자: </td>
					<td style="border-bottom: 1px solid #fff; padding:10px 20px;"><?php print $name; ?></td>
				</tr>
				<tr>
					<td style="border-bottom: 1px solid #fff; border-right: 1px solid #fff; padding:10px 20px;" nowrap>문서 내용: </td>
					<td style="border-bottom: 1px solid #fff; padding:10px 20px;"><?php print $content; ?></td>
				</tr>
<?php		if(@count($files) > 0) {?>
				<tr>
					<td style="border-bottom: 1px solid #fff; border-right: 1px solid #fff; padding:10px 20px;" nowrap>업로드파일: </td>
					<td style="border-bottom: 1px solid #fff; padding:10px 20px;">
						<table cellpadding="0" cellspacing="0" border="0" style="background: #fff; border-radius: 3px;">
							<tbody>
								<tr>
									<th style="padding:5px 10px; border-bottom: 1px solid #e4eaff;">파일명</th>
									<th style="padding:5px 10px; border-bottom: 1px solid #e4eaff;">상태</th>
								</tr>
<?php					if(is_array($files)) {
							foreach($files as $file) {?>
								<tr>
									<td style="padding:5px 10px;"><?php print $file['filename']; ?></td>
									<td style="padding:5px 10px;"><?php print $file['status']; ?></td>
								</tr>
<?php						}
						}?>
							</tbody>
						</table>
					</td>
				</tr>
<?php		}?>
			</tbody>
		</table>
		<p style="margin-top: 15px; text-align: center; font-size: 1.0em;">
			사이트에 접속하셔서, 내용 및 첨부파일을 검토해주세요.
		</p>
		<div style="text-align: center; padding-top: 15px; padding-bottom: 15px;">
<?php	if($link) {?>
			<a href="<?php print $link; ?>" target="_blank" style="display:inline-block; background-color: #989cff; border-radius: 3px; font-size: 1.0em; font-weight: bold; color: #fff; padding: 10px 15px; text-decoration: none;"><?php print ($link_title ? $link_title : "바로기기"); ?></a>
<?php	}?>
			<a href="<?php print $base_url; ?>admin/attachments" target="_blank" style="display:inline-block; background-color: #989cff; border-radius: 3px; font-size: 1.0em; font-weight: bold; color: #fff; padding: 10px 15px; text-decoration: none;">첨부파일관리페이지</a>
		</div>
