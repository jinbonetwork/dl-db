<?php
namespace DLDB;

/////////////////////////////////////////////////////////////////
// DBM
final class DBM extends \DLDB\Objects {

	private $_mysqli		= NULL;
	private $_stmt			= NULL;
	private $_result		= NULL;
	private $_numRows		= NULL;
	private $_affectedRows	= NULL;
	private $_query			= NULL;
	private static $_dbm	= NULL; // singleton instance

	private $_is_connect	= 0;
	private $_autocommit	= 0;
	private $_dbName		= DB_NAME;
	private $_dbInfo		= NULL;
	private $_charset		= "utf8";
	public $_accessDB		= NULL;

	public static function instance() {
		return self::_instance(__CLASS__);
	}

	protected function __contruct() {
	}

	public function bind($dbInfo, $autocommit = 0) {

		$this->_autocommit = $autocommit;
		$this->_dbInfo = $dbInfo;
		$this->_dbName = $dbInfo['DB'];

		$this->_mysqli = mysqli_init();
		$this->_mysqli->options(MYSQLI_INIT_COMMAND, "SET AUTOCOMMIT=$autocommit");
		$this->_mysqli->options(MYSQLI_OPT_CONNECT_TIMEOUT, DB_TIMEOUT);

		if($dbInfo['PORT'])
			$this->_mysqli->real_connect($dbInfo['HOST'], $dbInfo['USER'], $dbInfo['PWD'], $this->_dbName,$dbInfo['PORT']);
		else
			$this->_mysqli->real_connect($dbInfo['HOST'], $dbInfo['USER'], $dbInfo['PWD'], $this->_dbName);

		if(mysqli_connect_errno()) {
			throw new \Exception("Connection Exception : ".mysqli_connect_error(), mysqli_connect_errno());
		}

		$this->_is_connect = 1;
		$this->_stmt = $this->_mysqli->stmt_init();
		$this->_mysqli->query("SET NAMES ".($dbInfo['CHARSET'] ? $dbInfo['CHARSET'] : "utf8"));
	}

	public function checkConnection($bReconnect = false) {
		if($this->_mysqli->ping())
			return $this->_mysqli->thread_id;

		if($bReconnect) {
			$this->DBM($this->_dbName, $this->_dbInfo, $this->_autocommit);
			return $this->_mysqli->thread_id;
		}

		return false;
	}

	public function reConnect(){
		$this->DBM($this->_dbName, $this->_dbInfo, $this->_autocommit);
		return $this->_mysqli->thread_id;
	}

	/** mysqli Statement methods. Use these methods when need Prepared SQL Statement. ***/
	public function prepareStmt($query){

		for($i = 0; $i < $this->_dbInfo['RECONN_COUNT']; $i++){
			if($this->_stmt == NULL)
				$this->_mysqli->stmt_init();

			if($this->_stmt->prepare($query))
				break;

			if($this->_mysqli->errno == '2006' || $this->_mysqli->errno =='2013')
				$this->reConnect();
			else
				throw new \Exception("Prepare Statement Exception : ".$query." ".$this->_mysqli->error, $this->_mysqli->errno);
		}

		$this->_query = $query;
	}

	public function bindParam($params){
		if(version_compare(phpversion(), '5.3.0', '>=')) {
			if(!call_user_func_array(array(&$this->_stmt, 'bind_param'), $this->makeValuesReferenced($params)))
				throw new \Exception("Bind Parameter Exception : ".$this->_query." : ".$this->_mysqli->error, $this->_mysqli->errno);
		} else {
			if(!call_user_func_array(array(&$this->_stmt, 'bind_param'), $params))
				throw new \Exception("Bind Parameter Exception : ".$this->_query." : ".$this->_mysqli->error, $this->_mysqli->errno);
		}
	}

	private function makeValuesReferenced($arr) {
		$refs = array();
		foreach($arr as $key => $value)
			$refs[$key] = &$arr[$key];
		return $refs;
	}

	public function execute($query = NULL, $params = NULL){
		$query  = $this->prefix_table($query);
		if($query != NULL)
			$this->prepareStmt($query);

		if($params != NULL)
			$this->bindParam($params);

		if(!$this->_stmt->execute()){
			if($this->getErrNo() != $this->_dbInfo['MYSQL_ERRNO_DUPKEY']) // add this condition at 20051117 ( because using duplicate)
				throw new \Exception("Execute Query Exception : ".$this->_mysqli->error." |query> ".$this->_query, $this->_mysqli->errno);
		}
		$this->_affectedRows = $this->_stmt->affected_rows;
		return $this->_affectedRows;
	}

	public function bindResult($params){
		if(!call_user_func_array(array(&$this->_stmt, 'bind_result'), $params))
			throw new \Exception("Bind Result Exception : ".$this->_mysqli->error, $this->_mysqli->errno);
	}

	public function fetchStmtResult(){
		return $this->_stmt->fetch();
	}

	/** methods about Transactions. Need autocommit=0 ****/
	public function commit(){
		if(!$this->_mysqli->commit())
			throw new \Exception("Commit Exception : ".$this->_mysqli->error, $this->_mysqli->errno);
	}

	public function rollback(){
		if(!$this->_mysqli->rollback())
			throw new \Exception("Rollback Exception : ".$this->_mysqli->error, $this->_mysqli->errno);
	}

	/** methods about smple query ****/
	public function query($query){

		$this->_query  = $this->prefix_table($query);
		for($i = 0; $i < $this->_dbInfo['RECONN_COUNT']; $i++)	
		{
			$this->_result = NULL;
			$this->_result = $this->_mysqli->query($this->_query);
			$this->_numRows = $this->_result->num_rows;
			if(!empty($this->_result))
				break;

			if($this->_mysqli->errno == '2006' || $this->_mysqli->errno =='2013')
				$this->reConnect();
			else
				throw new \Exception("query Exception!!! : ".$this->_mysqli->error." | query> ".$this->_query, $this->_mysqli->errno);

		}
	}

	// type 1, 2, 3 = MYSQLI_ASSOC, MYSQLI_NUM, MYSQLI_BOTH
	public function fetchArray($arrType = MYSQLI_ASSOC){
		if($this->_result && $this->_numRows)
			return $this->_result->fetch_array($arrType);
		return false;
	}

	public function getFetchArray($query, $arrType = MYSQLI_ASSOC, $reDefine = false){
		if($reDefine) {
			$this->query($query);
		}
		else if($this->prefix_table($query) != $this->_query) {
			$this->query($query);
		}

		return $this->_getStripFilter($this->fetchArray($arrType));
	}

	private function _getStripFilter($array) {
		if(@is_array($array) && @count($array)) {
			$result = array();
			foreach($array as $k => $v) {
				if(!is_numeric($v)) $result[$k] = stripslashes($v);
				else $result[$k] = $v;
			}
			return $result;
		}
		return null;
	}

	public function getNumRows(){
		return $this->_numRows;
	}

	public function getAffectedRows(){
		return $this->_affectedRows;
	}

	public function getLastInsertId(){
		return $this->_mysqli->insert_id;
	}

	public function getErrNo(){
		// duplicate err no : #1062
		return $this->_mysqli->errno;
	}

	/** multi query ****/
	public function multiQuery($query){
		$this->_query = $query;
		$this->_mysqli->multi_query($query);
	}

	private function prefix_table($query) {
		return preg_replace('/\{([^\}]+)\}/i','`'.$this->_dbInfo['TB_PREFIX'].'${1}`',$query);
	}

	public function release(){
		if($this->_result != NULL)
			@$this->_result->close();
		if($this->_stmt != NULL)
			@$this->_stmt->close();
		if($this->_mysqli != NULL)
			@$this->_mysqli->close();
	}

	function __destruct(){
		$this->release();
	}
}

/* USAGE */
/*
try {
	$dbm = DBM::instance();
	$query = "SHOW DATABASES";
	$dbm->query($query);

} catch (Exception $e) {


}
 */
?>
