	<div class="digital-library">
		<div class="digital-library__content">
		<div class="user-regist">
			<div class="regist__innerwrap">
				<div class="regist__header">
					<img src='<?php print DLDB_URI."themes/".$themes; ?>/images/logo.svg'} />
                        <div class="regist__title">
                            <span style="text-align: left;">민주사회를 위한 변호사모임</span>
                            <span style="text-align: left;">디지털 도서관</span>
                        </div>
                    </div>
				</div>
				<div class="regist__body">
					<div class="user-profile">
						<table class="user-profile__form-wrap">
							<tbody>
								<tr>
									<td class="user-profile__table-margin"></td>
								</tr>
								<tr>
									<td>
										<table class="form">
											<tbody>
												<tr class="form__menu">
													<td><span>회원가입 인증</span></td>
												</tr>
												<tr>
													<td><span><?php print $params['member']['name']; ?>님 회원 가입 인증이 완료되었습니다.<span></td>
												</tr>
												<tr class="form__submit-wrap">
													<td><a class="form__submit" href="<?php print DLDB_URI; ?>">로그인하러 가기</a></td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div class="regist__links">
					<div class="regist__links-content">
						<div>
							<div><span>Powered by </span><a href="http://jinbo.net" target="_blank">진&gt;보넷</a></div>
							<div>
								<span>디지털 아카이브 프로젝트 </span><a href="http://github.com/jinbonetwork" target="_blank"><img src="<?php print $base_uri."/themes/".$themes; ?>/images/github.png"></a>
						</div>
						</div>
						<div>
							<img src="<?php print DLDB_URI."themes/".$themes; ?>/images/archive.png">
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
