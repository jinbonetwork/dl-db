<div id="login-container" class="<?php print $params['output']; ?>">
	<div class="wrap">
		<h2>로그인</h2>
		<form id="login-form" class="ui-form" name="login" action="<?php print \DLDB\Lib\url($params['login_uri'],$params['login_args']); ?>" method="POST" onsubmit="return check_login(this);">
			<input type="hidden" name="error_return_url" value="<?php print $_SERVER['REQUEST_URI']; ?>" />
			<input type="hidden" name="<?php print $params['return_url']; ?>" value="<?php print ($params['requestURI'] ? $params['requestURI'] : "/"); ?>" />
			<fieldset class="ui-form-items login cadb">
				<div class="ui-form-item user-id">
					 <div class="ui-form-item-control">
					 	<input type="text" id="login_id" class="input text" name="<?php print $params['login_forms'][0]; ?>" placeholder="아이디" />
					 </div>
				</div>
				<div class="ui-form-item password">
					 <div class="ui-form-item-control">
					 	<input type="password" id="login_pw" class="input text" name="<?php print $params['login_forms'][1]; ?>" placeholder="비밀번호" />
					 </div>
				</div>
				<div class="ui-form-item alert">
				</div>
				<button type="submit" class="button submit">로그인</button>
				<div class="info">
				</div>
			</fieldset>
		</form>
	</div>
</div>
