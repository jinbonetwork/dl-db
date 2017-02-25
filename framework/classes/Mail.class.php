<?php
namespace DLDB;
class Mail extends \DLDB\Objects {

	public static function instance() {
		return self::_instance(__CLASS__);
	}

	protected function __construct() {
		require_once DLDB_CONTRIBUTE_PATH."/PHPMailer/PHPMailerAutoload.php";
	}

	public static function send($receivers, $subject, $content) {
		$context = \DLDB\Model\Context::instance();
		$service = $context->getProperty('service.*');

		if($service['useoauth']) {
			require_once( DLDB_CONTRIBUTE_PATH."/PHPMailer/vendor/autoload.php" );
			$mail = new \PHPMailerOAuth;
		} else {
			$mail = new \PHPMailer;
		}
		$mail->SetLanguage( 'ko', DLDB_CONTRIBUTE_PATH."/PHPMailer/language/" );
		$mail->IsHTML(true);
		$mail->CharSet = "UTF-8";
		$mail->Encoding = "base64";

//		$mail->SMTPDebug = 3;

		if( $service['useSMTP'] ) {
			$mail->isSMTP();
			$mail->Host = ($service['smtpHost'] ? $service['smtpHost'] : '127.0.0.1');
			$mail->SMTPAuth = true;
			if($service['smtpSecure']) {
				$mail->SMTPSecure = $service['smtpSecure'];
				$mail->Port = $service['smtpPort'];
			}
			if( $service['useoauth'] ) {
				$mail->AuthType = 'XOAUTH2';
				$mail->oauthUserEmail = $service['smtpAddress'];
				$mail->oauthClientId = $service['oauthClientId'];
				$mail->oauthClientSecret = $service['oauthClientSecret'];
				$mail->oauthRefreshToken = $service['oauthRefreshToken'];
			} else if( $service['smtpUsername'] && $service['smtpPassword'] ) {
				$mail->Username = $service['smtpAddress'];
				$mail->Password = $service['smtpPassword'];
			}
		} else {
			$mail->IsMail();
		}

		$mail->setFrom($service['smtpAddress'], "=?UTF-8?B?".base64_encode($service['smtpUsername'])."?=");

		if($receivers && @count($receivers) > 0) {
			foreach($receivers as $receiver) {
				if($receiver['name']) {
					$mail->addAddress( $receiver['email'], "=?UTF-8?B?".base64_encode($receiver['name'])."?=" );
				} else {
					$mail->addAddress( $receiver['email'] );
				}
			}

			$mail->Subject = "=?UTF-8?B?".base64_encode($subject)."?=";
			$mail->msgHTML($content, dirname(__FILE__));
			$mail->AltBody = strip_tags(preg_replace('/\<br(\s*)?\/?\>/i', "\n", $content));

			if(!$mail->send()) {
				return array(false,$mail->ErrorInfo);
			}
		}
		return array(true);
	}

	public static function templateMail($receivers, $args) {
		$context = \DLDB\Model\Context::instance();
		$themes = $context->getProperty('service.themes');

		@extract($args);

		$mail_theme = DLDB_PATH."/themes/".$themes."/mail.html.php";
		if(file_exists($mail_theme)) {
			ob_start();
			include_once $mail_theme;
			$html = ob_get_contents();
			ob_end_clean();
		} else if(file_exists(DLDB_RESOURCE_PATH."/html/mail.html.php")) {
			ob_start();
			include_once DLDB_RESOURCE_PATH."/html/mail.html.php";
			$html = ob_get_contents();
			ob_end_clean();
		} else {
			$html = $content;
		}

		$ret = self::send($receivers,$subject,$html);

		return $ret;
	}
}
?>
