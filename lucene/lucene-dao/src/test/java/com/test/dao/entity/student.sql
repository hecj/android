/*
Navicat MySQL Data Transfer

Source Server         : hecj
Source Server Version : 50130
Source Host           : localhost:3306
Source Database       : hecj

Target Server Type    : MYSQL
Target Server Version : 50130
File Encoding         : 65001

Date: 2014-10-27 22:53:16
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `student`
-- ----------------------------
DROP TABLE IF EXISTS `student`;
CREATE TABLE `student` (
  `id` int(15) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `age` int(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of student
-- ----------------------------
INSERT INTO `student` VALUES ('1', '1', '1');
INSERT INTO `student` VALUES ('2', '2', '2');
