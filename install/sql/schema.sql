DROP TABLE IF EXISTS `dl_agreement`;
CREATE TABLE `dl_documents` (
	id     int(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	subject char(255),
	content text,
	custom  text,
	created int(10) NOT NULL DEFAULT 0

) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `dl_options`;
CREATE TABLE `dl_options` (
	id		int(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	name	char(128),
	value	mediumtext,

	KEY `NAME` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `dl_fields`;
CREATE TABLE `dl_fields` (
	`fid`		int(10) NOT NULL AUTO_INCREMENT,
	`table`		char(128) NOT NULL DEFAULT '',
	`parent`	int(10) NOT NULL DEFAULT 0,
	`idx`		smallint(5) NOT NULL DEFAULT 1,
	`subject`	char(255),
	`iscolumn`	char(1) DEFAULT 0,
	`type`		char(20),
	`multiple`	char(1) DEFAULT 0,
	`required`	char(1) DEFAULT 0,
	`cid`		int(10),
	`active`	char(1) DEFAULT '1',
	`system`	char(1) DEFAULT '0',
	`autocomplete` char(1) DEFAULT '0',
	`indextype`	char(128) DEFAULT 'none',

	PRIMARY KEY (`table`,`idx`,`fid`),
	KEY `FID` (`table`,`fid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `dl_log`;
CREATE TABLE `dl_log` (
	`id`		bigint(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`action`	char(20) not null default '',
	`nid`		int(10) default 0,
	`editor`	int(10) not null default 0,
	`name`		char(255),
	`modified`	int(10) not null default 0,
	`ipaddress`	char(20),
	`memo`		char(255),

	KEY `Action` (`action`,`oid`,`fid`,`vid`),
	KEY `Editor` (`editor`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS dl_privilege;
CREATE TABLE dl_privilege (
	`uid`		int(10) NOT NULL PRIMARY KEY,
	`user_id`	char(255) NOT NULL DEFAULT '',
	`oid`		int(10) NOT NULL DEFAULT 0,
	`role`		smallint(5) NOT NULL DEFAULT 5,

	KEY `USER_ID` (`user_id`),
	KEY `OID` (`oid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `dl_taxonomy`;
CREATE TABLE `dl_taxonomy` (
	`cid`		int(5) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`subject`	char(255) NOT NULL DEFAULT '',
	`skey`		char(1) DEFAULT 0,
	`active`	char(1) DEFAULT 1,

	KEY `SKEY` (`skey`,`cid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `dl_taxonomy_terms`;
CREATE TABLE `dl_taxonomy_terms` (
	`vid`		int(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`tid`		int(10) NOT NULL DEFAULT 0,
	`cid`		int(10) NOT NULL DEFAULT 0,
	`parent`	int(10) DEFAULT 0,
	`idx`		smallint(5) NOT NULL DEFAULT 1,
	`nsubs`		smallint(5) DEFAULT 0,
	`name`		char(128) NOT NULL DEFAULT '',
	`current`	char(1) DEFAULT 1,
	`active`	char(1) DEFAULT 1,
	`from`		int(10) DEFAULT 0,
	`to`		int(10) DEFAULT 0,
	`created`	int(10) NOT NULL DEFAULT 0,

	KEY `TID` (`tid`,`vid`,`idx`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `dl_taxonomy_term_relative`;
CREATE TABLE `dl_taxonomy_term_relative` (
	`tid`		int(10) NOT NULL DEFAULT 0,
	`table`		char(128) NOT NULL DEFAULT '',
	`rid`		int(10) NOT NULL DEFAULT 0,
	`fid`		smallint(5) NOT NULL DEFAULT 0,

	PRIMARY KEY `TID` (`tid`,`table`,`rid`),
	KEY `FID` (`table`,`rid`,`fid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
