function display_login_error(element,message) {
	jQuery('.ui-form-item.alert').text(message).css({'display': 'block'});
	element.addClass('focus').focus();
}

function remove_login_error(element) {
	jQuery('.ui-form-item.alert').text('').css({'display': 'none'});
	element.removeClass('focus');
}

function check_login(TheForm) {
	var e = jQuery(TheForm).find('input[name="user_id"]');
	if(!e.val()) {
		display_login_error(e,'회원 아이디를 입력하세요');
		return false;
	} else {
		remove_login_error(e);
	}
	var p = jQuery(TheForm).find('input[name="password"]');
	if(!p.val()) {
		display_login_error(p,'비밀번호를 입력하세요');
		return false;
	} else {
		remove_login_error(p);
	}
	
	return true;
}

jQuery(document).ready(function() {
	jQuery('input[name="user_id"]').focus();
});
