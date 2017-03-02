<?php
namespace DLDB;
class Mailer extends \DLDB\Objects {

	public static function instance() {
		return self::_instance(__CLASS__);
	}

	public static function sendMail($template, $receivers, $args, $SMTPDebug=0) {
		$context = \DLDB\Model\Context::instance();
		$themes = $context->getProperty('service.themes');

		@extract($args);

		if(!$base_url)
			$base_url = "http".($context->getProperty('service.ssl') ? "s" : "")."://".rtrim($context->getProperty('service.domain'),"/").DLDB_URI;
		if($context->getProperty('service.ssl') == true) {
			$base_url = preg_replace("/^http:\/\//i","https://",$base_url);
		}

		if(!$site_title) {
			$site_title = $context->getProperty('service.title');
		}

		if($link) {
			if(!preg_match("/^http(s)?:\/\//i",$link)) {
				$link = rtrim($base_url,"/")."/".ltrim($link,"/");
			} else if(preg_match("/^http:\/\//i",$link)) {
				$link = preg_replace("/^http:\/\//i","https://",$link);
			}
		}

		if($template) {
			$template_theme =  DLDB_PATH."/themes/".$themes."/mail/".$template.".html.php";
			if(file_exists($template_theme)) {
				ob_start();
				include_once $template_theme;
				$content = ob_get_contents();
				ob_end_clean();
			} else if(file_exists(DLDB_RESOURCE_PATH."/html/mail/".$template.".html.php")) {
				ob_start();
				include_once DLDB_RESOURCE_PATH."/html/mail/".$template.".html.php";
				$content = ob_get_contents();
				ob_end_clean();
			}
		}

		$mail_theme = DLDB_PATH."/themes/".$themes."/mail/layout.html.php";
		if(file_exists($mail_theme)) {
			ob_start();
			include_once $mail_theme;
			$html = ob_get_contents();
			ob_end_clean();
		} else if(file_exists(DLDB_RESOURCE_PATH."/html/mail/layout.html.php")) {
			ob_start();
			include_once DLDB_RESOURCE_PATH."/html/mail/layout.html.php";
			$html = ob_get_contents();
			ob_end_clean();
		} else {
			$html = $content;
		}

		$ret = \DLDB\Mail::send($receivers,$subject,$html,$SMTPDebug);

		return $ret;
	}
}
?>
