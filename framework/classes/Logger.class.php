<?php
namespace DLDB;

class Logger extends \DLDB\Objects {
	private $_logType;
	private $_errLogPath;
	private $_loggingID;
	public $last;

	protected function __construct() {
		$this->setLogger();
	}

	private function setLogger() {
		$this->_logType		= DLDB_LOG_TYPE;
		$this->_errLogPath	= DLDB_ERROR_LOG_PATH;
		$this->_loggingID	= DLDB_LOG_ID;
		$this->last = (object) array();
	}

	public static function instance() {
		return self::_instance(__CLASS__);
	}

	public static function debug($file,$line,$message) {
		if(!file_exists(DLDB_ERROR_LOG_PATH)) {
			mkdir(DLDB_ERROR_LOG_PATH,0707);
		}
		$fp = fopen(DLDB_ERROR_LOG_PATH."/debug.log","a+");
		fputs($fp,"[".date("Y-m-d H:i:s")."] ".$file."(".$line.") ".$message."\n");
		fclose($fp);
	}

	public function setLogType($LOG_TYPE, $LOG_ID=null, $LOG_PATH=null) {
		$this->_logType = $LOG_TYPE;
		if($LOG_PATH) $this->_errLogPath = $LOG_PATH;
		if($LOG_ID) $this->_loggingID = $LOG_ID;
	}

	public function redirectPrintLog($message) {
		$context = \DLDB\Model\Context::instance();
		$theme = $context->getProperty('service.themes');
		header("Content-Type: text/html; charset=utf-8");

		ob_start();
		if(file_exists(DLDB_RESOURCE_PATH."/html/error.html.php")) {
			require_once DLDB_RESOURCE_PATH."/html/error.html.php";
		} else {?>
			<div style="border:1px solid #ccc; color:red; padding:15px;">
				<font style="color:green; font-weight:bold">Fix Me Please: </font> <? print $message; ?>
			</div>
		<?php }
		$output = ob_get_contents();
		ob_end_flush();

		$this->last = (object) array(
			'callback' => 'redirectPrintLog',
			'type' => 'html',
			'output' => $output,
			'message' => $message,
		);
	}

	public function redirectFileLog($errorMsg) {
		if(!$this->_errLogPath) {
			return;
		}

		$day = date("Ymd");
		if($this->_loggingID)
			$logFilePath = $this->_errLogPath."/".$this->_loggingID.".".$day.".log";
		else
			$logFilePath = $this->_errLogPath."/".$day.".log";

		$errorMsg = "[".date(DLDB_LOG_DATE_FORMAT)."] ".$errorMsg."\r\n";
		@error_log($errorMsg, 3, $logFilePath);

		$this->last = (object) array(
			'callback' => 'redirectFileLog',
			'type' => 'file',
			'path' => $logFilePath,
			'message' => $errorMsg,
		);
	}

	public function Error($e, $action = 0, $url = NULL) {
		if(is_object($e))
			$errorMsg = $e->getFile().":".$e->getLine()." => ".$e->getCode()." : ".$e->getMessage();
		else 
			$errorMsg = $e;

		if($this->_logType == DLDB_LOG_TYPE_PRINT) {
			if($action != DLDB_ERROR_ACTION_AJAX)
				$this->redirectPrintLog($errorMsg);
		} else if($this->_logType == DLDB_LOG_TYPE_FILE) {
			$this->redirectFileLog($errorMsg);
		} else if($this->_logType == DLDB_LOG_TYPE_ALL) {
			if($action != DLDB_ERROR_ACTION_AJAX)
				$this->redirectPrintLog($errorMsg);
			$this->redirectFileLog($errorMsg);
		} 
		
		if($action == DLDB_ERROR_ACTION_URL) {
			$this->last->action = 'redirect';
			if(!$url)
				$url = DLDB_COMMON_ERROR_PAGE;
			?>
			<script language="javascript">
				location.href = "<?php print $url ?>";
			</script>
		<?php }
		if($action == DLDB_ERROR_ACTION_AJAX) {
			$this->last->action = 'ajax';
			if($errorMsg) {
				header("Content-Type:  application/json; charset=utf-8");
				print json_encode(array('error'=>-999999,'message'=>$errorMsg));
			} else {
				print DLDB_ERROR_AJAX_MSG;
			}
		}

		return;
	}
}
?>
