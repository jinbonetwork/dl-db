set names utf8;

DROP TABLE IF EXISTS dldb_bookmark;
CREATE TABLE dldb_bookmark (
	`id`		bigint(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`uid`		int(10) NOT NULL DEFAULT 0,
	`did`		bigint(11) NOT NULL DEFAULT 0,
	`regdate`	int(10) NOT NULL DEFAULT 0,

	KEY `UID`(`uid`,`regdate`),
	KEY `DID`(`did`,`regdate`)

) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `dldb_documents`;
CREATE TABLE `dldb_documents` (
	`id`		bigint(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`subject`	char(255),
	`content`	text,
	`memo`		mediumtext,
	`custom`	text,
	`uid`		bigint(11) NOT NULl DEFAULT 0,
	`created`	int(10) NOT NULL DEFAULT 0,
	`f3`		char(255),
	`f4`		char(255),
	`f5`		char(255),
	`f6`		char(255),
	`f7`		char(255),
	`f9`		text,

	KEY `UID`(`uid`)

) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `dldb_options`;
CREATE TABLE `dldb_options` (
	id		int(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	name	char(128),
	value	mediumtext,

	KEY `NAME` (`name`)

) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `dldb_fields`;
CREATE TABLE `dldb_fields` (
	`fid`		int(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`parent`	int(10) NOT NULL DEFAULT 0,
	`idx`		smallint(5) NOT NULL DEFAULT 1,
	`subject`	char(255),
	`iscolumn`	char(1) DEFAULT 0,
	`type`		char(20),
	`multiple`	char(1) DEFAULT 0,
	`required`	char(1) DEFAULT 0,
	`cid`		int(10),
	`form`		char(20),
	`active`	char(1) DEFAULT '1',
	`system`	char(1) DEFAULT '0',

	KEY `IDX` (`parent`,`idx`)

) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `dldb_fields` (`fid`,`parent`,`idx`,`subject`,`iscolumn`,`type`,`multiple`,`required`,`cid`,`form`,`active`,`system`) VALUES (1,0,1,'자료종류','0','taxonomy','0','1',1,'select',1,0);
INSERT INTO `dldb_fields` (`fid`,`parent`,`idx`,`subject`,`iscolumn`,`type`,`multiple`,`required`,`cid`,`form`,`active`,`system`) VALUES (2,0,2,'재판정보','0','group','0','1',0,'fieldset',1,0);
INSERT INTO `dldb_fields` (`fid`,`parent`,`idx`,`subject`,`iscolumn`,`type`,`multiple`,`required`,`cid`,`form`,`active`,`system`) VALUES (3,2,1,'법원','1','char','0','0',0,'text',1,0);
INSERT INTO `dldb_fields` (`fid`,`parent`,`idx`,`subject`,`iscolumn`,`type`,`multiple`,`required`,`cid`,`form`,`active`,`system`) VALUES (4,2,2,'사건번호','1','char','0','1',0,'text',1,0);
INSERT INTO `dldb_fields` (`fid`,`parent`,`idx`,`subject`,`iscolumn`,`type`,`multiple`,`required`,`cid`,`form`,`active`,`system`) VALUES (5,2,3,'판사','1','char','0','0',0,'text',1,0);
INSERT INTO `dldb_fields` (`fid`,`parent`,`idx`,`subject`,`iscolumn`,`type`,`multiple`,`required`,`cid`,`form`,`active`,`system`) VALUES (6,2,4,'검사','1','char','0','0',0,'text',1,0);
INSERT INTO `dldb_fields` (`fid`,`parent`,`idx`,`subject`,`iscolumn`,`type`,`multiple`,`required`,`cid`,`form`,`active`,`system`) VALUES (7,2,5,'변호사','1','char','0','0',0,'text',1,0);
INSERT INTO `dldb_fields` (`fid`,`parent`,`idx`,`subject`,`iscolumn`,`type`,`multiple`,`required`,`cid`,`form`,`active`,`system`) VALUES (8,0,3,'위원회','0','taxonomy','0','0',2,'select',1,0);
INSERT INTO `dldb_fields` (`fid`,`parent`,`idx`,`subject`,`iscolumn`,`type`,`multiple`,`required`,`cid`,`form`,`active`,`system`) VALUES (9,0,4,'주요내용','1','textarea','0','1',0,'textarea',1,1);
INSERT INTO `dldb_fields` (`fid`,`parent`,`idx`,`subject`,`iscolumn`,`type`,`multiple`,`required`,`cid`,`form`,`active`,`system`) VALUES (10,0,5,'자료 실제 작성 연월','0','date','0','1',0,'Ym',1,0);
INSERT INTO `dldb_fields` (`fid`,`parent`,`idx`,`subject`,`iscolumn`,`type`,`multiple`,`required`,`cid`,`form`,`active`,`system`) VALUES (11,0,6,'자료 제공 방식','0','taxonomy','0','1',3,'radio',1,0);
INSERT INTO `dldb_fields` (`fid`,`parent`,`idx`,`subject`,`iscolumn`,`type`,`multiple`,`required`,`cid`,`form`,`active`,`system`) VALUES (12,0,7,'담당자/작성자','0','group','0','1',0,'fieldset',1,0);
INSERT INTO `dldb_fields` (`fid`,`parent`,`idx`,`subject`,`iscolumn`,`type`,`multiple`,`required`,`cid`,`form`,`active`,`system`) VALUES (13,12,1,'이름','0','char','0','1',0,'text',1,0);
INSERT INTO `dldb_fields` (`fid`,`parent`,`idx`,`subject`,`iscolumn`,`type`,`multiple`,`required`,`cid`,`form`,`active`,`system`) VALUES (14,12,2,'기수','0','char','0','1',0,'text',1,0);
INSERT INTO `dldb_fields` (`fid`,`parent`,`idx`,`subject`,`iscolumn`,`type`,`multiple`,`required`,`cid`,`form`,`active`,`system`) VALUES (15,12,3,'이메일','0','char','0','1',0,'text',1,0);
INSERT INTO `dldb_fields` (`fid`,`parent`,`idx`,`subject`,`iscolumn`,`type`,`multiple`,`required`,`cid`,`form`,`active`,`system`) VALUES (16,12,5,'전화번호','0','char','0','1',0,'text',1,0);
INSERT INTO `dldb_fields` (`fid`,`parent`,`idx`,`subject`,`iscolumn`,`type`,`multiple`,`required`,`cid`,`form`,`active`,`system`) VALUES (17,0,8,'표지이미지','0','image','0','0',0,'file',1,0);
INSERT INTO `dldb_fields` (`fid`,`parent`,`idx`,`subject`,`iscolumn`,`type`,`multiple`,`required`,`cid`,`form`,`active`,`system`) VALUES (18,0,9,'첨부파일','0','file','1','0',0,'file',1,0);

DROP TABLE IF EXISTS `dldb_files`;
CREATE TABLE `dldb_files` (
	`fid`		bigint(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`filepath`	char(255),
	`filename`	char(255),
	`mime_type`	char(128),
	`uid`		bigint(11) NOT NULl DEFAULT 0,
	`download`	bigint(128) NOT NULL DEFAULT 0,
	`filesize`	bigint(128) NOT NULL DEFAULT 0,
	`regdate`	int(10),

	KEY `UID`(`uid`),
	KEY `FILENAME`(`filename`)

) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `dldb_log`;
CREATE TABLE `dldb_log` (
	`id`		bigint(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`action`	char(20) not null default '',
	`nid`		int(10) default 0,
	`editor`	int(10) not null default 0,
	`name`		char(255),
	`modified`	int(10) not null default 0,
	`ipaddress`	char(20),
	`memo`		char(255),

	KEY `Action` (`action`,`nid`),
	KEY `Editor` (`editor`)

) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS dldb_user_roles;
CREATE TABLE dldb_user_roles (
	`uid`		int(10) NOT NULL PRIMARY KEY,
	`role`		text,

	KEY  `UID` (`uid`)

) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `dldb_user_roles` (`uid`,`role`) VALUES (4,'a:1:{i:0;i:1;}');

DROP TABLE IF EXISTS `dldb_searchlog`;
CREATE TABLE `dldb_searchlog` (
	`id`		bigint(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`uid`		int(10) NOT NULL DEFAULT 0,
	`keyword`	char(255) NOT NULL DEFAULT '',
	`category`	text,
	`period`	char NOT NULL DEFAULT '',
	`sdate`		int(10) NOT NULL DEFAULT 0,

	KEY `UID`(`uid`,`sdate`)

) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `dldb_taxonomy`;
CREATE TABLE `dldb_taxonomy` (
	`cid`		int(5) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`subject`	char(255) NOT NULL DEFAULT '',
	`skey`		char(1) DEFAULT 0,
	`active`	char(1) DEFAULT 1,

	KEY `SKEY` (`skey`,`cid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `dldb_taxonomy` (`cid`,`subject`,`skey`,`active`) VALUES (1,'자료 종류','1','1');
INSERT INTO `dldb_taxonomy` (`cid`,`subject`,`skey`,`active`) VALUES (2,'위원회','0','1');
INSERT INTO `dldb_taxonomy` (`cid`,`subject`,`skey`,`active`) VALUES (3,'자료 제공 방식','0','1');

DROP TABLE IF EXISTS `dldb_taxonomy_terms`;
CREATE TABLE `dldb_taxonomy_terms` (
	`tid`		int(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`cid`		int(10) NOT NULL DEFAULT 0,
	`parent`	int(10) DEFAULT 0,
	`idx`		smallint(5) NOT NULL DEFAULT 1,
	`nsubs`		smallint(5) DEFAULT 0,
	`name`		char(128) NOT NULL DEFAULT '',
	`current`	char(1) DEFAULT 1,
	`active`	char(1) DEFAULT 1,
	`created`	int(10) NOT NULL DEFAULT 0,

	KEY `TID` (`tid`,`idx`),
	KEY `PID` (`parent`,`idx`)

) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `dldb_taxonomy_terms` (`tid`,`cid`,`parent`,`idx`,`nsubs`,`name`,`current`,`active`,`created`) VALUES (1,1,0,1,0,'판결문','1','1',1476374217);
INSERT INTO `dldb_taxonomy_terms` (`tid`,`cid`,`parent`,`idx`,`nsubs`,`name`,`current`,`active`,`created`) VALUES (2,1,0,2,0,'서면','1','1',1476374217);
INSERT INTO `dldb_taxonomy_terms` (`tid`,`cid`,`parent`,`idx`,`nsubs`,`name`,`current`,`active`,`created`) VALUES (3,1,0,3,0,'자료집.논문','1','1',1476374217);
INSERT INTO `dldb_taxonomy_terms` (`tid`,`cid`,`parent`,`idx`,`nsubs`,`name`,`current`,`active`,`created`) VALUES (4,1,0,4,0,'단행본','1','1',1476374217);
INSERT INTO `dldb_taxonomy_terms` (`tid`,`cid`,`parent`,`idx`,`nsubs`,`name`,`current`,`active`,`created`) VALUES (5,1,0,5,0,'서식','1','1',1476374217);
INSERT INTO `dldb_taxonomy_terms` (`tid`,`cid`,`parent`,`idx`,`nsubs`,`name`,`current`,`active`,`created`) VALUES (6,1,0,6,0,'기타','1','1',1476374217);
INSERT INTO `dldb_taxonomy_terms` (`tid`,`cid`,`parent`,`idx`,`nsubs`,`name`,`current`,`active`,`created`) VALUES (7,2,0,1,0,'기타','1','1',1476374217);
INSERT INTO `dldb_taxonomy_terms` (`tid`,`cid`,`parent`,`idx`,`nsubs`,`name`,`current`,`active`,`created`) VALUES (8,2,0,2,0,'공익인권변론센터','1','1',1476374217);
INSERT INTO `dldb_taxonomy_terms` (`tid`,`cid`,`parent`,`idx`,`nsubs`,`name`,`current`,`active`,`created`) VALUES (9,2,0,3,0,'과거사청산위원회','1','1',1476374217);
INSERT INTO `dldb_taxonomy_terms` (`tid`,`cid`,`parent`,`idx`,`nsubs`,`name`,`current`,`active`,`created`) VALUES (10,2,0,4,0,'교육청소년위원회','1','1',1476374217);
INSERT INTO `dldb_taxonomy_terms` (`tid`,`cid`,`parent`,`idx`,`nsubs`,`name`,`current`,`active`,`created`) VALUES (11,2,0,5,0,'국제연대위원회','1','1',1476374217);
INSERT INTO `dldb_taxonomy_terms` (`tid`,`cid`,`parent`,`idx`,`nsubs`,`name`,`current`,`active`,`created`) VALUES (12,2,0,6,0,'국제통상위원회','1','1',1476374217);
INSERT INTO `dldb_taxonomy_terms` (`tid`,`cid`,`parent`,`idx`,`nsubs`,`name`,`current`,`active`,`created`) VALUES (13,2,0,7,0,'노동위원회','1','1',1476374217);
INSERT INTO `dldb_taxonomy_terms` (`tid`,`cid`,`parent`,`idx`,`nsubs`,`name`,`current`,`active`,`created`) VALUES (14,2,0,8,0,'디지털정보위원회','1','1',1476374217);
INSERT INTO `dldb_taxonomy_terms` (`tid`,`cid`,`parent`,`idx`,`nsubs`,`name`,`current`,`active`,`created`) VALUES (15,2,0,9,0,'미군문제위원회','1','1',1476374217);
INSERT INTO `dldb_taxonomy_terms` (`tid`,`cid`,`parent`,`idx`,`nsubs`,`name`,`current`,`active`,`created`) VALUES (16,2,0,10,0,'민생경제위원회','1','1',1476374217);
INSERT INTO `dldb_taxonomy_terms` (`tid`,`cid`,`parent`,`idx`,`nsubs`,`name`,`current`,`active`,`created`) VALUES (17,2,0,11,0,'사법위원회','1','1',1476374217);
INSERT INTO `dldb_taxonomy_terms` (`tid`,`cid`,`parent`,`idx`,`nsubs`,`name`,`current`,`active`,`created`) VALUES (18,2,0,12,0,'소수자인권위원회','1','1',1476374217);
INSERT INTO `dldb_taxonomy_terms` (`tid`,`cid`,`parent`,`idx`,`nsubs`,`name`,`current`,`active`,`created`) VALUES (19,2,0,13,0,'아동인권위원회','1','1',1476374217);
INSERT INTO `dldb_taxonomy_terms` (`tid`,`cid`,`parent`,`idx`,`nsubs`,`name`,`current`,`active`,`created`) VALUES (20,2,0,14,0,'언론위원회','1','1',1476374217);
INSERT INTO `dldb_taxonomy_terms` (`tid`,`cid`,`parent`,`idx`,`nsubs`,`name`,`current`,`active`,`created`) VALUES (21,2,0,15,0,'여성인권위원회','1','1',1476374217);
INSERT INTO `dldb_taxonomy_terms` (`tid`,`cid`,`parent`,`idx`,`nsubs`,`name`,`current`,`active`,`created`) VALUES (22,2,0,16,0,'통일위원회','1','1',1476374217);
INSERT INTO `dldb_taxonomy_terms` (`tid`,`cid`,`parent`,`idx`,`nsubs`,`name`,`current`,`active`,`created`) VALUES (23,2,0,17,0,'환경보건위원회','1','1',1476374217);
INSERT INTO `dldb_taxonomy_terms` (`tid`,`cid`,`parent`,`idx`,`nsubs`,`name`,`current`,`active`,`created`) VALUES (24,3,0,1,0,'열람','1','1',1476374217);
INSERT INTO `dldb_taxonomy_terms` (`tid`,`cid`,`parent`,`idx`,`nsubs`,`name`,`current`,`active`,`created`) VALUES (25,3,0,2,0,'다운로드','1','1',1476374217);

DROP TABLE IF EXISTS `dldb_taxonomy_term_relative`;
CREATE TABLE `dldb_taxonomy_term_relative` (
	`tid`		int(10) NOT NULL DEFAULT 0,
	`did`		int(10) NOT NULL DEFAULT 0,

	PRIMARY KEY `TID` (`tid`,`did`)

) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `dldb_members`;
CREATE TABLE `dldb_members` (
	`id`		int(10) PRIMARY KEY AUTO_INCREMENT,
	`name`		char(128) NOT NULL DEFAULT '',
	`class`		smallint(5) NOT NULL DEFAULT 0,
	`email`		char(255),
	`phone`		char(15),

	KEY `NAME` (`name`),
	KEY `CLASS` (`class`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
