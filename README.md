# dl-db
민변디지털도서관 검색서비스

# 1. 소개

이 프로젝트는 민변디지털도서관 시스템을 구축하기위해 추진되었습니다. 하지만 다양한 용도로 재활용될 수 있도록 범용적으로 구축하였습니다.  이 프로젝트는 기본적으로 자료(PDF,HWP,DOC,DOCX) 검색시스템입니다. 자료들을 유연한 필드관리시스템과 분류시스템을 통해 체계적으로 자료정리를 할 수 있도록 지원하며, 첨부파일 검색을 지원합니다.

이 프로젝트는 React + PHP 기반으로 제작된 검색플랫폼입니다.  그리고 검색플랫폼은 매우 개방적인 시스템입니다. 이 플랫폼은 자체 회원시스템(회원가입 / 로그인) 을 가지지 않습니다. 대신 Xpress Engine(Xe) 또는 GNU Board 5(gnu5) 회원시스템과 연동하도록 설계되었습니다. 따라서 게시판 등 다른 서비스와 충돌없이 쉽게 연동하여 사용할 수 있습니다.

검색은 MySQL fulltext(mecab plugin 설치) 검색 또는 ElasticSearch 검색 두가지를 지원합니다. 두가지 모두 한글형태소분석기 프로젝트인 '은전한닢 프로젝트'를 사용하여 검색인덱싱을 제공합니다. ElasticSearch를 사용할 경우 ElasticSearch 2.4.0 을 설치하셔야 합니다.

첨부파일 검색을 위해 XPdf library를 사용합니다. XPdf를 사용하려면 PHP에서 popen과 같이 시스템 명령을 사용할 수 있어야 합니다. 설정에 따라 시스템 명령어를 사용할 수 없는 환경일 경우 대체 PHP Library로 PDFParser 를 사용합니다. PHP PDFParser를 사용하는 경우 아래한글 2010 버젼 이하버젼이나 Scanned PDF Format(이미지형태의 PDF) 파일들은 자동으로 Parsing할 수 없습니다. 그리고 암호화된 파일들도 역시 Parsing할수 없습니다. 하지만 두가지 모두 완벽하게 Parsing하진 못합니다. 노이즈가 껴있다거나 문서가 뒤틀려있는 경우 문자열이 깨질 수 있습니다. 이런 경우 수동으로 자료를 수정할 수 있는 UI를 추가로 제공합니다.

# 2. Requirement

* NodeJs-5.5 이상
* PHP 5.6 이상 & composer(PHP 패키지관리 툴)
* mecab-ko-dic-2.0.1
* MySQL Fulltext 검색을 사용할 경우: MySQL 5.7.0 이상
* ElasticSearch를 검색엔진으로 사용할 경우: ElasticSearch 2.4.0 설치에 필요한 OpenJDK-1.8

# 3. 브라우저 호환성

|       | Firefox | Chrome | IE | Edge | Safari | Opera | Android | Chrome for Android |
|:-----:|:------:|:-----:|:------:|:------:|:-----:|:-----:|:------:|:-----:|
| axios | 45 | 48 | 9, 10, 11 |14 | 9 |
| formData | 4 | 7 | 10 | | 5 |12 | 3 | yes |


# 4. 설치

이 프로젝트는 다른 오픈소스 프로젝트들을 서브모듈로 가지고 있습니다. 따라서 gil clone으로 소스를 다운받을 시, --recursive 옵션으로 설치하셔야 합니다.

현재는 설치 페이지를 별도로 제공하지 않습니다. 몇몇 단계로 나누어 수동으로 설치하셔야 합니다.

1) Apache 설정
--------------
* 이 시스템은 웹서버 rewrite module을 사용합니다. 이 사이트가 rewrite module을 사용할 수 있도록 웹서버 설정을 해주세요.

2) mysqlDB 생성
--------------
* 단체협약데이터베이스 시스템은 현재 MySQL 만 지원합니다.
* 사용하실 MySQL DB를 수동으로 만드셔야 합니다.
* install/sql/schema.sql 파일을 이용해서 새로 생성된 DB에 필요한 테이블을 생성합니다.
* 문자셋은 utf8mb4을 사용해야 한다.

3) settings.php 생성
--------------------
* config 폴더에 있는 settings.dist.php 파일을 settings.php 로 복사한후, DB 접속정보와 도>메인 정보등 필요한 정보를 수정/저장합니다.
* 정확한 settings.php 의 위치는 config/settings.php
* 인증시스템을 어떤 것으로 사용할지 설정
```vim
$session['type'] = 'xe'; /* xe를 사용할 시 xe, gnu5를 사용할경우 gnu5 */
```
* 검색 방식 지정을 지정하셔야 합니다.
```vim
$session['search_type'] = 'elastic'; /* elasticsearch를 사용할 시 elastic, mysql fulltext를 사용할경우 db */
/* elasticsearch를 사용하는 경우 아래 옵션 정보를 입력해주셔야 합니다. */
$service['elastic_index'] = 'index';
$service['elastic_shards'] = 6;
$service['elastic_replicas'] = 0;
$service['elastic_analyzer'] = 'seunjeon_default_tokenizer';
$service['elastic_tokenizer'] = 'seunjeon_tokenizer';
```
* files 폴더를 웹서버가 접근할 수 있도록 707 권한 부여.

4) XE 설치
----------
* xe 폴더에 files 폴더 생성. 웹서버가 접근할 수 있도록 707 권한 부여.
* http://domain/xe 에 접속하여 XE 설치

5) React 코드 설정
-----------------
* 관리페이지는 react로 제작되었습니다. admin app 폴더에서 react를 build해주세요.
```bash
$ cd app/admin/dev
$ npm install
$ npm run build
```
* 각 테마는 react 로 구성되어야 합니다. 사용할 테마로 가셔서 react를 build해주세요.
```bash
$ cd themes/minbyun/dev
$ npm install
$ npm run build
```

6) Composer 설치
---------------
추가 라이브러리를 설치하려면 Composer가 필요합니다. 사용자 계정의 bin 폴더에 composer.phar를 설치합니다.
```bash
$ cd
$ mkdir bin (계정 홈 밑에 bin 폴더 생성)
$ cd bin
$ curl -sS https://getcomposer.org/installer | php
```

7) XPdf 설치
-----------
pdf 첨부파일에서 text를 추출하여 검색 Indexing 하기위해 PDF에서 text를 추출하는 대표적인 오픈소스인 [XPDF](http://www.foolabs.com/xpdf/download.html) 설치. PHP에서 XPDF를 이용하여 text를 추출하는 [PHP-XPDF 라이브러리](https://github.com/alchemy-fr/PHP-XPDF)가 있지만, 테스트 결과 아직 안정버젼이라 보기 힘들다고 판단하여, 현재는 popen을 톹해 pdftotext 명령어를 직접 사용합니다. 이를 위해서는 PHP에서 popen 으로 shell 명령을 허용한 경우에만 사용가능합니다.
```bash
$ yum install xpdf
```
xpdf 사용예
```bash
$ pdftotext [options] [PDF-file [text-file]]
```
config/settings.php 에 pdftotext 경로 설정 및 기본 parser 지정
```vim
$service['pdfparser'] = 'xpdf';
$service['pdftotext'] = '/usr/bin/pdftotext';
```

8) Tesseract 설치
----------------
이미지로 만들어진 PDF에서 Text를 추출하여 검색 Indexing 하기위해 GhostScript와 Tesseract Library를 설치한다.
```bash
$ yum install ghostscript
$ yum install tesseract
```
tesseart에서 사용할 한국어 Data 파일 추가
```bash
$ cd /usr/share/tesseract/tessdata
$ wget https://github.com/tesseract-ocr/tessdata/raw/4.00/kor.traineddata
$ tesseract --list-langs
List of available languages (2):
kor
eng
```
config/settings.php 에 tesseract 경로 설정
```vim
$service['gs'] = '/usr/bin/gs';
$service['tesseract'] = '/usr/bin/tesseract';
```

8) pdfparser 설치
-----------------
PHP에서 popen등 shell 명령을 제한하는 경우. 대체제로 PDFParser 라이브러리를 사용합니다.  그럴 경우를 대비하여 pdfparser 설치
```bash
$ cd contribute/pdfparser
$ php ~/bin/composer.phar install --dev
```
pdfparser를 사용할 경우 아래와 같이 config/settings.php 설정
```vim
$service['pdfparser'] = 'pdfparser';
```

9) File Parse Daemom
--------------------
* pdf 등 첨부파일 파싱을 문서작성과 동시에 할 수도 있고, 두개의 과정을 분리할 수도 있습니다. 분리여부는 theme 에서 결정합니다.
* 파싱을 분리하는 경우 파일을 별도의 api로 업로드하도록 theme가 작성되어야 합니다. 사용할 api는 /api/file/upload 입니다. 이 api를 사용하기 위해서는 parsing하기 위해 별도의 parser daemon(parser.php)을 설정해야 합니다.
* parser daemon은 xinetd에 의해 구동하도록 설계되어 있습니다.

**xinetd 설정방법**

어떤 포트를 사용할지는 임의로 지정할 수 있습니다. 아래 예제는 20010 port를 사용한다는 것을 가정하여 작성되었습니다.

* /etc/services 설정
```bash
vim /etc/services
```
```vim
# Local services
dldb_parser     20010/tcp               # dldb parser
```
* /etc/xinet.d/ 설정
```bash
vim /etc/xinetd.d/dldb_parser
```
```vim
service dldb_parser
{
	socket_type             = stream
	protocol                = tcp
	wait                    = no
	user                    = dldb
	server                  = /usr/local/bin/php
	server_args             = /home/dldb/public_html/parser.php /* 이 프로젝트가 /home/dldb/public_html에 설치되어 있는 경우 */
	log_on_success          += DURATION
	nice                    = 10
	only_from               = 127.0.0.1
	disable                 = no
}
```
* xinetd restart
```bash
service xinetd restart
```
* config/settings.php 설정
```bash
vim config/settings.php
```
```vim
$service['parsing_server'] = '127.0.0.1'; /* xinetd 설정에 only_from 값.
$service['parsing_port'] = '20010' /* services 에 설정한 port 번호 */
```

10) Mecab-ko 설치
---------------
* 공식 홈페이지: http://eunjeon.blogspot.kr/
* mecab 설치
```bash
$ rpm -ivh http://packages.groonga.org/centos/groonga-release-1.1.0-1.noarch.rpm
$ yum install mecab mecab-devel
```
* mecab-dic 설치
```bash
$ cd /usr/local/src
$ wget https://bitbucket.org/eunjeon/mecab-ko-dic/downloads/mecab-ko-dic-2.0.1-20150920.tar.gz
$ tar xzvpf mecab-ko-dic-2.0.1-20150920.tar.gz
$ cd mecab-ko-dic-2.0.1-20150920
$ ./autogen.sh
$ ./configure
$ make
$ make install
```
* mecab 설정
  * mecab은 일본프로젝트이기 때문에 기본적으로 일본어 사전을 기본값으로 합니다. 이를 아래와 같이 우리가 컴파일한 mecab-ko-dic으로 설정해 줘야 합니다. 64bit Linux의 경우 /usr/lib64에 설치되어 있을 것이고, 32bit는 /usr/lib 에 설치되어 있을 것입니다.
```bash
$ vim /etc/mecabrc
```
```vim
;
; Configuration file of MeCab
;
; $Id: mecabrc.in,v 1.3 2006/05/29 15:36:08 taku-ku Exp $;
;
;dicdir =  /usr/lib64/mecab/dic/ipadic
dicdir =  /usr/lib64/mecab/dic/mecab-ko-dic
 
; userdic = /home/foo/bar/user.dic
  
; output-format-type = wakati
; input-buffer-size = 8192
   
; node-format = %m\n
; bos-format = %S\n
; eos-format = EOS\n
```

11) MySQL FullText로 검색할 경우
------------------------------
* 참고사이트: http://dev.mysql.com/doc/refman/5.7/en/fulltext-search-mecab.html
```bash
$ vim /etc/my.cnf
```
```vim
[mysqld]
innodb_ft_min_token_size=1
loose-mecab-rc-file=/etc/mecabrc
```
```bash
$ service mysqld restart
```
* mysql server에 mecab 플러그인 설정
```bash
mysql> INSTALL PLUGIN mecab SONAME 'libpluginmecab.so';
```

12) ElasticSearch 을 사용할 경우
------------------------------
* 현재는 Elastic 2.4.0 버젼을 사용합니다. 한국 형태소 분석기인 '은전한닢 프로젝트' mecab-ko가 지원하고, Elastic 5.0을 사용하기에는 아직 검증되지 않았기에 일단 2.4.0 버젼으로 시작합니다. 향후 ElasticSearch 프로젝트 진행상황에 따라 향후 업그레이드 할 예정입니다.
* 참조: https://bitbucket.org/eunjeon/mecab-ko-lucene-analyzer/raw/master/elasticsearch-analysis-mecab-ko/

* elastic PHP api 설치
```bash
$ cd contribute/elasticsearch
$ php ~bin/composer.phar install
```

* elasticsearch-2.4.0 설치
  * 2.4.0은 yum으로 설치할 수 없고, rpm으로 직접 설치해야 합니다.
```bash
$ cd /usr/local/src
$ wget https://download.elastic.co/elasticsearch/release/org/elasticsearch/distribution/rpm/elasticsearch/2.4.0/elasticsearch-2.4.0.rpm
$ rpm -ivh elasticsearch-2.4.0.rpm
```
* ElasticSearch Plugin 설치
```bash
$ cd /usr/share/elasticsearch/
 
$ bin/plugin install analysis-icu
$ bin/plugin install mobz/elasticsearch-head
$ bin/plugin install org.bitbucket.eunjeon/elasticsearch-analysis-seunjeon/2.4.0.1
```
* ElasticSearch Start
```bash
$ ./bin/elasticsearch -Des.security.manager.enabled=false
```

13) PHPMailer 설치
------------------
* 회원 아이디 발급이나, 자료업로드시 공지 메일을 주고받기 위해 PHPMailer 설치

* PHPMailer install
```bash
$ cd contribute/
$ git clone https://github.com/PHPMailer/PHPMailer.git
```

**config/settings.php 설정**

* 서비MTA 이용할 경우
  * 참고: https://github.com/PHPMailer/PHPMailer/blob/master/examples/mail.phps
  * config/settings.php
```bash
vim config/settings.php
```
```vim
$service['useSMTP'] = false;
$service['smtpAddress'] = 'test@test.com';
$service['smtpUsername'] = '이름';
```
* 외부MTA의 SMTP 이용할 경우 
  * 참고: https://github.com/PHPMailer/PHPMailer/blob/master/examples/smtp.phps
  * config/settings.php
```vim
$service['useSMTP'] = true;
$service['smtpHost'] = 'smtp.test.com';
$service['smtpPort'] = '25'; /* smtp port */
$service['smtpAddress'] = 'test@test.com';
$service['smtpUsername'] = '이름';
```
* Gmail OAuth2를 이용할 경우
  * 참고: https://github.com/PHPMailer/PHPMailer/wiki/Using-Gmail-with-XOAUTH2
  * google oauth2 App 만들기 
    * 참고: https://github.com/PHPMailer/PHPMailer/wiki/Using-Gmail-with-XOAUTH2
	* 구글 App 생성: https://console.developers.google.com/project 에서 새프로젝트 생성
	* project app을 생성하면 clientID와 clientSecret 값을 얻는다.
  * phpmailer oauth 설치
```bash
$ cd contribute/PHPMailer/
$ php ~/bin/composer.phar install --dev
$ php ~/bin/composer.phar require league/oauth2-client
$ php ~/bin/composer.phar require league/oauth2-google
```
  * clientID와 clientSecret 값을 이용하여 phpmailer와 google oauth2 연동
```bash
$ cd contribute/PHPMailer/
$ vim get_auth_token.php
```
```vim
$redirectUri = 'http://domain.net/contribute/PHPMailer/get_oauth_token.php';
$clientId = 'google oauth2 clientid';
$clientSecret = 'google oauth2 clientsecret';
```
웹브라우져에서 domain.net/contribute/PHPMailer/get_oauth_token.php 로 접속하면 Refresh Token 값을 알려준다.

  * config/settings.php
```vim
$service['useSMTP'] = true;
$service['smtpHost'] = 'smtp.gmail.com';
$service['smtpPort'] = '587';
$service['smtpSecure'] = 'tls';
$service['useoauth'] = true;
$service['smtpAddress'] = 'test@gmail.com';
$service['smtpUsername'] = '이름';
$service['smtpPassword'] = 'password';
$service['oauthClientId'] = 'google oauth clientId';
$service['oauthClientSecret'] = 'google oauth clientsecret';
$service['oauthRefreshToken'] = 'google oauth and phpmailer refresh token';
```
