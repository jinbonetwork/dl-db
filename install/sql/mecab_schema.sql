set names utf8;

DROP TABLE IF EXISTS dldb_bookmark;
CREATE TABLE dldb_bookmark (
	`bid`		bigint(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`uid`		int(10) NOT NULL DEFAULT 0,
	`did`		bigint(11) NOT NULL DEFAULT 0,
	`regdate`	int(10) NOT NULL DEFAULT 0,

	KEY `UID`(`uid`,`regdate`),
	KEY `DID`(`did`,`regdate`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `dldb_documents`;
CREATE TABLE `dldb_documents` (
	`id`		bigint(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`subject`	char(255),
	`content`	text,
	`memo`		mediumtext,
	`custom`	text,
	`uid`		bigint(11) NOT NULL DEFAULT 0,
	`created`	int(10) NOT NULL DEFAULT 0,

	KEY `UID`(`uid`),
	FULLTEXT `skey` (`subject`,`content`,`memo`) WITH PARSER mecab

) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `dldb_options`;
CREATE TABLE `dldb_options` (
	id		int(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	name	char(128),
	value	mediumtext,

	KEY `NAME` (`name`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `dldb_fields`;
CREATE TABLE `dldb_fields` (
	`fid`		int(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`tables`	char(80) NOT NULL DEFAULT '',
	`parent`	int(10) NOT NULL DEFAULT 0,
	`idx`		smallint(5) NOT NULL DEFAULT 1,
	`slug`		char(128),
	`subject`	char(255),
	`iscolumn`	char(1) DEFAULT 0,
	`type`		char(20),
	`multiple`	char(1) DEFAULT 0,
	`required`	char(1) DEFAULT 0,
	`cid`		int(10),
	`form`		char(20),
	`active`	char(1) DEFAULT '1',
	`system`	char(1) DEFAULT '0',
	`indextype`	char(128) DEFAULT 'none',
	`sefield`	char(1) DEFAULT '0',

	KEY `IDX` (`tables`,`parent`,`idx`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `dldb_files`;
CREATE TABLE `dldb_files` (
	`fid`		bigint(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`did`		bigint(11) NOT NULL DEFAULT 0,
	`filepath`	char(255),
	`filename`	char(255),
	`mimetype`	char(128),
	`uid`		bigint(11) NOT NULl DEFAULT 0,
	`download`	bigint(128) NOT NULL DEFAULT 0,
	`filesize`	bigint(128) NOT NULL DEFAULT 0,
	`regdate`	int(10),
	`status`	char(15) NOT NULL DEFAULT 'uploaded',
	`textsize`	int(10) NOT NULL DEFAULT 0,
	`text`		mediumtext,
	`header`	text,

	KEY `UID`(`uid`),
	KEY `DID`(`did`),
	KEY `FILENAME`(`filename`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `dldb_history`;
CREATE TABLE `dldb_history` (
	`hid`			bigint(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`uid`			bigint(11) NOT NULl DEFAULT 0,
	`hash`			char(128) NOT NULL DEFAULT '',
	`query`			char(255),
	`options`		text,
	`search_date`	int(10),
	`query_string`	text,

	KEY `UID`(`uid`,`hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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

) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS dldb_user_roles;
CREATE TABLE dldb_user_roles (
	`uid`		int(10) NOT NULL PRIMARY KEY,
	`role`		text,

	KEY  `UID` (`uid`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `dldb_searchlog`;
CREATE TABLE `dldb_searchlog` (
	`id`		bigint(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`uid`		int(10) NOT NULL DEFAULT 0,
	`keyword`	char(255) NOT NULL DEFAULT '',
	`category`	text,
	`period`	char NOT NULL DEFAULT '',
	`sdate`		int(10) NOT NULL DEFAULT 0,

	KEY `UID`(`uid`,`sdate`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `dldb_taxonomy`;
CREATE TABLE `dldb_taxonomy` (
	`cid`		int(5) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`subject`	char(255) NOT NULL DEFAULT '',
	`skey`		char(1) DEFAULT 0,
	`active`	char(1) DEFAULT 1,

	KEY `SKEY` (`skey`,`cid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `dldb_taxonomy_terms`;
CREATE TABLE `dldb_taxonomy_terms` (
	`tid`		int(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`cid`		int(10) NOT NULL DEFAULT 0,
	`parent`	int(10) DEFAULT 0,
	`idx`		smallint(5) NOT NULL DEFAULT 1,
	`nsubs`		smallint(5) DEFAULT 0,
	`name`		char(128) NOT NULL DEFAULT '',
	`slug`		char(128),
	`current`	char(1) DEFAULT 1,
	`active`	char(1) DEFAULT 1,
	`created`	int(10) NOT NULL DEFAULT 0,

	KEY `TID` (`tid`,`idx`),
	KEY `PID` (`parent`,`idx`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `dldb_taxonomy_term_relative`;
CREATE TABLE `dldb_taxonomy_term_relative` (
	`tid`		int(10) NOT NULL DEFAULT 0,
	`tables`	char(80) NOT NULL DEFAULT '',
	`did`		int(10) NOT NULL DEFAULT 0,

	PRIMARY KEY `TID` (`tid`,`tables`,`did`),
	KEY `DID` (`tables`,`did`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `dldb_members`;
CREATE TABLE `dldb_members` (
	`id`		int(10) PRIMARY KEY AUTO_INCREMENT,
	`uid`		int(10) NOT NULL DEFAULT 0,
	`name`		char(128) NOT NULL DEFAULT '',
	`class`		char(20) NOT NULL DEFAULT '',
	`email`		char(255),
	`phone`		char(30),
	`custom`	text,
	`license`	char(1) DEFAULT '0',

	KEY `UID` (`uid`),
	KEY `NAME` (`name`),
	KEY `CLASS` (`class`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `dldb_member_auth`;
CREATE TABLE `dldb_member_auth` (
	`id`		int(10) PRIMARY KEY AUTO_INCREMENT,
	`email`		char(255) NOT NULL DEFAULT '',
	`auth`		char(255) NOT NULL DEFAULT '',
	`data`		text,
	`regdate`	int(10) NOT NULL DEFAULT 0,

	KEY `AUTH` (`auth`),
	KEY `EMAIL` (`email`),
	KEY `EMAIL_AUTH` (`email`,`auth`),
	KEY `REGDATE` (`regdate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `dldb_file_filter`;
CREATE TABLE `dldb_file_filter` (
	`id`		int(10) PRIMARY KEY AUTO_INCREMENT,
	`ext`		char(10) NOT NULL DEFAULT '',
	`field`		char(128),
	`pattern`	char(256),

	KEY `EXT` (`ext`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
