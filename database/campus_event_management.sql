-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: campus_event_management
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `campus_event_management`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `campus_event_management` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `campus_event_management`;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_date` date DEFAULT NULL,
  `current_registered_count` int NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `end_time` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `event_date` date NOT NULL,
  `event_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `max_participants` int NOT NULL,
  `organizer_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `registration_deadline` date NOT NULL,
  `start_time` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `venue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'Workshop','2026-10-03',2,'Comprehensive hands-on workshop covering Spring Boot, RESTful APIs, React.js integration, JPA, and MySQL database best practices for building enterprise-grade web applications.','04:30 PM','2026-10-10','Java Full Stack Workshop',60,'Computer Science Department','2026-10-08','09:30 AM','UPCOMING','Turing Auditorium, Block A'),(2,'Seminar','2026-10-03',2,'Keynote address by industry experts on Generative AI, Large Language Models, Computer Vision, and real-world deployment of machine learning models in modern industry.','01:00 PM','2026-10-13','AI & ML Seminar',120,'AI & DS Department','2026-10-11','10:00 AM','UPCOMING','Main College Seminar Hall'),(3,'Sports','2026-10-03',1,'The biggest inter-departmental athletic extravaganza featuring track and field events, football, basketball, cricket, badminton, and relay championships.','05:00 PM','2026-10-18','Annual Sports Meet 2026',200,'Physical Education Council','2026-10-15','08:00 AM','UPCOMING','University Sports Complex & Grounds'),(4,'Hackathon','2026-10-03',1,'24-hour non-stop campus hackathon to ideate, build, and pitch innovative software and hardware prototypes for real-world sustainable solutions. Great prizes and mentorship!','09:00 AM','2026-10-21','Hackathon 2026',80,'Coding Club & Developer Student Club','2026-10-17','09:00 AM','UPCOMING','Innovation & Incubation Hub'),(5,'Workshop','2026-10-03',0,'Zero to hero intensive crash course on modern frontend engineering: HTML5, CSS3, modern JavaScript ES6+, React Hooks, and state management techniques.','05:30 PM','2026-10-07','Web Development Bootcamp',45,'Information Technology Club','2026-10-05','02:00 PM','UPCOMING','Software Lab 3, IT Block'),(6,'Cultural','2026-10-03',0,'A vibrant three-day cultural celebration including musical concerts, dance battles, battle of bands, theatrical drama, fashion shows, and art exhibitions.','10:00 PM','2026-10-28','Tarang - Annual Cultural Fest',300,'Student Cultural Committee','2026-10-23','04:00 PM','UPCOMING','Open Air Amphitheatre'),(7,'Technical','2026-10-03',0,'Learn essential principles of network security, ethical hacking methodologies, vulnerability assessment, penetration testing, and digital forensics with live demonstrations.','03:00 PM','2026-10-15','Cyber Security & Ethical Hacking Program',75,'Cyber Security Club','2026-10-12','11:00 AM','UPCOMING','Auditorium 2, Tech Park'),(8,'Workshop','2026-10-03',0,'Discover cloud architecture, virtualization, containerization with Docker and Kubernetes, and serverless computing models with practical cloud lab exercises.','02:00 PM','2026-10-24','Cloud Computing with AWS & Azure',50,'Cloud Engineering Forum','2026-10-20','10:00 AM','UPCOMING','Cloud Computing Lab, Block C'),(9,'Club Activity','2026-10-03',0,'Student teams demonstrate smart home gadgets, automated rover designs, drone tech, and sensor networks connected to microcontroller platforms like ESP32 and Arduino.','04:00 PM','2026-10-17','IoT & Robotics Innovation Expo',90,'Robotics & Automation Society','2026-10-14','10:30 AM','UPCOMING','Exhibition Hall, Mechanical Block'),(10,'Seminar','2026-10-03',0,'Exclusive session by top recruitment leads covering resume building, technical coding interview strategies, HR rounds, system design viva tips, and mock interviews.','06:00 PM','2026-10-11','Campus Placement & Interview Prep Seminar',150,'Career & Placement Cell','2026-10-09','03:00 PM','UPCOMING','Placement Training Auditorium');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registrations`
--

DROP TABLE IF EXISTS `registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `registration_date` datetime(6) NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK7mqe6g11pupqpu0cw6cokbra9` (`student_id`,`event_id`),
  KEY `FK8mi58jt1s8fxmi56jnau0cxqw` (`event_id`),
  CONSTRAINT `FK8mi58jt1s8fxmi56jnau0cxqw` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`),
  CONSTRAINT `FKcmo9lk1tap4hpbawuxhb8qf94` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registrations`
--

LOCK TABLES `registrations` WRITE;
/*!40000 ALTER TABLE `registrations` DISABLE KEYS */;
INSERT INTO `registrations` VALUES (1,'2026-10-01 13:30:44.849705','REGISTERED',1,2),(2,'2026-10-02 13:30:44.910525','REGISTERED',4,2),(3,'2026-10-02 13:30:44.934228','REGISTERED',1,3),(4,'2026-10-01 13:30:44.958933','REGISTERED',2,3),(5,'2026-10-03 08:30:44.983783','REGISTERED',2,5),(6,'2026-10-03 10:30:45.008947','REGISTERED',3,5),(7,'2026-10-03 13:56:10.498381','CANCELLED',3,10);
/*!40000 ALTER TABLE `registrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `department` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `year` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_e2rndfrsx22acpq2ty1caeuyw` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,'Administration','admin@campus.edu','Campus Event Admin','$2a$10$JU1Q7Ho46TDPSI/E6f80B.jyUmF6KE7Kec8B7DCSF49wSg9c/Jmyy','9876543210','ADMIN','Faculty'),(2,'CSE','rahul.sharma@campus.edu','Rahul Sharma','$2a$10$u4QZUpzMcIWzoDy44P84UOvFDtD8bROrDkITwSkUY5ByHaFl9mAZ2','9845123456','STUDENT','3rd Year'),(3,'IT','priya.patel@campus.edu','Priya Patel','$2a$10$uJa5.1gem20RGve2K5HAtu1bay2e8bGiflPOUXYOkq7ZzXcsMUs5a','9845234567','STUDENT','2nd Year'),(4,'ECE','amit.kumar@campus.edu','Amit Kumar','$2a$10$bqmu9wZk6Q59eCTB3Rtn6O.J1OIw0K4aMgmfiy/NFvt.RwRt3DSM2','9845345678','STUDENT','4th Year'),(5,'AI & DS','sneha.reddy@campus.edu','Sneha Reddy','$2a$10$FzeFnSem6dKiWxV5JZwDYO1Z4Yvqxrarqr/ZuDFzqGM9XUI/brFG6','9845456789','STUDENT','2nd Year'),(6,'MECH','vikram.singh@campus.edu','Vikram Singh','$2a$10$PFfbcgW5fMGrcAZotKiT..BzCklTL9CTFLa10Q7FackLUC14NLbdS','9845567890','STUDENT','3rd Year'),(7,'EEE','ananya.iyer@campus.edu','Ananya Iyer','$2a$10$yMJJTuipIQltZZwUp9CDGOPqfExmsD6onkFkLQN22.ePEwBndpIUS','9845678901','STUDENT','1st Year'),(8,'CIVIL','karthik.raja@campus.edu','Karthik Raja','$2a$10$/1YA8B02B2pI0UHWJbvc0.Y5QOeWnfGpfQqgtaoWesjHg8SHSYkme','9845789012','STUDENT','4th Year'),(9,'CSE','pooja.verma@campus.edu','Pooja Verma','$2a$10$Jihy6v0OTat4iVZukgQhLOPePPuYfYiNn6Zn8Y4pcU5Qr7XHG/.Gm','9845890123','STUDENT','2nd Year'),(10,'AI & DS','kavitha.raman@campus.edu','Kavitha Raman','$2a$10$Yife/4VIxLFsm7qrrtZkd.iFKIzjS/UROt8wq1uP.OFLuxSnlXcqC','9876501234','STUDENT','3rd Year');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'campus_event_management'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-03 19:26:23
