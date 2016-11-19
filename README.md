# dl-db
민변디지털도서관 데이터베이스

3. 소개
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
* files 폴더를 웹서버가 접근할 수 있도록 707 권한 부여.

4) XE 설치
----------
* xe 폴더에 files 폴더 생성. 웹서버가 접근할 수 있도록 707 권한 부여.
* http://domain/xe 에 접속하여 XE 설치

5) React 코드 설정
-----------------
* react 소스는 각 테마안에 있습니다.
* cd themes/minbyun/dev
* 'npm install' 실행하여 필요한 nodejs package 설치
* 'webpack' 실행.

6) pdfparser 설치
-----------------
* pdf 철부파일 검색을 위한 pdfparser 설치
```
cd contribute/pdfparser
php ~/bin/composer.phar install --dev
```

7) Elastic Search 설치
---------------------
* 검색엔진 설치
