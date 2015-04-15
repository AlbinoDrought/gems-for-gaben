-- phpMyAdmin SQL Dump
-- version 4.2.12
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Nov 29, 2014 at 07:32 AM
-- Server version: 5.5.40-0ubuntu0.14.04.1
-- PHP Version: 5.5.9-1ubuntu4.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `GemsForGaben`
--

-- --------------------------------------------------------

--
-- Table structure for table `Highscore`
--

CREATE TABLE IF NOT EXISTS `Highscore` (
`sID` int(11) NOT NULL,
  `sName` varchar(50) NOT NULL,
  `sScore` int(11) NOT NULL,
  `sDifficulty` int(11) NOT NULL,
  `sGameMode` tinyint(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Highscore`
--

INSERT INTO `Highscore` (`sID`, `sName`, `sScore`, `sDifficulty`, `sGameMode`) VALUES
(1, 'Sean', 1337, 10, 1),
(4, 'Joe', 1337, 0, 1),
(5, 'James', 5, 0, 0),
(6, 'test2', 30, 0, 0),
(7, 'joe', 223, 2, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Highscore`
--
ALTER TABLE `Highscore`
 ADD PRIMARY KEY (`sID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Highscore`
--
ALTER TABLE `Highscore`
MODIFY `sID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=8;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
