-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 17, 2024 at 10:16 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS NGO_Management;
USE NGO_Management;

-- --------------------------------------------------------

-- Start a transaction to ensure data integrity
START TRANSACTION;

-- Create the `center` table
CREATE TABLE `center`
(
    `center_id`       VARCHAR(11)  NOT NULL PRIMARY KEY, -- Unique identifier for the center
    `center_name`     VARCHAR(255) NOT NULL,             -- Name of the center
    `center_location` VARCHAR(255) NOT NULL              -- Location of the center
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

-- Create the `student` table
CREATE TABLE `student`
(
    `student_id`   VARCHAR(11)  NOT NULL PRIMARY KEY,                             -- Unique identifier for the student
    `student_name` VARCHAR(255) NOT NULL,                                         -- Name of the student
    `class`        INT          NOT NULL CHECK (class BETWEEN 1 AND 12),          -- Limit class to valid grades
    `center_id`    VARCHAR(11)  NOT NULL,                                         -- Foreign key referencing the center
    FOREIGN KEY (`center_id`) REFERENCES `center` (`center_id`) ON DELETE CASCADE -- Foreign key constraint
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

-- Create the `volunteer` table
CREATE TABLE `volunteer`
(
    `volunteer_id`        VARCHAR(11)  NOT NULL PRIMARY KEY,                      -- Unique identifier for the volunteer
    `volunteer_name`      VARCHAR(255) NOT NULL,                                  -- Name of the volunteer
    `no_of_session_taken` INT          NOT NULL,                                  -- Number of sessions taken by the volunteer
    `center_id`           VARCHAR(11)  NOT NULL,                                  -- Foreign key referencing the center
    FOREIGN KEY (`center_id`) REFERENCES `center` (`center_id`) ON DELETE CASCADE -- Foreign key constraint
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

-- Triggers for auto-generating IDs
DELIMITER $$

CREATE TRIGGER `generate_center_id`
    BEFORE INSERT
    ON `center`
    FOR EACH ROW
BEGIN
    DECLARE max_id INT;
    DECLARE new_id VARCHAR(10);
    SELECT IFNULL(MAX(CAST(SUBSTRING(center_id, 2) AS UNSIGNED)), 0) INTO max_id FROM center;
    SET max_id = max_id + 1;
    SET new_id = CONCAT('D', LPAD(max_id, 3, '0'));
    SET NEW.center_id = new_id;
END$$

CREATE TRIGGER `generate_student_id`
    BEFORE INSERT
    ON `student`
    FOR EACH ROW
BEGIN
    DECLARE max_id INT;
    DECLARE new_id VARCHAR(10);
    SELECT IFNULL(MAX(CAST(SUBSTRING(student_id, 2) AS UNSIGNED)), 0) INTO max_id FROM student;
    SET max_id = max_id + 1;
    SET new_id = CONCAT('S', LPAD(max_id, 3, '0'));
    SET NEW.student_id = new_id;
END$$

CREATE TRIGGER `generate_volunteer_id`
    BEFORE INSERT
    ON `volunteer`
    FOR EACH ROW
BEGIN
    DECLARE max_id INT;
    DECLARE new_id VARCHAR(10);
    SELECT IFNULL(MAX(CAST(SUBSTRING(volunteer_id, 2) AS UNSIGNED)), 0) INTO max_id FROM volunteer;
    SET max_id = max_id + 1;
    SET new_id = CONCAT('V', LPAD(max_id, 3, '0'));
    SET NEW.volunteer_id = new_id;
END$$

DELIMITER ;

-- --------------------------------------------------------

-- Sample Data for `center`
INSERT INTO `center` (`center_id`, `center_name`, `center_location`)
VALUES ('D001', 'Inderprastha IP Center', 'Near Inderprastha Metro Station, Metro Pillar 343'),
       ('D002', 'Rohini 07 Center', 'Near Ayodhya Chowk Red-light, Naharpur Village'),
       ('D003', 'Dwarka 21 Center', 'Near Dwarka Sector 21 Metro Station, Metro Pillar');

-- Sample Data for `student`
INSERT INTO `student` (`student_id`, `student_name`, `class`, `center_id`)
VALUES ('S001', 'Emma', 10, 'D002'),
       ('S002', 'Liam', 1, 'D001'),
       ('S003', 'Aria', 8, 'D001'),
       ('S004', 'Noah', 10, 'D002');

-- Sample Data for `volunteer`
INSERT INTO `volunteer` (`volunteer_id`, `volunteer_name`, `no_of_session_taken`, `center_id`)
VALUES ('V001', 'John Doe', 10, 'D001'),
       ('V002', 'Jane Smith', 12, 'D002'),
       ('V003', 'Sam Wilson', 8, 'D003');

-- All new insertions do not require `id`

COMMIT;
