# dl-db
민변디지털도서관 데이터베이스

1. 소개
======

이 프로젝트는 민변디지털도서관 시스템을 구축하기위해 추진되었습니다. 하지만 다양한 용도로 재활용될 수 있도록 범용적으로 구축하였습니다.

이 프로젝트는 기본적으로 자료(PDF,HWP,DOC,DOCX) 검색시스템입니다. 자료들을 유연한 필드관리시스템과 분류시스템을 통해 체계적으로 자료정리를 할 수 있도록 지원하며, 첨부파일 검색을 지원합니다.

이 프로젝트는 React + PHP 기반으로 제작된 검색플랫폼입니다.

이 검색플랫폼은 매우 개방적인 시스템입니다. 이 플랫폼은 자체 회원시스템(회원가입 / 로그인) 을 가지지 않습니다. 대신 Xpress Engine(Xe) 또는 GNU Board 5(gnu5) 회원시스템과 연동하도록 설계되었습니다. 따라서 게시판 등 다른 서비스와 충돌없이 쉽게 연동하여 사용할 수 있습니다.

검색은 MySQL fulltext(mecab plugin 설치) 검색 또는 ElasticSearch 검색 두가지를 지원합니다. 두가지 모두 한글형태소분석기 프로젝트인 '은전한닢 프로젝트'를 사용하여 검색인덱싱을 제공합니다.

ElasticSearch를 사용할 경우 ElasticSearch 2.4.0 을 설치하셔야 합니다.

첨부파일 검색을 위해 PDFParser 같은 text 추출기 라이브러리를 사용합니다.
아래한글 2010 버젼 이하버젼이나 Scanned PDF Format(이미지형태의 PDF), 그리고 암호화된 파일들은 자동으로 Parsing할수 없습니다. 이를 위해 수동으로 자료를 수정할 수 있는 UI를 제공합니다.

2. Requirement
==============
* NodeJs-5.5 이상
* PHP 5.6 이상 & composer(PHP 패키지관리 툴)
* mecab-ko-dic-2.0.1
* MySQL Fulltext 검색을 사용할 경우: MySQL 5.7.0 이상
* ElasticSearch를 검색엔진으로 사용할 경우: ElasticSearch 2.4.0 설치에 필요한 OpenJDK-1.8

3. 브라우저 호환성
=================
|       | Firefox | Chrome | IE | Edge | Safari | Opera | Android | Chrome for Android |
|:-----:|:------:|:-----:|:------:|:------:|:-----:|:-----:|:------:|:-----:|
| axios | 45 | 48 | 9, 10, 11 |14 | 9 |
| formData | 4 | 7 | 10 | | 5 |12 | 3 | yes |


4. 설치
======

이 이스슽은 다른 오픈소스 프로젝트들을 서브모듀로 가지고 있습니다. 따라서 gil clone으로 소스를 다운받을 시, --recursive 옵션으로 설치하셔야 합니다.

현재는 설치 페이지를 별도로 제공하지 않습니다. 몇몇 단계로 나누어 수동으로 설치하셔야 합니다.

1) Apache 설정
--------------
* 이 시스템은 웹서버 rewrite module을 사용합니다. 이 사이트가 rewrite module을 사용할 수 있도록 웹서버 설정을 해주세요.

2) mysqlDB 생성
--------------
* 단체협약데이터베이스 시스템은 현재 MySQL 만 지원합니다.
* 사용하실 MySQL DB를 수동으로 만드셔야 합니다.
* install/sql/schema.sql 파일을 이용해서 새로 생성된 DB에 필요한 테이블을 생성합니다.

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
* react 소스는 각 테마안에 있습니다.
```bash
$ cd themes/minbyun/dev
$ npm install
$ npm run build
```

6) Composer 설치
---------------
* 추가 라이브러리를 설치하려면 Composer가 필요합니다.
```bash
$ cd
$ mkdir bin (계정 홈 밑에 bin 폴더 생성)
$ cd bin
$ curl -sS https://getcomposer.org/installer | php
```
* bin 폴더에 composer.phar가 설치됩니다.

7) pdfparser 설치
-----------------
* pdf 철부파일 검색을 위한 pdfparser 설치
```bash
$ cd contribute/pdfparser
$ php ~/bin/composer.phar install --dev
```

8) Mecab-ko 설치
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

9) MySQL FullText로 검색할 경우
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

10) ElasticSearch 을 사용할 경우
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
* libMeCab 설치
```bash
$ cd /usr/local/src
$ wget https://bitbucket.org/eunjeon/mecab-java/downloads/mecab-java-0.996.tar.gz
$ tar xzvpf mecab-java-0.996.tar.gz
$ cd mecab-java-0.996
$ vi Makefile
```
```vim
/* java jdk 경로를 잡아준다. */
INCLUDE=/usr/lib/jvm/java-1.8.0-openjdk.x86_64/include
/* open-jdk의 경우 O3 -> O1 로 수정 */
$(CXX) -O1 -c -fpic $(TARGET)_wrap.cxx  $(INC)
/* -cp . 추가 */
(JAVAC) -cp . test.java
```
```bash
$ make
$ cp libMeCab.so /usr/local/lib/.
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
$ export LD_LIBRARY_PATH=/usr/local/lib; ./bin/elasticsearch -Des.security.manager.enabled=false
```


