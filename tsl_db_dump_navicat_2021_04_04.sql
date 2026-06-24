/*
Navicat MySQL Data Transfer

Source Server         : MySQL 8
Source Server Version : 80023
Source Host           : localhost:3307
Source Database       : tsl2

Target Server Type    : MYSQL
Target Server Version : 80023
File Encoding         : 65001

Date: 2021-04-04 11:38:16
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for charter
-- ----------------------------
DROP TABLE IF EXISTS `charter`;
CREATE TABLE `charter` (
  `club_id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(64) CHARACTER SET utf16 COLLATE utf16_general_ci DEFAULT NULL,
  `nick_name` varchar(128) NOT NULL,
  `contact1_user_id` bigint DEFAULT NULL,
  `contact2_user_id` bigint DEFAULT NULL,
  `country_code` varchar(3) NOT NULL,
  `state_or_province` varchar(255) NOT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(128) NOT NULL,
  `updated_date` timestamp NULL DEFAULT '1970-01-01 02:00:01',
  `updated_by` varchar(128) NOT NULL,
  PRIMARY KEY (`club_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

-- ----------------------------
-- Records of charter
-- ----------------------------

-- ----------------------------
-- Table structure for competitor
-- ----------------------------
DROP TABLE IF EXISTS `competitor`;
CREATE TABLE `competitor` (
  `competitor_id` bigint NOT NULL AUTO_INCREMENT,
  `contest_id` bigint NOT NULL,
  `event_id` bigint NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `first_name` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `last_name` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `gear_json` varchar(255) DEFAULT NULL,
  `competitor_type_id` int DEFAULT NULL,
  PRIMARY KEY (`competitor_id`),
  KEY `fk_competitor_type` (`competitor_type_id`) USING BTREE,
  KEY `competitor_fk_contest` (`contest_id`),
  KEY `competitor_fk_event` (`event_id`),
  CONSTRAINT `competitor_fk_contest` FOREIGN KEY (`contest_id`) REFERENCES `contest` (`contest_id`) ON DELETE RESTRICT,
  CONSTRAINT `competitor_fk_event` FOREIGN KEY (`event_id`) REFERENCES `fight_event` (`event_id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of competitor
-- ----------------------------

-- ----------------------------
-- Table structure for competitor_type_lu
-- ----------------------------
DROP TABLE IF EXISTS `competitor_type_lu`;
CREATE TABLE `competitor_type_lu` (
  `competitor_type_id` int NOT NULL,
  `description` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  PRIMARY KEY (`competitor_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of competitor_type_lu
-- ----------------------------

-- ----------------------------
-- Table structure for contact
-- ----------------------------
DROP TABLE IF EXISTS `contact`;
CREATE TABLE `contact` (
  `contact_id` bigint NOT NULL AUTO_INCREMENT,
  `location_id` int DEFAULT NULL,
  `first_name` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `last_name` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `middle_initial` varchar(16) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `name_prefix` varchar(8) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `name_suffix` varchar(8) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `primary_phone_area_code` tinyint DEFAULT NULL,
  `primary_phone_rest` mediumint DEFAULT NULL,
  `secondary_phone_area_code` tinyint DEFAULT NULL,
  `secondary_phone_rest` mediumint DEFAULT NULL,
  `email1` varchar(64) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `email2` varchar(64) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `social_media_1` varchar(64) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `social_media_2` varchar(64) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `url1` varchar(256) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `url2` varchar(256) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`contact_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of contact
-- ----------------------------

-- ----------------------------
-- Table structure for contest
-- ----------------------------
DROP TABLE IF EXISTS `contest`;
CREATE TABLE `contest` (
  `contest_id` bigint NOT NULL,
  `event_id` bigint DEFAULT NULL,
  `competitors_json` json NOT NULL,
  `results_json` json NOT NULL,
  `age_division_id` int DEFAULT NULL,
  `created_by` varchar(31) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `created_date` date NOT NULL,
  `current_heat_id` int DEFAULT NULL,
  `current_heat_index` int DEFAULT NULL,
  `event_type_code` varchar(16) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `media_links_json` varchar(255) DEFAULT NULL,
  `is_active` int NOT NULL,
  `is_cancelled` int DEFAULT NULL,
  `staff_json` varchar(1000) DEFAULT NULL,
  `location_json` varchar(1000) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `male_or_female` varchar(1) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `modified_by` varchar(31) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `modified_date` date NOT NULL,
  `number_of_heats` int DEFAULT NULL,
  `original_end_time` date DEFAULT NULL,
  `original_start_time` date NOT NULL,
  `primary_contact_id` int DEFAULT NULL,
  `pushed_back_end_time` date DEFAULT NULL,
  `pushed_back_start_time` date DEFAULT NULL,
  PRIMARY KEY (`contest_id`),
  UNIQUE KEY `contest_id` (`contest_id`) USING BTREE,
  KEY `event_id` (`event_id`),
  CONSTRAINT `contest_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `fight_event` (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of contest
-- ----------------------------

-- ----------------------------
-- Table structure for contest_heat
-- ----------------------------
DROP TABLE IF EXISTS `contest_heat`;
CREATE TABLE `contest_heat` (
  `heat_id` bigint NOT NULL AUTO_INCREMENT,
  `event_id` bigint NOT NULL,
  `contest_id` bigint NOT NULL,
  `is_currently_being_run` int DEFAULT NULL,
  `original_start_time` datetime DEFAULT NULL,
  `original_end_time` datetime DEFAULT NULL,
  `pushed_back_start_time` datetime DEFAULT NULL,
  `pushed_back_end_time` datetime DEFAULT NULL,
  `heat_index` int DEFAULT NULL,
  `next_heat_id` int DEFAULT NULL,
  `judging_panel_id` int DEFAULT NULL,
  `all_judges_finished_scoring` int DEFAULT NULL,
  `num_judges_wanting_more` int DEFAULT NULL,
  `has_mixed_divisions` int DEFAULT NULL,
  `created_by` varchar(128) NOT NULL,
  `created_date` varchar(128) NOT NULL,
  `updated_by` varchar(128) NOT NULL,
  `updated_date` varchar(128) NOT NULL,
  PRIMARY KEY (`heat_id`),
  KEY `heat_fk_contest` (`contest_id`),
  KEY `heat_fk_event` (`event_id`),
  CONSTRAINT `heat_fk_contest` FOREIGN KEY (`contest_id`) REFERENCES `contest` (`contest_id`),
  CONSTRAINT `heat_fk_event` FOREIGN KEY (`event_id`) REFERENCES `fight_event` (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of contest_heat
-- ----------------------------

-- ----------------------------
-- Table structure for country_lu
-- ----------------------------
DROP TABLE IF EXISTS `country_lu`;
CREATE TABLE `country_lu` (
  `country_id` int NOT NULL AUTO_INCREMENT,
  `iso2` char(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `short_name` varchar(80) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `long_name` varchar(80) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `iso3` varchar(3) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `numcode` varchar(6) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `un_member` varchar(12) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `calling_code` varchar(8) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `cctld` varchar(5) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`country_id`),
  KEY `iso3` (`iso3`)
) ENGINE=InnoDB AUTO_INCREMENT=251 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of country_lu
-- ----------------------------
INSERT INTO `country_lu` VALUES ('1', 'AF', 'Afghanistan', 'Islamic Republic of Afghanistan', 'AFG', '004', 'yes', '93', '.af', '1');
INSERT INTO `country_lu` VALUES ('2', 'AX', 'Aland Islands', '&Aring;land Islands', 'ALA', '248', 'no', '358', '.ax', '1');
INSERT INTO `country_lu` VALUES ('3', 'AL', 'Albania', 'Republic of Albania', 'ALB', '008', 'yes', '355', '.al', '1');
INSERT INTO `country_lu` VALUES ('4', 'DZ', 'Algeria', 'People\'s Democratic Republic of Algeria', 'DZA', '012', 'yes', '213', '.dz', '1');
INSERT INTO `country_lu` VALUES ('5', 'AS', 'American Samoa', 'American Samoa', 'ASM', '016', 'no', '1+684', '.as', '1');
INSERT INTO `country_lu` VALUES ('6', 'AD', 'Andorra', 'Principality of Andorra', 'AND', '020', 'yes', '376', '.ad', '1');
INSERT INTO `country_lu` VALUES ('7', 'AO', 'Angola', 'Republic of Angola', 'AGO', '024', 'yes', '244', '.ao', '1');
INSERT INTO `country_lu` VALUES ('8', 'AI', 'Anguilla', 'Anguilla', 'AIA', '660', 'no', '1+264', '.ai', '1');
INSERT INTO `country_lu` VALUES ('9', 'AQ', 'Antarctica', 'Antarctica', 'ATA', '010', 'no', '672', '.aq', '1');
INSERT INTO `country_lu` VALUES ('10', 'AG', 'Antigua and Barbuda', 'Antigua and Barbuda', 'ATG', '028', 'yes', '1+268', '.ag', '1');
INSERT INTO `country_lu` VALUES ('11', 'AR', 'Argentina', 'Argentine Republic', 'ARG', '032', 'yes', '54', '.ar', '1');
INSERT INTO `country_lu` VALUES ('12', 'AM', 'Armenia', 'Republic of Armenia', 'ARM', '051', 'yes', '374', '.am', '1');
INSERT INTO `country_lu` VALUES ('13', 'AW', 'Aruba', 'Aruba', 'ABW', '533', 'no', '297', '.aw', '1');
INSERT INTO `country_lu` VALUES ('14', 'AU', 'Australia', 'Commonwealth of Australia', 'AUS', '036', 'yes', '61', '.au', '1');
INSERT INTO `country_lu` VALUES ('15', 'AT', 'Austria', 'Republic of Austria', 'AUT', '040', 'yes', '43', '.at', '1');
INSERT INTO `country_lu` VALUES ('16', 'AZ', 'Azerbaijan', 'Republic of Azerbaijan', 'AZE', '031', 'yes', '994', '.az', '1');
INSERT INTO `country_lu` VALUES ('17', 'BS', 'Bahamas', 'Commonwealth of The Bahamas', 'BHS', '044', 'yes', '1+242', '.bs', '1');
INSERT INTO `country_lu` VALUES ('18', 'BH', 'Bahrain', 'Kingdom of Bahrain', 'BHR', '048', 'yes', '973', '.bh', '1');
INSERT INTO `country_lu` VALUES ('19', 'BD', 'Bangladesh', 'People\'s Republic of Bangladesh', 'BGD', '050', 'yes', '880', '.bd', '1');
INSERT INTO `country_lu` VALUES ('20', 'BB', 'Barbados', 'Barbados', 'BRB', '052', 'yes', '1+246', '.bb', '1');
INSERT INTO `country_lu` VALUES ('21', 'BY', 'Belarus', 'Republic of Belarus', 'BLR', '112', 'yes', '375', '.by', '1');
INSERT INTO `country_lu` VALUES ('22', 'BE', 'Belgium', 'Kingdom of Belgium', 'BEL', '056', 'yes', '32', '.be', '1');
INSERT INTO `country_lu` VALUES ('23', 'BZ', 'Belize', 'Belize', 'BLZ', '084', 'yes', '501', '.bz', '1');
INSERT INTO `country_lu` VALUES ('24', 'BJ', 'Benin', 'Republic of Benin', 'BEN', '204', 'yes', '229', '.bj', '1');
INSERT INTO `country_lu` VALUES ('25', 'BM', 'Bermuda', 'Bermuda Islands', 'BMU', '060', 'no', '1+441', '.bm', '1');
INSERT INTO `country_lu` VALUES ('26', 'BT', 'Bhutan', 'Kingdom of Bhutan', 'BTN', '064', 'yes', '975', '.bt', '1');
INSERT INTO `country_lu` VALUES ('27', 'BO', 'Bolivia', 'Plurinational State of Bolivia', 'BOL', '068', 'yes', '591', '.bo', '1');
INSERT INTO `country_lu` VALUES ('28', 'BQ', 'Bonaire, Sint Eustatius and Saba', 'Bonaire, Sint Eustatius and Saba', 'BES', '535', 'no', '599', '.bq', '1');
INSERT INTO `country_lu` VALUES ('29', 'BA', 'Bosnia and Herzegovina', 'Bosnia and Herzegovina', 'BIH', '070', 'yes', '387', '.ba', '1');
INSERT INTO `country_lu` VALUES ('30', 'BW', 'Botswana', 'Republic of Botswana', 'BWA', '072', 'yes', '267', '.bw', '1');
INSERT INTO `country_lu` VALUES ('31', 'BV', 'Bouvet Island', 'Bouvet Island', 'BVT', '074', 'no', 'NONE', '.bv', '1');
INSERT INTO `country_lu` VALUES ('32', 'BR', 'Brazil', 'Federative Republic of Brazil', 'BRA', '076', 'yes', '55', '.br', '1');
INSERT INTO `country_lu` VALUES ('33', 'IO', 'British Indian Ocean Territory', 'British Indian Ocean Territory', 'IOT', '086', 'no', '246', '.io', '1');
INSERT INTO `country_lu` VALUES ('34', 'BN', 'Brunei', 'Brunei Darussalam', 'BRN', '096', 'yes', '673', '.bn', '1');
INSERT INTO `country_lu` VALUES ('35', 'BG', 'Bulgaria', 'Republic of Bulgaria', 'BGR', '100', 'yes', '359', '.bg', '1');
INSERT INTO `country_lu` VALUES ('36', 'BF', 'Burkina Faso', 'Burkina Faso', 'BFA', '854', 'yes', '226', '.bf', '1');
INSERT INTO `country_lu` VALUES ('37', 'BI', 'Burundi', 'Republic of Burundi', 'BDI', '108', 'yes', '257', '.bi', '1');
INSERT INTO `country_lu` VALUES ('38', 'KH', 'Cambodia', 'Kingdom of Cambodia', 'KHM', '116', 'yes', '855', '.kh', '1');
INSERT INTO `country_lu` VALUES ('39', 'CM', 'Cameroon', 'Republic of Cameroon', 'CMR', '120', 'yes', '237', '.cm', '1');
INSERT INTO `country_lu` VALUES ('40', 'CA', 'Canada', 'Canada', 'CAN', '124', 'yes', '1', '.ca', '1');
INSERT INTO `country_lu` VALUES ('41', 'CV', 'Cape Verde', 'Republic of Cape Verde', 'CPV', '132', 'yes', '238', '.cv', '1');
INSERT INTO `country_lu` VALUES ('42', 'KY', 'Cayman Islands', 'The Cayman Islands', 'CYM', '136', 'no', '1+345', '.ky', '1');
INSERT INTO `country_lu` VALUES ('43', 'CF', 'Central African Republic', 'Central African Republic', 'CAF', '140', 'yes', '236', '.cf', '1');
INSERT INTO `country_lu` VALUES ('44', 'TD', 'Chad', 'Republic of Chad', 'TCD', '148', 'yes', '235', '.td', '1');
INSERT INTO `country_lu` VALUES ('45', 'CL', 'Chile', 'Republic of Chile', 'CHL', '152', 'yes', '56', '.cl', '1');
INSERT INTO `country_lu` VALUES ('46', 'CN', 'China', 'People\'s Republic of China', 'CHN', '156', 'yes', '86', '.cn', '1');
INSERT INTO `country_lu` VALUES ('47', 'CX', 'Christmas Island', 'Christmas Island', 'CXR', '162', 'no', '61', '.cx', '1');
INSERT INTO `country_lu` VALUES ('48', 'CC', 'Cocos (Keeling) Islands', 'Cocos (Keeling) Islands', 'CCK', '166', 'no', '61', '.cc', '1');
INSERT INTO `country_lu` VALUES ('49', 'CO', 'Colombia', 'Republic of Colombia', 'COL', '170', 'yes', '57', '.co', '1');
INSERT INTO `country_lu` VALUES ('50', 'KM', 'Comoros', 'Union of the Comoros', 'COM', '174', 'yes', '269', '.km', '1');
INSERT INTO `country_lu` VALUES ('51', 'CG', 'Congo', 'Republic of the Congo', 'COG', '178', 'yes', '242', '.cg', '1');
INSERT INTO `country_lu` VALUES ('52', 'CK', 'Cook Islands', 'Cook Islands', 'COK', '184', 'some', '682', '.ck', '1');
INSERT INTO `country_lu` VALUES ('53', 'CR', 'Costa Rica', 'Republic of Costa Rica', 'CRI', '188', 'yes', '506', '.cr', '1');
INSERT INTO `country_lu` VALUES ('54', 'CI', 'Cote d\'ivoire (Ivory Coast)', 'Republic of C&ocirc;te D\'Ivoire (Ivory Coast)', 'CIV', '384', 'yes', '225', '.ci', '1');
INSERT INTO `country_lu` VALUES ('55', 'HR', 'Croatia', 'Republic of Croatia', 'HRV', '191', 'yes', '385', '.hr', '1');
INSERT INTO `country_lu` VALUES ('56', 'CU', 'Cuba', 'Republic of Cuba', 'CUB', '192', 'yes', '53', '.cu', '1');
INSERT INTO `country_lu` VALUES ('57', 'CW', 'Curacao', 'Cura&ccedil;ao', 'CUW', '531', 'no', '599', '.cw', '1');
INSERT INTO `country_lu` VALUES ('58', 'CY', 'Cyprus', 'Republic of Cyprus', 'CYP', '196', 'yes', '357', '.cy', '1');
INSERT INTO `country_lu` VALUES ('59', 'CZ', 'Czech Republic', 'Czech Republic', 'CZE', '203', 'yes', '420', '.cz', '1');
INSERT INTO `country_lu` VALUES ('60', 'CD', 'Democratic Republic of the Congo', 'Democratic Republic of the Congo', 'COD', '180', 'yes', '243', '.cd', '1');
INSERT INTO `country_lu` VALUES ('61', 'DK', 'Denmark', 'Kingdom of Denmark', 'DNK', '208', 'yes', '45', '.dk', '1');
INSERT INTO `country_lu` VALUES ('62', 'DJ', 'Djibouti', 'Republic of Djibouti', 'DJI', '262', 'yes', '253', '.dj', '1');
INSERT INTO `country_lu` VALUES ('63', 'DM', 'Dominica', 'Commonwealth of Dominica', 'DMA', '212', 'yes', '1+767', '.dm', '1');
INSERT INTO `country_lu` VALUES ('64', 'DO', 'Dominican Republic', 'Dominican Republic', 'DOM', '214', 'yes', '1+809, 8', '.do', '1');
INSERT INTO `country_lu` VALUES ('65', 'EC', 'Ecuador', 'Republic of Ecuador', 'ECU', '218', 'yes', '593', '.ec', '1');
INSERT INTO `country_lu` VALUES ('66', 'EG', 'Egypt', 'Arab Republic of Egypt', 'EGY', '818', 'yes', '20', '.eg', '1');
INSERT INTO `country_lu` VALUES ('67', 'SV', 'El Salvador', 'Republic of El Salvador', 'SLV', '222', 'yes', '503', '.sv', '1');
INSERT INTO `country_lu` VALUES ('68', 'GQ', 'Equatorial Guinea', 'Republic of Equatorial Guinea', 'GNQ', '226', 'yes', '240', '.gq', '1');
INSERT INTO `country_lu` VALUES ('69', 'ER', 'Eritrea', 'State of Eritrea', 'ERI', '232', 'yes', '291', '.er', '1');
INSERT INTO `country_lu` VALUES ('70', 'EE', 'Estonia', 'Republic of Estonia', 'EST', '233', 'yes', '372', '.ee', '1');
INSERT INTO `country_lu` VALUES ('71', 'ET', 'Ethiopia', 'Federal Democratic Republic of Ethiopia', 'ETH', '231', 'yes', '251', '.et', '1');
INSERT INTO `country_lu` VALUES ('72', 'FK', 'Falkland Islands (Malvinas)', 'The Falkland Islands (Malvinas)', 'FLK', '238', 'no', '500', '.fk', '1');
INSERT INTO `country_lu` VALUES ('73', 'FO', 'Faroe Islands', 'The Faroe Islands', 'FRO', '234', 'no', '298', '.fo', '1');
INSERT INTO `country_lu` VALUES ('74', 'FJ', 'Fiji', 'Republic of Fiji', 'FJI', '242', 'yes', '679', '.fj', '1');
INSERT INTO `country_lu` VALUES ('75', 'FI', 'Finland', 'Republic of Finland', 'FIN', '246', 'yes', '358', '.fi', '1');
INSERT INTO `country_lu` VALUES ('76', 'FR', 'France', 'French Republic', 'FRA', '250', 'yes', '33', '.fr', '1');
INSERT INTO `country_lu` VALUES ('77', 'GF', 'French Guiana', 'French Guiana', 'GUF', '254', 'no', '594', '.gf', '1');
INSERT INTO `country_lu` VALUES ('78', 'PF', 'French Polynesia', 'French Polynesia', 'PYF', '258', 'no', '689', '.pf', '1');
INSERT INTO `country_lu` VALUES ('79', 'TF', 'French Southern Territories', 'French Southern Territories', 'ATF', '260', 'no', null, '.tf', '1');
INSERT INTO `country_lu` VALUES ('80', 'GA', 'Gabon', 'Gabonese Republic', 'GAB', '266', 'yes', '241', '.ga', '1');
INSERT INTO `country_lu` VALUES ('81', 'GM', 'Gambia', 'Republic of The Gambia', 'GMB', '270', 'yes', '220', '.gm', '1');
INSERT INTO `country_lu` VALUES ('82', 'GE', 'Georgia', 'Georgia', 'GEO', '268', 'yes', '995', '.ge', '1');
INSERT INTO `country_lu` VALUES ('83', 'DE', 'Germany', 'Federal Republic of Germany', 'DEU', '276', 'yes', '49', '.de', '1');
INSERT INTO `country_lu` VALUES ('84', 'GH', 'Ghana', 'Republic of Ghana', 'GHA', '288', 'yes', '233', '.gh', '1');
INSERT INTO `country_lu` VALUES ('85', 'GI', 'Gibraltar', 'Gibraltar', 'GIB', '292', 'no', '350', '.gi', '1');
INSERT INTO `country_lu` VALUES ('86', 'GR', 'Greece', 'Hellenic Republic', 'GRC', '300', 'yes', '30', '.gr', '1');
INSERT INTO `country_lu` VALUES ('87', 'GL', 'Greenland', 'Greenland', 'GRL', '304', 'no', '299', '.gl', '1');
INSERT INTO `country_lu` VALUES ('88', 'GD', 'Grenada', 'Grenada', 'GRD', '308', 'yes', '1+473', '.gd', '1');
INSERT INTO `country_lu` VALUES ('89', 'GP', 'Guadaloupe', 'Guadeloupe', 'GLP', '312', 'no', '590', '.gp', '1');
INSERT INTO `country_lu` VALUES ('90', 'GU', 'Guam', 'Guam', 'GUM', '316', 'no', '1+671', '.gu', '1');
INSERT INTO `country_lu` VALUES ('91', 'GT', 'Guatemala', 'Republic of Guatemala', 'GTM', '320', 'yes', '502', '.gt', '1');
INSERT INTO `country_lu` VALUES ('92', 'GG', 'Guernsey', 'Guernsey', 'GGY', '831', 'no', '44', '.gg', '1');
INSERT INTO `country_lu` VALUES ('93', 'GN', 'Guinea', 'Republic of Guinea', 'GIN', '324', 'yes', '224', '.gn', '1');
INSERT INTO `country_lu` VALUES ('94', 'GW', 'Guinea-Bissau', 'Republic of Guinea-Bissau', 'GNB', '624', 'yes', '245', '.gw', '1');
INSERT INTO `country_lu` VALUES ('95', 'GY', 'Guyana', 'Co-operative Republic of Guyana', 'GUY', '328', 'yes', '592', '.gy', '1');
INSERT INTO `country_lu` VALUES ('96', 'HT', 'Haiti', 'Republic of Haiti', 'HTI', '332', 'yes', '509', '.ht', '1');
INSERT INTO `country_lu` VALUES ('97', 'HM', 'Heard Island and McDonald Islands', 'Heard Island and McDonald Islands', 'HMD', '334', 'no', 'NONE', '.hm', '1');
INSERT INTO `country_lu` VALUES ('98', 'HN', 'Honduras', 'Republic of Honduras', 'HND', '340', 'yes', '504', '.hn', '1');
INSERT INTO `country_lu` VALUES ('99', 'HK', 'Hong Kong', 'Hong Kong', 'HKG', '344', 'no', '852', '.hk', '1');
INSERT INTO `country_lu` VALUES ('100', 'HU', 'Hungary', 'Hungary', 'HUN', '348', 'yes', '36', '.hu', '1');
INSERT INTO `country_lu` VALUES ('101', 'IS', 'Iceland', 'Republic of Iceland', 'ISL', '352', 'yes', '354', '.is', '1');
INSERT INTO `country_lu` VALUES ('102', 'IN', 'India', 'Republic of India', 'IND', '356', 'yes', '91', '.in', '1');
INSERT INTO `country_lu` VALUES ('103', 'ID', 'Indonesia', 'Republic of Indonesia', 'IDN', '360', 'yes', '62', '.id', '1');
INSERT INTO `country_lu` VALUES ('104', 'IR', 'Iran', 'Islamic Republic of Iran', 'IRN', '364', 'yes', '98', '.ir', '1');
INSERT INTO `country_lu` VALUES ('105', 'IQ', 'Iraq', 'Republic of Iraq', 'IRQ', '368', 'yes', '964', '.iq', '1');
INSERT INTO `country_lu` VALUES ('106', 'IE', 'Ireland', 'Ireland', 'IRL', '372', 'yes', '353', '.ie', '1');
INSERT INTO `country_lu` VALUES ('107', 'IM', 'Isle of Man', 'Isle of Man', 'IMN', '833', 'no', '44', '.im', '1');
INSERT INTO `country_lu` VALUES ('108', 'IL', 'Israel', 'State of Israel', 'ISR', '376', 'yes', '972', '.il', '1');
INSERT INTO `country_lu` VALUES ('109', 'IT', 'Italy', 'Italian Republic', 'ITA', '380', 'yes', '39', '.jm', '1');
INSERT INTO `country_lu` VALUES ('110', 'JM', 'Jamaica', 'Jamaica', 'JAM', '388', 'yes', '1+876', '.jm', '1');
INSERT INTO `country_lu` VALUES ('111', 'JP', 'Japan', 'Japan', 'JPN', '392', 'yes', '81', '.jp', '1');
INSERT INTO `country_lu` VALUES ('112', 'JE', 'Jersey', 'The Bailiwick of Jersey', 'JEY', '832', 'no', '44', '.je', '1');
INSERT INTO `country_lu` VALUES ('113', 'JO', 'Jordan', 'Hashemite Kingdom of Jordan', 'JOR', '400', 'yes', '962', '.jo', '1');
INSERT INTO `country_lu` VALUES ('114', 'KZ', 'Kazakhstan', 'Republic of Kazakhstan', 'KAZ', '398', 'yes', '7', '.kz', '1');
INSERT INTO `country_lu` VALUES ('115', 'KE', 'Kenya', 'Republic of Kenya', 'KEN', '404', 'yes', '254', '.ke', '1');
INSERT INTO `country_lu` VALUES ('116', 'KI', 'Kiribati', 'Republic of Kiribati', 'KIR', '296', 'yes', '686', '.ki', '1');
INSERT INTO `country_lu` VALUES ('117', 'XK', 'Kosovo', 'Republic of Kosovo', '---', '---', 'some', '381', '', '1');
INSERT INTO `country_lu` VALUES ('118', 'KW', 'Kuwait', 'State of Kuwait', 'KWT', '414', 'yes', '965', '.kw', '1');
INSERT INTO `country_lu` VALUES ('119', 'KG', 'Kyrgyzstan', 'Kyrgyz Republic', 'KGZ', '417', 'yes', '996', '.kg', '1');
INSERT INTO `country_lu` VALUES ('120', 'LA', 'Laos', 'Lao People\'s Democratic Republic', 'LAO', '418', 'yes', '856', '.la', '1');
INSERT INTO `country_lu` VALUES ('121', 'LV', 'Latvia', 'Republic of Latvia', 'LVA', '428', 'yes', '371', '.lv', '1');
INSERT INTO `country_lu` VALUES ('122', 'LB', 'Lebanon', 'Republic of Lebanon', 'LBN', '422', 'yes', '961', '.lb', '1');
INSERT INTO `country_lu` VALUES ('123', 'LS', 'Lesotho', 'Kingdom of Lesotho', 'LSO', '426', 'yes', '266', '.ls', '1');
INSERT INTO `country_lu` VALUES ('124', 'LR', 'Liberia', 'Republic of Liberia', 'LBR', '430', 'yes', '231', '.lr', '1');
INSERT INTO `country_lu` VALUES ('125', 'LY', 'Libya', 'Libya', 'LBY', '434', 'yes', '218', '.ly', '1');
INSERT INTO `country_lu` VALUES ('126', 'LI', 'Liechtenstein', 'Principality of Liechtenstein', 'LIE', '438', 'yes', '423', '.li', '1');
INSERT INTO `country_lu` VALUES ('127', 'LT', 'Lithuania', 'Republic of Lithuania', 'LTU', '440', 'yes', '370', '.lt', '1');
INSERT INTO `country_lu` VALUES ('128', 'LU', 'Luxembourg', 'Grand Duchy of Luxembourg', 'LUX', '442', 'yes', '352', '.lu', '1');
INSERT INTO `country_lu` VALUES ('129', 'MO', 'Macao', 'The Macao Special Administrative Region', 'MAC', '446', 'no', '853', '.mo', '1');
INSERT INTO `country_lu` VALUES ('130', 'MK', 'Macedonia', 'The Former Yugoslav Republic of Macedonia', 'MKD', '807', 'yes', '389', '.mk', '1');
INSERT INTO `country_lu` VALUES ('131', 'MG', 'Madagascar', 'Republic of Madagascar', 'MDG', '450', 'yes', '261', '.mg', '1');
INSERT INTO `country_lu` VALUES ('132', 'MW', 'Malawi', 'Republic of Malawi', 'MWI', '454', 'yes', '265', '.mw', '1');
INSERT INTO `country_lu` VALUES ('133', 'MY', 'Malaysia', 'Malaysia', 'MYS', '458', 'yes', '60', '.my', '1');
INSERT INTO `country_lu` VALUES ('134', 'MV', 'Maldives', 'Republic of Maldives', 'MDV', '462', 'yes', '960', '.mv', '1');
INSERT INTO `country_lu` VALUES ('135', 'ML', 'Mali', 'Republic of Mali', 'MLI', '466', 'yes', '223', '.ml', '1');
INSERT INTO `country_lu` VALUES ('136', 'MT', 'Malta', 'Republic of Malta', 'MLT', '470', 'yes', '356', '.mt', '1');
INSERT INTO `country_lu` VALUES ('137', 'MH', 'Marshall Islands', 'Republic of the Marshall Islands', 'MHL', '584', 'yes', '692', '.mh', '1');
INSERT INTO `country_lu` VALUES ('138', 'MQ', 'Martinique', 'Martinique', 'MTQ', '474', 'no', '596', '.mq', '1');
INSERT INTO `country_lu` VALUES ('139', 'MR', 'Mauritania', 'Islamic Republic of Mauritania', 'MRT', '478', 'yes', '222', '.mr', '1');
INSERT INTO `country_lu` VALUES ('140', 'MU', 'Mauritius', 'Republic of Mauritius', 'MUS', '480', 'yes', '230', '.mu', '1');
INSERT INTO `country_lu` VALUES ('141', 'YT', 'Mayotte', 'Mayotte', 'MYT', '175', 'no', '262', '.yt', '1');
INSERT INTO `country_lu` VALUES ('142', 'MX', 'Mexico', 'United Mexican States', 'MEX', '484', 'yes', '52', '.mx', '1');
INSERT INTO `country_lu` VALUES ('143', 'FM', 'Micronesia', 'Federated States of Micronesia', 'FSM', '583', 'yes', '691', '.fm', '1');
INSERT INTO `country_lu` VALUES ('144', 'MD', 'Moldava', 'Republic of Moldova', 'MDA', '498', 'yes', '373', '.md', '1');
INSERT INTO `country_lu` VALUES ('145', 'MC', 'Monaco', 'Principality of Monaco', 'MCO', '492', 'yes', '377', '.mc', '1');
INSERT INTO `country_lu` VALUES ('146', 'MN', 'Mongolia', 'Mongolia', 'MNG', '496', 'yes', '976', '.mn', '1');
INSERT INTO `country_lu` VALUES ('147', 'ME', 'Montenegro', 'Montenegro', 'MNE', '499', 'yes', '382', '.me', '1');
INSERT INTO `country_lu` VALUES ('148', 'MS', 'Montserrat', 'Montserrat', 'MSR', '500', 'no', '1+664', '.ms', '1');
INSERT INTO `country_lu` VALUES ('149', 'MA', 'Morocco', 'Kingdom of Morocco', 'MAR', '504', 'yes', '212', '.ma', '1');
INSERT INTO `country_lu` VALUES ('150', 'MZ', 'Mozambique', 'Republic of Mozambique', 'MOZ', '508', 'yes', '258', '.mz', '1');
INSERT INTO `country_lu` VALUES ('151', 'MM', 'Myanmar (Burma)', 'Republic of the Union of Myanmar', 'MMR', '104', 'yes', '95', '.mm', '1');
INSERT INTO `country_lu` VALUES ('152', 'NA', 'Namibia', 'Republic of Namibia', 'NAM', '516', 'yes', '264', '.na', '1');
INSERT INTO `country_lu` VALUES ('153', 'NR', 'Nauru', 'Republic of Nauru', 'NRU', '520', 'yes', '674', '.nr', '1');
INSERT INTO `country_lu` VALUES ('154', 'NP', 'Nepal', 'Federal Democratic Republic of Nepal', 'NPL', '524', 'yes', '977', '.np', '1');
INSERT INTO `country_lu` VALUES ('155', 'NL', 'Netherlands', 'Kingdom of the Netherlands', 'NLD', '528', 'yes', '31', '.nl', '1');
INSERT INTO `country_lu` VALUES ('156', 'NC', 'New Caledonia', 'New Caledonia', 'NCL', '540', 'no', '687', '.nc', '1');
INSERT INTO `country_lu` VALUES ('157', 'NZ', 'New Zealand', 'New Zealand', 'NZL', '554', 'yes', '64', '.nz', '1');
INSERT INTO `country_lu` VALUES ('158', 'NI', 'Nicaragua', 'Republic of Nicaragua', 'NIC', '558', 'yes', '505', '.ni', '1');
INSERT INTO `country_lu` VALUES ('159', 'NE', 'Niger', 'Republic of Niger', 'NER', '562', 'yes', '227', '.ne', '1');
INSERT INTO `country_lu` VALUES ('160', 'NG', 'Nigeria', 'Federal Republic of Nigeria', 'NGA', '566', 'yes', '234', '.ng', '1');
INSERT INTO `country_lu` VALUES ('161', 'NU', 'Niue', 'Niue', 'NIU', '570', 'some', '683', '.nu', '1');
INSERT INTO `country_lu` VALUES ('162', 'NF', 'Norfolk Island', 'Norfolk Island', 'NFK', '574', 'no', '672', '.nf', '1');
INSERT INTO `country_lu` VALUES ('163', 'KP', 'North Korea', 'Democratic People\'s Republic of Korea', 'PRK', '408', 'yes', '850', '.kp', '1');
INSERT INTO `country_lu` VALUES ('164', 'MP', 'Northern Mariana Islands', 'Northern Mariana Islands', 'MNP', '580', 'no', '1+670', '.mp', '1');
INSERT INTO `country_lu` VALUES ('165', 'NO', 'Norway', 'Kingdom of Norway', 'NOR', '578', 'yes', '47', '.no', '1');
INSERT INTO `country_lu` VALUES ('166', 'OM', 'Oman', 'Sultanate of Oman', 'OMN', '512', 'yes', '968', '.om', '1');
INSERT INTO `country_lu` VALUES ('167', 'PK', 'Pakistan', 'Islamic Republic of Pakistan', 'PAK', '586', 'yes', '92', '.pk', '1');
INSERT INTO `country_lu` VALUES ('168', 'PW', 'Palau', 'Republic of Palau', 'PLW', '585', 'yes', '680', '.pw', '1');
INSERT INTO `country_lu` VALUES ('169', 'PS', 'Palestine', 'State of Palestine (or Occupied Palestinian Territory)', 'PSE', '275', 'some', '970', '.ps', '1');
INSERT INTO `country_lu` VALUES ('170', 'PA', 'Panama', 'Republic of Panama', 'PAN', '591', 'yes', '507', '.pa', '1');
INSERT INTO `country_lu` VALUES ('171', 'PG', 'Papua New Guinea', 'Independent State of Papua New Guinea', 'PNG', '598', 'yes', '675', '.pg', '1');
INSERT INTO `country_lu` VALUES ('172', 'PY', 'Paraguay', 'Republic of Paraguay', 'PRY', '600', 'yes', '595', '.py', '1');
INSERT INTO `country_lu` VALUES ('173', 'PE', 'Peru', 'Republic of Peru', 'PER', '604', 'yes', '51', '.pe', '1');
INSERT INTO `country_lu` VALUES ('174', 'PH', 'Phillipines', 'Republic of the Philippines', 'PHL', '608', 'yes', '63', '.ph', '1');
INSERT INTO `country_lu` VALUES ('175', 'PN', 'Pitcairn', 'Pitcairn', 'PCN', '612', 'no', 'NONE', '.pn', '1');
INSERT INTO `country_lu` VALUES ('176', 'PL', 'Poland', 'Republic of Poland', 'POL', '616', 'yes', '48', '.pl', '1');
INSERT INTO `country_lu` VALUES ('177', 'PT', 'Portugal', 'Portuguese Republic', 'PRT', '620', 'yes', '351', '.pt', '1');
INSERT INTO `country_lu` VALUES ('178', 'PR', 'Puerto Rico', 'Commonwealth of Puerto Rico', 'PRI', '630', 'no', '1+939', '.pr', '1');
INSERT INTO `country_lu` VALUES ('179', 'QA', 'Qatar', 'State of Qatar', 'QAT', '634', 'yes', '974', '.qa', '1');
INSERT INTO `country_lu` VALUES ('180', 'RE', 'Reunion', 'R&eacute;union', 'REU', '638', 'no', '262', '.re', '1');
INSERT INTO `country_lu` VALUES ('181', 'RO', 'Romania', 'Romania', 'ROU', '642', 'yes', '40', '.ro', '1');
INSERT INTO `country_lu` VALUES ('182', 'RU', 'Russia', 'Russian Federation', 'RUS', '643', 'yes', '7', '.ru', '1');
INSERT INTO `country_lu` VALUES ('183', 'RW', 'Rwanda', 'Republic of Rwanda', 'RWA', '646', 'yes', '250', '.rw', '1');
INSERT INTO `country_lu` VALUES ('184', 'BL', 'Saint Barthelemy', 'Saint Barth&eacute;lemy', 'BLM', '652', 'no', '590', '.bl', '1');
INSERT INTO `country_lu` VALUES ('185', 'SH', 'Saint Helena', 'Saint Helena, Ascension and Tristan da Cunha', 'SHN', '654', 'no', '290', '.sh', '1');
INSERT INTO `country_lu` VALUES ('186', 'KN', 'Saint Kitts and Nevis', 'Federation of Saint Christopher and Nevis', 'KNA', '659', 'yes', '1+869', '.kn', '1');
INSERT INTO `country_lu` VALUES ('187', 'LC', 'Saint Lucia', 'Saint Lucia', 'LCA', '662', 'yes', '1+758', '.lc', '1');
INSERT INTO `country_lu` VALUES ('188', 'MF', 'Saint Martin', 'Saint Martin', 'MAF', '663', 'no', '590', '.mf', '1');
INSERT INTO `country_lu` VALUES ('189', 'PM', 'Saint Pierre and Miquelon', 'Saint Pierre and Miquelon', 'SPM', '666', 'no', '508', '.pm', '1');
INSERT INTO `country_lu` VALUES ('190', 'VC', 'Saint Vincent and the Grenadines', 'Saint Vincent and the Grenadines', 'VCT', '670', 'yes', '1+784', '.vc', '1');
INSERT INTO `country_lu` VALUES ('191', 'WS', 'Samoa', 'Independent State of Samoa', 'WSM', '882', 'yes', '685', '.ws', '1');
INSERT INTO `country_lu` VALUES ('192', 'SM', 'San Marino', 'Republic of San Marino', 'SMR', '674', 'yes', '378', '.sm', '1');
INSERT INTO `country_lu` VALUES ('193', 'ST', 'Sao Tome and Principe', 'Democratic Republic of S&atilde;o Tom&eacute; and Pr&iacute;ncipe', 'STP', '678', 'yes', '239', '.st', '1');
INSERT INTO `country_lu` VALUES ('194', 'SA', 'Saudi Arabia', 'Kingdom of Saudi Arabia', 'SAU', '682', 'yes', '966', '.sa', '1');
INSERT INTO `country_lu` VALUES ('195', 'SN', 'Senegal', 'Republic of Senegal', 'SEN', '686', 'yes', '221', '.sn', '1');
INSERT INTO `country_lu` VALUES ('196', 'RS', 'Serbia', 'Republic of Serbia', 'SRB', '688', 'yes', '381', '.rs', '1');
INSERT INTO `country_lu` VALUES ('197', 'SC', 'Seychelles', 'Republic of Seychelles', 'SYC', '690', 'yes', '248', '.sc', '1');
INSERT INTO `country_lu` VALUES ('198', 'SL', 'Sierra Leone', 'Republic of Sierra Leone', 'SLE', '694', 'yes', '232', '.sl', '1');
INSERT INTO `country_lu` VALUES ('199', 'SG', 'Singapore', 'Republic of Singapore', 'SGP', '702', 'yes', '65', '.sg', '1');
INSERT INTO `country_lu` VALUES ('200', 'SX', 'Sint Maarten', 'Sint Maarten', 'SXM', '534', 'no', '1+721', '.sx', '1');
INSERT INTO `country_lu` VALUES ('201', 'SK', 'Slovakia', 'Slovak Republic', 'SVK', '703', 'yes', '421', '.sk', '1');
INSERT INTO `country_lu` VALUES ('202', 'SI', 'Slovenia', 'Republic of Slovenia', 'SVN', '705', 'yes', '386', '.si', '1');
INSERT INTO `country_lu` VALUES ('203', 'SB', 'Solomon Islands', 'Solomon Islands', 'SLB', '090', 'yes', '677', '.sb', '1');
INSERT INTO `country_lu` VALUES ('204', 'SO', 'Somalia', 'Somali Republic', 'SOM', '706', 'yes', '252', '.so', '1');
INSERT INTO `country_lu` VALUES ('205', 'ZA', 'South Africa', 'Republic of South Africa', 'ZAF', '710', 'yes', '27', '.za', '1');
INSERT INTO `country_lu` VALUES ('206', 'GS', 'South Georgia and the South Sandwich Islands', 'South Georgia and the South Sandwich Islands', 'SGS', '239', 'no', '500', '.gs', '1');
INSERT INTO `country_lu` VALUES ('207', 'KR', 'South Korea', 'Republic of Korea', 'KOR', '410', 'yes', '82', '.kr', '1');
INSERT INTO `country_lu` VALUES ('208', 'SS', 'South Sudan', 'Republic of South Sudan', 'SSD', '728', 'yes', '211', '.ss', '1');
INSERT INTO `country_lu` VALUES ('209', 'ES', 'Spain', 'Kingdom of Spain', 'ESP', '724', 'yes', '34', '.es', '1');
INSERT INTO `country_lu` VALUES ('210', 'LK', 'Sri Lanka', 'Democratic Socialist Republic of Sri Lanka', 'LKA', '144', 'yes', '94', '.lk', '1');
INSERT INTO `country_lu` VALUES ('211', 'SD', 'Sudan', 'Republic of the Sudan', 'SDN', '729', 'yes', '249', '.sd', '1');
INSERT INTO `country_lu` VALUES ('212', 'SR', 'Suriname', 'Republic of Suriname', 'SUR', '740', 'yes', '597', '.sr', '1');
INSERT INTO `country_lu` VALUES ('213', 'SJ', 'Svalbard and Jan Mayen', 'Svalbard and Jan Mayen', 'SJM', '744', 'no', '47', '.sj', '1');
INSERT INTO `country_lu` VALUES ('214', 'SZ', 'Swaziland', 'Kingdom of Swaziland', 'SWZ', '748', 'yes', '268', '.sz', '1');
INSERT INTO `country_lu` VALUES ('215', 'SE', 'Sweden', 'Kingdom of Sweden', 'SWE', '752', 'yes', '46', '.se', '1');
INSERT INTO `country_lu` VALUES ('216', 'CH', 'Switzerland', 'Swiss Confederation', 'CHE', '756', 'yes', '41', '.ch', '1');
INSERT INTO `country_lu` VALUES ('217', 'SY', 'Syria', 'Syrian Arab Republic', 'SYR', '760', 'yes', '963', '.sy', '1');
INSERT INTO `country_lu` VALUES ('218', 'TW', 'Taiwan', 'Republic of China (Taiwan)', 'TWN', '158', 'former', '886', '.tw', '1');
INSERT INTO `country_lu` VALUES ('219', 'TJ', 'Tajikistan', 'Republic of Tajikistan', 'TJK', '762', 'yes', '992', '.tj', '1');
INSERT INTO `country_lu` VALUES ('220', 'TZ', 'Tanzania', 'United Republic of Tanzania', 'TZA', '834', 'yes', '255', '.tz', '1');
INSERT INTO `country_lu` VALUES ('221', 'TH', 'Thailand', 'Kingdom of Thailand', 'THA', '764', 'yes', '66', '.th', '1');
INSERT INTO `country_lu` VALUES ('222', 'TL', 'Timor-Leste (East Timor)', 'Democratic Republic of Timor-Leste', 'TLS', '626', 'yes', '670', '.tl', '1');
INSERT INTO `country_lu` VALUES ('223', 'TG', 'Togo', 'Togolese Republic', 'TGO', '768', 'yes', '228', '.tg', '1');
INSERT INTO `country_lu` VALUES ('224', 'TK', 'Tokelau', 'Tokelau', 'TKL', '772', 'no', '690', '.tk', '1');
INSERT INTO `country_lu` VALUES ('225', 'TO', 'Tonga', 'Kingdom of Tonga', 'TON', '776', 'yes', '676', '.to', '1');
INSERT INTO `country_lu` VALUES ('226', 'TT', 'Trinidad and Tobago', 'Republic of Trinidad and Tobago', 'TTO', '780', 'yes', '1+868', '.tt', '1');
INSERT INTO `country_lu` VALUES ('227', 'TN', 'Tunisia', 'Republic of Tunisia', 'TUN', '788', 'yes', '216', '.tn', '1');
INSERT INTO `country_lu` VALUES ('228', 'TR', 'Turkey', 'Republic of Turkey', 'TUR', '792', 'yes', '90', '.tr', '1');
INSERT INTO `country_lu` VALUES ('229', 'TM', 'Turkmenistan', 'Turkmenistan', 'TKM', '795', 'yes', '993', '.tm', '1');
INSERT INTO `country_lu` VALUES ('230', 'TC', 'Turks and Caicos Islands', 'Turks and Caicos Islands', 'TCA', '796', 'no', '1+649', '.tc', '1');
INSERT INTO `country_lu` VALUES ('231', 'TV', 'Tuvalu', 'Tuvalu', 'TUV', '798', 'yes', '688', '.tv', '1');
INSERT INTO `country_lu` VALUES ('232', 'UG', 'Uganda', 'Republic of Uganda', 'UGA', '800', 'yes', '256', '.ug', '1');
INSERT INTO `country_lu` VALUES ('233', 'UA', 'Ukraine', 'Ukraine', 'UKR', '804', 'yes', '380', '.ua', '1');
INSERT INTO `country_lu` VALUES ('234', 'AE', 'United Arab Emirates', 'United Arab Emirates', 'ARE', '784', 'yes', '971', '.ae', '1');
INSERT INTO `country_lu` VALUES ('235', 'GB', 'United Kingdom', 'United Kingdom of Great Britain and Nothern Ireland', 'GBR', '826', 'yes', '44', '.uk', '1');
INSERT INTO `country_lu` VALUES ('236', 'US', 'United States', 'United States of America', 'USA', '840', 'yes', '1', '.us', '1');
INSERT INTO `country_lu` VALUES ('237', 'UM', 'United States Minor Outlying Islands', 'United States Minor Outlying Islands', 'UMI', '581', 'no', 'NONE', 'NONE', '1');
INSERT INTO `country_lu` VALUES ('238', 'UY', 'Uruguay', 'Eastern Republic of Uruguay', 'URY', '858', 'yes', '598', '.uy', '1');
INSERT INTO `country_lu` VALUES ('239', 'UZ', 'Uzbekistan', 'Republic of Uzbekistan', 'UZB', '860', 'yes', '998', '.uz', '1');
INSERT INTO `country_lu` VALUES ('240', 'VU', 'Vanuatu', 'Republic of Vanuatu', 'VUT', '548', 'yes', '678', '.vu', '1');
INSERT INTO `country_lu` VALUES ('241', 'VA', 'Vatican City', 'State of the Vatican City', 'VAT', '336', 'no', '39', '.va', '1');
INSERT INTO `country_lu` VALUES ('242', 'VE', 'Venezuela', 'Bolivarian Republic of Venezuela', 'VEN', '862', 'yes', '58', '.ve', '1');
INSERT INTO `country_lu` VALUES ('243', 'VN', 'Vietnam', 'Socialist Republic of Vietnam', 'VNM', '704', 'yes', '84', '.vn', '1');
INSERT INTO `country_lu` VALUES ('244', 'VG', 'Virgin Islands, British', 'British Virgin Islands', 'VGB', '092', 'no', '1+284', '.vg', '1');
INSERT INTO `country_lu` VALUES ('245', 'VI', 'Virgin Islands, US', 'Virgin Islands of the United States', 'VIR', '850', 'no', '1+340', '.vi', '1');
INSERT INTO `country_lu` VALUES ('246', 'WF', 'Wallis and Futuna', 'Wallis and Futuna', 'WLF', '876', 'no', '681', '.wf', '1');
INSERT INTO `country_lu` VALUES ('247', 'EH', 'Western Sahara', 'Western Sahara', 'ESH', '732', 'no', '212', '.eh', '1');
INSERT INTO `country_lu` VALUES ('248', 'YE', 'Yemen', 'Republic of Yemen', 'YEM', '887', 'yes', '967', '.ye', '1');
INSERT INTO `country_lu` VALUES ('249', 'ZM', 'Zambia', 'Republic of Zambia', 'ZMB', '894', 'yes', '260', '.zm', '1');
INSERT INTO `country_lu` VALUES ('250', 'ZW', 'Zimbabwe', 'Republic of Zimbabwe', 'ZWE', '716', 'yes', '263', '.zw', '1');

-- ----------------------------
-- Table structure for event_type_lu
-- ----------------------------
DROP TABLE IF EXISTS `event_type_lu`;
CREATE TABLE `event_type_lu` (
  `event_type_code` varchar(16) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `description` varchar(256) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `created_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_by` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  PRIMARY KEY (`event_type_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of event_type_lu
-- ----------------------------

-- ----------------------------
-- Table structure for fight_event
-- ----------------------------
DROP TABLE IF EXISTS `fight_event`;
CREATE TABLE `fight_event` (
  `event_id` bigint NOT NULL AUTO_INCREMENT,
  `fight_event_group_code` varchar(64) DEFAULT NULL,
  `name` varchar(64) CHARACTER SET utf16 COLLATE utf16_general_ci DEFAULT NULL,
  `contact_user_id` bigint DEFAULT NULL,
  `host_charter_id` bigint DEFAULT NULL,
  `country_code` varchar(3) NOT NULL,
  `state_or_province` varchar(255) DEFAULT NULL,
  `location_json` varchar(4000) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `number_of_days` tinyint DEFAULT NULL,
  `start_date` timestamp NULL DEFAULT NULL,
  `end_date` timestamp NULL DEFAULT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` varchar(128) NOT NULL,
  `updated_date` timestamp NULL DEFAULT '1970-01-01 02:00:01',
  `updated_by` varchar(128) NOT NULL,
  PRIMARY KEY (`event_id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf16;

-- ----------------------------
-- Records of fight_event
-- ----------------------------
INSERT INTO `fight_event` VALUES ('1', 'TSL_ARMAGEDDON', 'Armageddon I ', null, null, 'USA', 'MN', '{}', '1', null, '2017-03-31 00:00:01', '2017-03-31 11:59:01', '2021-04-04 12:07:36', 'ceg', '2021-04-04 11:06:23', 'ceg');
INSERT INTO `fight_event` VALUES ('2', 'TSL_ARMAGEDDON', 'Armageddon II', null, null, 'USA', 'MN', '{}', '1', null, null, null, '2021-04-04 11:19:09', 'ceg', '2021-04-04 11:06:23', 'ceg');
INSERT INTO `fight_event` VALUES ('3', 'TSL_ARMAGEDDON', 'Armageddon III', null, null, 'USA', 'MN', '{}', '1', null, null, null, '2021-04-04 11:19:09', 'ceg', '2021-04-04 11:06:23', 'ceg');
INSERT INTO `fight_event` VALUES ('4', 'TSL_AWAKENING', 'Awakening I', null, null, 'USA', 'MN', '{}', '1', null, null, null, '2021-04-04 11:19:09', 'ceg', '2021-04-04 11:06:23', 'ceg');
INSERT INTO `fight_event` VALUES ('5', 'TSL_BATTLEGROUND', 'Battleground I', null, null, 'USA', 'MN', '{}', '1', null, null, null, '2021-04-04 11:45:42', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('6', 'TSL_BATTLEGROUND', 'Battleground II', null, null, 'USA', 'MN', '{}', '1', null, null, null, '2021-04-04 11:45:42', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('7', 'TSL_BATTLE_OF_CHAMPIONS ', 'Battle of Champions I ', null, null, 'USA', 'MN', '{}', '1', null, null, null, '2021-04-04 11:45:42', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('8', 'TSL_BATTLE_OF_CHAMPIONS ', 'Battle of Champions II', null, null, 'USA', 'MN', '{}', '1', null, null, null, '2021-04-04 11:45:42', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('9', 'TSL_BATTLE_OF_CHAMPIONS ', 'Battle of Champions III', null, null, 'USA', 'MN', '{}', '1', null, null, null, '2021-04-04 11:45:42', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('10', 'TSL_BEAST_COAST_BRAWL ', 'Beast Coast Brawl I', null, null, 'USA', 'MD', '{}', '1', null, null, null, '2021-04-04 11:45:42', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('11', 'TSL_BEAST_COAST_BRAWL ', 'Beast Coast Brawl II', null, null, 'USA', 'MD', '{}', '0', null, null, null, '2021-04-04 11:45:42', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('12', 'TSL_CROSSROADS', 'Crossroads', null, null, 'USA', 'OH', '{}', '1', null, null, null, '2021-04-04 11:09:29', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('13', 'TSL_CROSSROADS', 'Crossroads II', null, null, 'USA', 'OH', '{}', '1', null, null, null, '2021-04-04 11:09:29', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('14', 'TSL_CRUSHXOTICA', 'CrushXotica I', null, null, 'USA', 'FL', '{}', '1', null, null, null, '2021-04-04 11:09:29', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('15', 'TSL_CRUSHXOTICA', 'CrushXotica II', null, null, 'USA', 'FL', '{}', '0', null, null, null, '2021-04-04 11:09:29', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('16', 'TSL_DARKWATCH', 'Darkwatch I', null, null, 'USA', 'CA', '{}', '1', null, null, null, '2021-04-04 11:41:06', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('17', 'TSL_DARKWATCH', 'Darkwatch II', null, null, 'USA', 'CA', '{}', '1', null, null, null, '2021-04-04 11:41:06', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('18', 'TSL_DARKWATCH', 'Darkwatch III', null, null, 'USA', 'CA', '{}', '1', null, null, null, '2021-04-04 11:41:06', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('19', 'TSL_DARKWATCH', 'Darkwatch IV', null, null, 'USA', 'CA', '{}', '1', null, null, null, '2021-04-04 11:41:06', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('20', 'TSL_DARKWATCH', 'Darkwatch V', null, null, 'USA', 'CA', '{}', '1', null, null, null, '2021-04-04 11:41:06', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('21', 'TSL_DARKWATCH', 'Darkwatch VI', null, null, 'USA', 'CA', '{}', '1', null, null, null, '2021-04-04 11:41:06', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('22', 'TSL_FLORIDA_CUP', 'Florida Cup', null, null, 'USA', 'FL', '{}', '1', null, null, null, '2021-04-04 11:41:06', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('23', 'TSL_MEXICO_OPEN', 'Mexico Open', null, null, 'MEX', '', '{}', '1', null, null, null, '2021-04-04 11:41:06', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('24', 'TSL_RAGNAROK', 'Ragnarok', null, null, 'USA', 'MN', '{}', '1', null, null, null, '2021-04-04 11:33:15', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('25', 'TSL_RESOLUTION', 'Resolution I', null, null, 'USA', 'MN', '{}', '1', null, null, null, '2021-04-04 11:42:39', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('26', 'TSL_RESOLUTION', 'Resolution II', null, null, 'USA', 'MN', '{}', '1', null, null, null, '2021-04-04 11:41:52', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('27', 'TSL_RESOLUTION', 'Resolution III', null, null, 'USA', 'MN', '{}', '1', null, null, null, '2021-04-04 11:41:52', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('28', 'TSL_RESOLUTION', 'Resolution IV', null, null, 'USA', 'MN', '{}', '1', null, null, null, '2021-04-04 11:41:52', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('29', 'TSL_SOUTHERN_CALIFORNIA', 'Southern California 1', null, null, 'USA', 'CA', '{}', '1', null, null, null, '2021-04-04 11:47:20', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('30', 'TSL_SOUTHERN_CALIFORNIA', 'Southern California 2', null, null, 'USA', 'CA', '{}', '1', null, null, null, '2021-04-04 11:47:20', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('31', 'TSL_STEAMPUNK', 'Steampunk Invitational 1', null, null, 'USA', 'CA', '{}', '1', null, null, null, '2021-04-04 11:49:10', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('32', 'TSL_STEAMPUNK', 'Steampunk Invitational 2', null, null, 'USA', 'CA', '{}', '1', null, null, null, '2021-04-04 11:49:10', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('33', 'TSL_STEAMPUNK', 'Steampunk Invitational 3', null, null, 'USA', 'CA', '{}', '1', null, null, null, '2021-04-04 11:49:10', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('34', 'TSL_SUNCRUSHER', 'Suncrusher I', null, null, 'USA', 'FL', '{}', '1', null, null, null, '2021-04-04 11:41:06', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('35', 'TSL_SUNCRUSHER', 'Suncrusher II', null, null, 'USA', 'FL', '{}', '1', null, null, null, '2021-04-04 11:41:06', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('36', 'TSL_SUNCRUSHER', 'Suncrusher III', null, null, 'USA', 'FL', '{}', '1', null, null, null, '2021-04-04 11:41:06', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('37', 'TSL_UNDERGROUND', 'Underground I', null, null, 'USA', '', '{}', '1', null, null, null, '2021-04-04 11:41:06', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('38', 'TSL_UNDERGROUND', 'Underground 2 ', null, null, 'USA', '', '{}', '1', null, null, null, '2021-04-04 11:41:06', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('39', 'TSL_UNDERGROUND', 'Underground 3', null, null, 'USA', '', '{}', '0', null, null, null, '2021-04-04 11:52:01', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('40', 'TSL_WIZARD_WORLD_CHICAGO', 'Wizard World Chicago 2017', null, null, 'USA', 'IL', '{}', '0', null, null, null, '2021-04-04 11:52:01', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('42', 'TSL_WIZARD_WORLD_COLUMBUS', 'Wizard World Columbus 2017', null, null, 'USA', 'OH', '{}', '0', null, null, null, '2021-04-04 11:52:01', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('43', 'TSL_WORLDS', 'TSL World Championships I', null, null, 'USA', 'MN', '{}', '0', null, null, null, '2021-04-04 11:59:02', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('44', 'TSL_WORLDS', 'TSL World Championships II', null, null, 'USA', 'NV', '{}', '0', null, null, null, '2021-04-04 11:52:01', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('45', 'TSL_WORLDS', 'TSL World Championships III', null, null, 'USA', 'NV', '{}', '0', null, null, null, '2021-04-04 11:52:01', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('46', 'TSL_WORLDS', 'TSL World Championships IV', null, null, 'USA', 'NV', '{}', '0', null, null, null, '2021-04-04 11:52:01', 'ceg', '2021-04-04 11:09:29', 'ceg');
INSERT INTO `fight_event` VALUES ('47', 'TSL_WORLDS', 'TSL World Championships V', null, null, 'USA', 'NV', '{}', '0', null, null, null, '2021-04-04 11:52:01', 'ceg', '2021-04-04 11:09:29', 'ceg');

-- ----------------------------
-- Table structure for fight_event_group
-- ----------------------------
DROP TABLE IF EXISTS `fight_event_group`;
CREATE TABLE `fight_event_group` (
  `event_group_code` varchar(64) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `full_name` varchar(64) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `short_name` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `created_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_by` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `modified_date` datetime DEFAULT NULL,
  `modified_by` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  PRIMARY KEY (`event_group_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of fight_event_group
-- ----------------------------
INSERT INTO `fight_event_group` VALUES ('TSL_ARMAGEDDON', 'Armageddon', 'Armageddon', '2021-04-04 06:16:45', 'ceg', '2021-04-04 06:16:45', 'ceg');
INSERT INTO `fight_event_group` VALUES ('TSL_AWAKENING', 'Awakening', 'Awakening', '2021-04-04 06:16:45', 'ceg', '2021-04-04 06:16:45', 'ceg');
INSERT INTO `fight_event_group` VALUES ('TSL_BATTLEGROUND', 'Battleground', 'Battleground', '2021-04-04 06:16:45', 'ceg', '2021-04-04 06:16:45', 'ceg');
INSERT INTO `fight_event_group` VALUES ('TSL_BATTLE_OF_CHAMPIONS', 'Battle of Champions', 'Battle of Champions', '2021-04-04 06:16:45', 'ceg', '2021-04-04 06:16:45', 'ceg');
INSERT INTO `fight_event_group` VALUES ('TSL_BEAST_COAST_BRAWL', 'Beast Coast Brawl', 'Beast Coast Brawl', '2021-04-04 06:16:45', 'ceg', '2021-04-04 06:16:45', 'ceg');
INSERT INTO `fight_event_group` VALUES ('TSL_CROSSROADS', 'Crossroads', 'Crossroads', '2021-04-04 06:16:45', 'ceg', '2009-05-31 20:44:39', 'ceg');
INSERT INTO `fight_event_group` VALUES ('TSL_CRUSHXOTICA', 'CrushXotica', 'CrushXotica', '2021-04-04 06:16:45', 'ceg', '2021-04-04 06:16:45', 'ceg');
INSERT INTO `fight_event_group` VALUES ('TSL_DARKWATCH', 'Darkwatch Championship Series', 'Darkwatch', '2021-04-04 06:16:45', 'ceg', '2021-04-04 06:16:45', 'ceg');
INSERT INTO `fight_event_group` VALUES ('TSL_FLORIDA_CUP', 'Florida Cup', 'Florida Cup', '2009-05-31 20:44:39', 'ceg', '2021-04-04 06:16:45', 'ceg');
INSERT INTO `fight_event_group` VALUES ('TSL_MEXICO_OPEN', 'Mexico Open', 'Mexico Open', '2009-05-31 20:44:39', 'ceg', '2021-04-04 06:16:45', null);
INSERT INTO `fight_event_group` VALUES ('TSL_RAGNAROK', 'Ragnarok', 'Ragnarok', '2021-04-04 06:16:45', 'ceg', '2021-04-04 06:16:45', 'ceg');
INSERT INTO `fight_event_group` VALUES ('TSL_RESOLUTION', 'Resolution Championship Series', 'Resolution', '2021-04-04 06:16:45', 'ceg', '2021-04-04 06:16:45', 'ceg');
INSERT INTO `fight_event_group` VALUES ('TSL_SOUTHERN_CALIFORNIA', 'Southern California Tournament', 'Southern California', '2021-04-04 06:16:45', 'ceg', '2021-04-04 06:16:45', 'ceg');
INSERT INTO `fight_event_group` VALUES ('TSL_STEAMPUNK', 'Steampunk Invitational', 'Steampunk Invitational', '2021-04-04 06:16:45', 'ceg', '2021-04-04 06:16:45', 'ceg');
INSERT INTO `fight_event_group` VALUES ('TSL_SUNCRUSHER', 'Suncrusher', 'Suncrusher', '2021-04-04 06:16:45', 'ceg', '2021-04-04 06:16:45', 'ceg');
INSERT INTO `fight_event_group` VALUES ('TSL_UNDERGROUND', 'Underground Fight Series', 'Underground', '2021-04-04 06:16:45', 'ceg', '2021-04-04 06:16:45', 'ceg');
INSERT INTO `fight_event_group` VALUES ('TSL_WIZARD_WORLD_CHICAGO', 'Wizard World Chicago', 'Wizard World Chicago', '2021-04-04 06:16:45', 'ceg', '2021-04-04 06:16:45', 'ceg');
INSERT INTO `fight_event_group` VALUES ('TSL_WIZARD_WORLD_COLUMBUS', 'Wizard World Columbus', 'Wizard World Columbus', '2021-04-04 06:16:45', 'ceg', '2021-04-04 06:16:45', 'ceg');
INSERT INTO `fight_event_group` VALUES ('TSL_WORLDS', 'TSL World Championshops', 'TSL Worlds', '2021-04-04 06:16:45', 'ceg', '2021-04-04 06:16:45', 'ceg');

-- ----------------------------
-- Table structure for fight_event_staff
-- ----------------------------
DROP TABLE IF EXISTS `fight_event_staff`;
CREATE TABLE `fight_event_staff` (
  `fight_staff_id` int NOT NULL AUTO_INCREMENT,
  `fight_event_id` bigint DEFAULT NULL,
  `event_group_code` varchar(16) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `fight_directors_json` varchar(128) DEFAULT NULL,
  `judges_json` varchar(1000) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `volunteers_json` varchar(1000) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `contact_id` int DEFAULT NULL,
  `is_active` int DEFAULT '1',
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `modified_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified_by` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  PRIMARY KEY (`fight_staff_id`),
  KEY `fk_staff_contact_id` (`contact_id`) USING BTREE,
  KEY `fk_staff_group_code` (`event_group_code`) USING BTREE,
  KEY `fight_event_staff_fk_event` (`fight_event_id`),
  CONSTRAINT `fight_event_staff_fk_event` FOREIGN KEY (`fight_event_id`) REFERENCES `fight_event` (`event_id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of fight_event_staff
-- ----------------------------

-- ----------------------------
-- Table structure for image
-- ----------------------------
DROP TABLE IF EXISTS `image`;
CREATE TABLE `image` (
  `image_id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(64) CHARACTER SET utf16 COLLATE utf16_general_ci DEFAULT '',
  `description` varchar(64) CHARACTER SET utf16 COLLATE utf16_general_ci DEFAULT '',
  `source` varchar(64) CHARACTER SET utf16 COLLATE utf16_general_ci DEFAULT NULL,
  `image` blob,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NOT NULL DEFAULT '1970-01-01 02:00:01',
  PRIMARY KEY (`image_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

-- ----------------------------
-- Records of image
-- ----------------------------

-- ----------------------------
-- Table structure for secret_question_lu
-- ----------------------------
DROP TABLE IF EXISTS `secret_question_lu`;
CREATE TABLE `secret_question_lu` (
  `secret_question_id` int NOT NULL AUTO_INCREMENT,
  `question` varchar(256) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`secret_question_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of secret_question_lu
-- ----------------------------
INSERT INTO `secret_question_lu` VALUES ('1', 'What was your favorite place to visit as a child?', '2018-12-01 16:57:23');
INSERT INTO `secret_question_lu` VALUES ('2', 'Who is your favorite actor?', '2018-12-01 16:57:23');
INSERT INTO `secret_question_lu` VALUES ('3', 'Who is your favorite musician?', '2018-12-01 16:57:23');
INSERT INTO `secret_question_lu` VALUES ('4', 'What was the name as your pet as a child?', '2018-12-01 16:57:23');
INSERT INTO `secret_question_lu` VALUES ('5', 'In what city were you born?', '2018-12-01 16:57:24');
INSERT INTO `secret_question_lu` VALUES ('6', 'What is your favorite movie?', '2018-12-01 16:57:24');
INSERT INTO `secret_question_lu` VALUES ('7', 'What street did you grow up on?', '2018-12-01 16:57:24');
INSERT INTO `secret_question_lu` VALUES ('8', 'What was the color of your first car?', '2018-12-01 16:57:24');
INSERT INTO `secret_question_lu` VALUES ('9', 'What is your father\'s middle name?', '2018-12-01 16:57:24');
INSERT INTO `secret_question_lu` VALUES ('10', 'What is your mother\'s maiden name?', '2018-12-01 16:57:24');
INSERT INTO `secret_question_lu` VALUES ('11', 'What is the first name of the first person you kissed?', '2018-12-01 16:57:24');
INSERT INTO `secret_question_lu` VALUES ('12', 'What is your secret pleasure?', '2018-12-01 16:57:24');
INSERT INTO `secret_question_lu` VALUES ('13', 'What did you name your first drone?', '2018-12-01 16:57:24');
INSERT INTO `secret_question_lu` VALUES ('14', 'You have 99 problems but what is not one of them?', '2018-12-01 16:57:24');

-- ----------------------------
-- Table structure for skill_level_lu
-- ----------------------------
DROP TABLE IF EXISTS `skill_level_lu`;
CREATE TABLE `skill_level_lu` (
  `skill_level_id` int unsigned NOT NULL AUTO_INCREMENT,
  `full_name` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `abbr_name` varchar(16) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `skill_level_group_id` int unsigned DEFAULT NULL,
  `ranking` int DEFAULT NULL,
  PRIMARY KEY (`skill_level_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of skill_level_lu
-- ----------------------------

-- ----------------------------
-- Table structure for system_config
-- ----------------------------
DROP TABLE IF EXISTS `system_config`;
CREATE TABLE `system_config` (
  `system_config_id` bigint NOT NULL AUTO_INCREMENT,
  `label` varchar(64) CHARACTER SET utf16 COLLATE utf16_general_ci DEFAULT NULL,
  `value` varchar(256) CHARACTER SET utf16 COLLATE utf16_general_ci DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_by` varchar(128) DEFAULT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(128) DEFAULT NULL,
  `updated_date` timestamp NOT NULL DEFAULT '1970-01-01 02:00:01',
  PRIMARY KEY (`system_config_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

-- ----------------------------
-- Records of system_config
-- ----------------------------

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(64) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL,
  `password` varchar(64) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL,
  `name_json` varchar(200) CHARACTER SET utf16 COLLATE utf16_general_ci DEFAULT NULL,
  `email` varchar(64) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL,
  `phone_numbers` varchar(200) CHARACTER SET utf16 COLLATE utf16_general_ci DEFAULT NULL,
  `social_media_json` varchar(200) CHARACTER SET utf16 COLLATE utf16_general_ci DEFAULT NULL,
  `country_code` varchar(3) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL,
  `state_or_province` varchar(64) DEFAULT NULL,
  `volunteer_json` varchar(255) DEFAULT NULL,
  `password_recovery_json` varchar(500) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL,
  `additional_info_json` varchar(200) CHARACTER SET utf16 COLLATE utf16_general_ci DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(128) NOT NULL,
  `updated_date` timestamp NULL DEFAULT '1970-01-01 02:00:01',
  `updated_by` varchar(128) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

-- ----------------------------
-- Records of user
-- ----------------------------

-- ----------------------------
-- Table structure for user_preference
-- ----------------------------
DROP TABLE IF EXISTS `user_preference`;
CREATE TABLE `user_preference` (
  `user_preference_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `label` varchar(64) CHARACTER SET utf16 COLLATE utf16_general_ci DEFAULT NULL,
  `value` varchar(256) CHARACTER SET utf16 COLLATE utf16_general_ci DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_by` varchar(128) DEFAULT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(128) DEFAULT NULL,
  `updated_date` timestamp NOT NULL DEFAULT '1970-01-01 02:00:01',
  PRIMARY KEY (`user_preference_id`),
  KEY `fk_up_user_id` (`user_id`) USING BTREE,
  CONSTRAINT `user_preference_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

-- ----------------------------
-- Records of user_preference
-- ----------------------------

-- ----------------------------
-- Table structure for us_state_lu
-- ----------------------------
DROP TABLE IF EXISTS `us_state_lu`;
CREATE TABLE `us_state_lu` (
  `id` smallint NOT NULL AUTO_INCREMENT,
  `code` char(2) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `name` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of us_state_lu
-- ----------------------------
INSERT INTO `us_state_lu` VALUES ('1', 'AL', 'Alabama', '1');
INSERT INTO `us_state_lu` VALUES ('2', 'AK', 'Alaska', '1');
INSERT INTO `us_state_lu` VALUES ('3', 'AS', 'American Samoa', '1');
INSERT INTO `us_state_lu` VALUES ('4', 'AZ', 'Arizona', '1');
INSERT INTO `us_state_lu` VALUES ('5', 'AR', 'Arkansas', '1');
INSERT INTO `us_state_lu` VALUES ('6', 'CA', 'California', '1');
INSERT INTO `us_state_lu` VALUES ('7', 'CO', 'Colorado', '1');
INSERT INTO `us_state_lu` VALUES ('8', 'CT', 'Connecticut', '1');
INSERT INTO `us_state_lu` VALUES ('9', 'DE', 'Delaware', '1');
INSERT INTO `us_state_lu` VALUES ('10', 'DC', 'District of Columbia', '1');
INSERT INTO `us_state_lu` VALUES ('11', 'FM', 'Federated States of Micronesia', '1');
INSERT INTO `us_state_lu` VALUES ('12', 'FL', 'Florida', '1');
INSERT INTO `us_state_lu` VALUES ('13', 'GA', 'Georgia', '1');
INSERT INTO `us_state_lu` VALUES ('14', 'GU', 'Guam', '1');
INSERT INTO `us_state_lu` VALUES ('15', 'HI', 'Hawaii', '1');
INSERT INTO `us_state_lu` VALUES ('16', 'ID', 'Idaho', '1');
INSERT INTO `us_state_lu` VALUES ('17', 'IL', 'Illinois', '1');
INSERT INTO `us_state_lu` VALUES ('18', 'IN', 'Indiana', '1');
INSERT INTO `us_state_lu` VALUES ('19', 'IA', 'Iowa', '1');
INSERT INTO `us_state_lu` VALUES ('20', 'KS', 'Kansas', '1');
INSERT INTO `us_state_lu` VALUES ('21', 'KY', 'Kentucky', '1');
INSERT INTO `us_state_lu` VALUES ('22', 'LA', 'Louisiana', '1');
INSERT INTO `us_state_lu` VALUES ('23', 'ME', 'Maine', '1');
INSERT INTO `us_state_lu` VALUES ('24', 'MH', 'Marshall Islands', '1');
INSERT INTO `us_state_lu` VALUES ('25', 'MD', 'Maryland', '1');
INSERT INTO `us_state_lu` VALUES ('26', 'MA', 'Massachusetts', '1');
INSERT INTO `us_state_lu` VALUES ('27', 'MI', 'Michigan', '1');
INSERT INTO `us_state_lu` VALUES ('28', 'MN', 'Minnesota', '1');
INSERT INTO `us_state_lu` VALUES ('29', 'MS', 'Mississippi', '1');
INSERT INTO `us_state_lu` VALUES ('30', 'MO', 'Missouri', '1');
INSERT INTO `us_state_lu` VALUES ('31', 'MT', 'Montana', '1');
INSERT INTO `us_state_lu` VALUES ('32', 'NE', 'Nebraska', '1');
INSERT INTO `us_state_lu` VALUES ('33', 'NV', 'Nevada', '1');
INSERT INTO `us_state_lu` VALUES ('34', 'NH', 'New Hampshire', '1');
INSERT INTO `us_state_lu` VALUES ('35', 'NJ', 'New Jersey', '1');
INSERT INTO `us_state_lu` VALUES ('36', 'NM', 'New Mexico', '1');
INSERT INTO `us_state_lu` VALUES ('37', 'NY', 'New York', '1');
INSERT INTO `us_state_lu` VALUES ('38', 'NC', 'North Carolina', '1');
INSERT INTO `us_state_lu` VALUES ('39', 'ND', 'North Dakota', '1');
INSERT INTO `us_state_lu` VALUES ('40', 'MP', 'Northern Mariana Islands', '1');
INSERT INTO `us_state_lu` VALUES ('41', 'OH', 'Ohio', '1');
INSERT INTO `us_state_lu` VALUES ('42', 'OK', 'Oklahoma', '1');
INSERT INTO `us_state_lu` VALUES ('43', 'OR', 'Oregon', '1');
INSERT INTO `us_state_lu` VALUES ('44', 'PW', 'Palau', '1');
INSERT INTO `us_state_lu` VALUES ('45', 'PA', 'Pennsylvania', '1');
INSERT INTO `us_state_lu` VALUES ('46', 'PR', 'Puerto Rico', '1');
INSERT INTO `us_state_lu` VALUES ('47', 'RI', 'Rhode Island', '1');
INSERT INTO `us_state_lu` VALUES ('48', 'SC', 'South Carolina', '1');
INSERT INTO `us_state_lu` VALUES ('49', 'SD', 'South Dakota', '1');
INSERT INTO `us_state_lu` VALUES ('50', 'TN', 'Tennessee', '1');
INSERT INTO `us_state_lu` VALUES ('51', 'TX', 'Texas', '1');
INSERT INTO `us_state_lu` VALUES ('52', 'UT', 'Utah', '1');
INSERT INTO `us_state_lu` VALUES ('53', 'VT', 'Vermont', '1');
INSERT INTO `us_state_lu` VALUES ('54', 'VI', 'Virgin Islands', '1');
INSERT INTO `us_state_lu` VALUES ('55', 'VA', 'Virginia', '1');
INSERT INTO `us_state_lu` VALUES ('56', 'WA', 'Washington', '1');
INSERT INTO `us_state_lu` VALUES ('57', 'WV', 'West Virginia', '1');
INSERT INTO `us_state_lu` VALUES ('58', 'WI', 'Wisconsin', '1');
INSERT INTO `us_state_lu` VALUES ('59', 'WY', 'Wyoming', '1');
