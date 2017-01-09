<?php
namespace DLDB;

abstract class Controller {
	public $themes;
	public $layout;
	public $title;
	public $contentType = "html"; 
	public $script = array();
	public $css = array();
	private static $instances = array();

	public function handle($params) {
		global $user;

		$this->params = $params;
		$this->context = \DLDB\Model\Context::instance();
		$this->view_mode = "platform";

		if($_SESSION['user']) {
			$this->user = $_SESSION['user'];
		}
		if(method_exists($this,$params['controller']['process'])) {
			call_user_func(array($this,$params['controller']['process']));

			$this->render();
		} else if(method_exists($this,'index')) {
			call_user_func(array($this,'index'));

			$this->render();
		} else {
			\DLDB\Respond::NotFoundPage();
		}
	}

	public function render() {
		global $uri, $browser;
		$context = \DLDB\Model\Context::instance();
		$this->site_title = $context->getProperty('service.title');

		/**
		 * @brief settting gloabl variables to be used in themes
		 **/
		global $user;

		$this->breadcrumbs = ltrim(substr($uri->uri['appPath'],strlen(DLDB_PATH)),'/');
		if($uri->uri['appFile'] != 'index') $this->breadcrumbs .= "/".$uri->uri['appFile'];
		$this->MyAppClass();

		$acl = \DLDB\Acl::instance();
		if(isset($this->owner) && !$this->owner) $this->owner = $acl->imMaster();

		if(!$this->user) {
			if($_SESSION['user']) {
				$user = array_merge($user,$_SESSION['user']);
			}
		} else $user = $this->user;

		if($this->total_cnt) $this->PageNavigation();
		if($this->contentType == "redirect") {
			header("Location: $this->redirectURI");
		} else if(($this->params['browserType'] == 'api' || $this->params['output'] == 'json' || $this->contentType == "json")) {
			extract((array)$this);
			header("Content-Type: application/json; charset=utf-8");
			if(file_exists($this->params['controller']['path']."/".$this->params['controller']['file'].".json.php"))
			include $this->params['controller']['path']."/".$this->params['controller']['file'].".json.php";
			else if(file_exists($this->params['controller']['path']."/".$this->params['controller']['process'].".json.php"))
			include $this->params['controller']['path']."/".$this->params['controller']['process'].".json.php";
			else
				print json_encode(array());
		} else {
			if(!$this->themes) $this->themes = $context->getProperty('service.themes');

			if($this->params['output'] != "nolayout") {
				/**
				 * @brief default javascript 를 호출. ex jquery
				 **/
				$this->initJs($this->initscript);

				/**
				 * @brief resource/css에서 불러오도록 지정된 css들의 경로를 잡아준다.
				 **/
				if(@count($this->css)) {
					foreach($this->css as $css) {
						\DLDB\View\Resource::addCss($css,0,array('compress'=>true));
					}
				}
				/**
				 * @brief 해당 controller 경로에 style.css가 있으면 이 경로 밑에 있는 모는 페이지는 이 style.css를 포함한다.
				 **/
				if(file_exists($this->params['controller']['path']."/style.css")) {
					\DLDB\View\Resource::addCssURI($this->params['controller']['uri']."/style.css",0,array('compress'=>true));
				}
				/**
				 * @brief 해당 controller에 매치되는 controller.css가 있으면 포함한다.
				 **/
				if(file_exists($this->params['controller']['path']."/".$this->params['controller']['file'].".css")) {
					\DLDB\View\Resource::addCssURI($this->params['controller']['uri']."/".$this->params['controller']['file'].".css",0,array('compress'=>true));
				}

				$this->initAppCssScript($this->params['controller']['path']);

				/**
				 * @brief resource/script에서 불러오도록 지정된 script들의 경로를 잡아준다.
				 **/

				if(@count($this->js)) {
					foreach($this->js as $js) {
						\DLDB\View\Resource::addJs($js,0,array('compress'=>true));
					}
				}
				if(@count($this->react)) {
					foreach($this->react as $script) {
						\DLDB\View\Resource::addReact($script,0,array('compress'=>false,'position'=>'footer'));
					}
				}
				if(@count($this->script)) {
					foreach($this->script as $script) {
						\DLDB\View\Resource::addScript($script,0,array('compress'=>true));
					}
				}
				/**
				 * @brief 해당 controller 경로에 script.js가 있으면 이 경로 밑에 있는 모는 페이지는 이 script.js를 포함한다.
				 **/
				if(file_exists($this->params['controller']['path']."/script.js")) {
					\DLDB\View\Resource::addJsURI($this->params['controller']['uri']."/script.js",0,array('compress'=>true));
				}
				/**
				 * @brief 해당 controller에 매치되는 controller.js가 있으면 포함한다.
				 **/
				if(file_exists($this->params['controller']['path']."/".$this->params['controller']['file'].".js")) {
					\DLDB\View\Resource::addJsURI($this->params['controller']['uri']."/".$this->params['controller']['file'].".js",0,array('compress'=>true));
				}

				/**
				 * @brief themes에 있는 기본 css와 script 들을 가장 먼저 포함한다.
				 **/
				if($this->layout == "admin") {
					\DLDB\Lib\importResource('app-admin');
				} else {
					$this->initTheme();
					if(($html_file = $this->appPath())) {
						$this->themeCssJs($html_file);
					}
				}

				/* FaceBook plugin */
				$this->body_start = '';
			}

			extract((array)$this);

			if(($html_file = $this->appPath())) {
				ob_start();
				include $this->renderPath($html_file);
				$content = ob_get_contents();
				ob_end_clean();

				$layout_file = $this->LayoutFile();
			} else {
				\DLDB\Respond::NotFoundPage();
			}

			if($this->params['output'] == "nolayout") {
				header("Content-Type:text/html; charset=utf-8");
				echo $content;
			} else {
				/**
				 * @brief make admin theme
				 **/
				if($this->layout == 'admin' && file_exists(DLDB_APP_PATH."/admin/layout.html.php")) {
					ob_start();
					include DLDB_APP_PATH."/admin/layout.html.php";
					$content = ob_get_contents();
					ob_end_clean();
				}

				/**
				 * @brief make html result using theme layout
				 **/
				if($layout_file) {
					ob_start();
					include $layout_file;
					$html = ob_get_contents();
					ob_end_clean();
					print $html;
				}
			}
		}
	}

	public function initAppCssScript($path) {
		if(file_exists($path."/css")) {
			$this->dirCssJsHtml(substr($path,strlen(DLDB_PATH))."/css",1000);
		}
		if(file_exists($path."/script")) {
			$this->dirCssJsHtml(substr($path,strlen(DLDB_PATH))."/script",1000,'footer');
		}
	}

	public function initTheme() {
		if( !$this->themeCssLoad ) {
			if(file_exists(DLDB_PATH."/themes/".$this->themes."/config.php")) {
				require_once DLDB_PATH."/themes/".$this->themes."/config.php";
			}
			$this->dirCssJsHtml("themes/".$this->themes,1000);
			$this->dirCssJsHtml("themes/".$this->themes."/css",1000);
			$this->dirCssJsHtml("themes/".$this->themes."/script",1000,'footer');
			$this->themeCssLoad = true;
		}
	}

	public function header() {
		/**
		 * @brief make header. rendering dynamic css and script
		 **/
		print \DLDB\View\Resource::renderCss().$this->BaseURIScript().\DLDB\View\Resource::renderJs()."\t".$this->header;
	}

	public function footer() {
		/**
		 * @brief add google statistic script before body end
		 **/
		print $this->footer."\n".\DLDB\View\Resource::renderJs('footer');
	}

	private function BaseURIScript() {
		$urlscript = "\t".'<script type="text/javascript">'."\n\t\t".'var site_base_uri = "'.rtrim(DLDB_URI,'/').'";'."\n\t</script>\n";
		return $urlscript;
	}

	public function dirCssJsHtml($dir,$priority=0,$position='header') {
		if(!@is_dir(DLDB_PATH."/".$dir)) return;
		$dp = opendir(DLDB_PATH."/".$dir);
		$__dir = "/".ltrim(rtrim(DLDB_URI,"/").$dir,"/");
		while($f = readdir()) {
			if(substr($f,0,1) == ".") continue;
			if(@is_dir(DLDB_PATH."/".$dir."/".$f)) continue;
			if(preg_match("/(.+)\.css$/i",$f)) {
				\DLDB\View\Resource::addCssURI($__dir."/".$f,$priority,array('compress'=>true,'position'=>$position));
			} else if(preg_match("/(.+)\.js$/i",$f)) {     
				\DLDB\View\Resource::addJsURI($__dir."/".$f,$priority,array('compress'=>true,'position'=>$position));
			}
		}
		closedir($dp);
	}

	private function cssHtml($uri) {
		\DLDB\View\Resource::addCssURI($uri,0,array('compress'=>true));
	}

	private function jsHtml($uri) {
		if(preg_match("/\.css$/i",$uri)) {
			\DLDB\View\Resource::addCssURI($uri,0,array('compress'=>true));
//			return $this->cssHtml($uri);
		}
		\DLDB\View\Resource::addJsURI($uri,0,array('compress'=>true));
//		return "\t<script type=\"text/javascript\" src=\"$uri\"></script>\n";
	}

	private function initJs($src) {
		if(file_exists(DLDB_PATH."/resources/script/init.js")) {
			$script .= file_get_contents(DLDB_PATH."/resources/script/init.js");
		}
		if($src) $script .= $src;

		if($script) {
			\DLDB\View\Resource::addScriptSource($script,-50,array('compress'=>true));
		}
	}

	private function appPath() {
		if($this->params['output'] == "nolayout") {
			$file_path = $this->params['controller']['path']."/".$this->params['controller']['process'].".html.php";
			if(file_exists($file_path)) return $file_path;
		}
		$file_path = $this->params['controller']['path']."/".$this->params['controller']['file'].".html.php";
		if(file_exists($file_path)) return $file_path;
		$file_path = $this->params['controller']['path']."/".$this->params['controller']['process'].".html.php";
		if(file_exists($file_path)) return $file_path;
		return null;
	}

	private function themeCssJs($path) {
		$_path = dirname("themes/".$this->themes."/".ltrim(substr($path,strlen(DLDB_APP_PATH)),"/"));
		$this->dirCssJsHtml($_path,1010,'footer');
	}

	private function renderPath($path) {
		$_path = DLDB_PATH."/themes/".$this->themes."/".substr($path,strlen(DLDB_APP_PATH));
		if(file_exists($_path)) {
			define("DLDB_APP_CALL_PATH",$path);
			return $_path;
		}
		else return $path;
	}

	private function LayoutFile() {
		if($this->layout == 'admin') {
			$layout_file = DLDB_PATH."/resources/html/admin.layout.html.php";
		} else {
			$layout_file = DLDB_PATH."/themes/".$this->themes."/layout.html.php";
		}
		if(file_exists($layout_file)) return $layout_file;
		return null;
	}

	private function PageNavigation() {
		if($this->total_cnt) {
			if(!$this->page) $this->page = 1;
			if(!$this->limit) $this->limit = 15;
			if(!$this->page_num) $this->page_num = 10;

			$this->total_page = (int)(($this->total_cnt-1) / $this->limit)+1;
			$this->s_page = (int)(($this->page - 1)/$this->page_num)*($this->page_num)+1;
			if($this->s_page > 1) $this->p_page = $this->s_page-1;
			else $this->p_page = 0;
			$this->e_page = min($this->total_page,$this->s_page + $this->page_num - 1);
			if($this->e_page < $this->total_page) $this->n_page = $this->e_page + 1;
			else $this->n_page = 0;
		}
	}

	private function MyAppClass() {
		$breadcrumbs = explode("/",$this->breadcrumbs);
		$this->breadcrumbs_class = "";
		$bcnt = @count($breadcrumbs);
		for($i=0; $i<$bcnt; $i++) {
			$this->breadcrumbs_class .= ($this->breadcrumbs_class ? " " : "").implode("-",array_slice($breadcrumbs,0,$i+1));
		}
	}

	public function get_error_action() {
		if($this->params['output'] == 'json') return DLDB_ERROR_ACTION_AJAX;
		else if($this->contentType == 'json') return DLDB_ERROR_ACTION_AJAX;
		else return DLDB_ERROR_ACTION_URL;
	}
}
