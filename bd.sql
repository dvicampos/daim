-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: aseashvt_abogados_asociados
-- ------------------------------------------------------
-- Server version	9.1.0

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
-- Table structure for table `caso_categorias`
--

DROP TABLE IF EXISTS `caso_categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `caso_categorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `caso_id` int NOT NULL,
  `categoria_id` int NOT NULL,
  `cantidad` int DEFAULT NULL,
  `grupo_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `caso_id` (`caso_id`),
  KEY `categoria_id` (`categoria_id`),
  KEY `fk_caso_categorias_grupo` (`grupo_id`),
  CONSTRAINT `caso_categorias_ibfk_1` FOREIGN KEY (`caso_id`) REFERENCES `casos` (`id`),
  CONSTRAINT `caso_categorias_ibfk_2` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`),
  CONSTRAINT `fk_caso_categorias_grupo` FOREIGN KEY (`grupo_id`) REFERENCES `grupos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `caso_categorias`
--

LOCK TABLES `caso_categorias` WRITE;
/*!40000 ALTER TABLE `caso_categorias` DISABLE KEYS */;
INSERT INTO `caso_categorias` VALUES (54,19,11,1,2);
INSERT INTO `caso_categorias` VALUES (55,19,12,1,2);
INSERT INTO `caso_categorias` VALUES (56,17,9,8,NULL);
INSERT INTO `caso_categorias` VALUES (57,17,10,2,NULL);
/*!40000 ALTER TABLE `caso_categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `casos`
--

DROP TABLE IF EXISTS `casos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `casos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cliente_id` int DEFAULT NULL,
  `abogado_id` int DEFAULT NULL,
  `categoria_id` int DEFAULT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `estado` enum('Abierto','Cerrado','Pendiente') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Abierto',
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `precio` decimal(10,2) DEFAULT NULL,
  `fecha_entrega` datetime DEFAULT NULL,
  `fecha_devolucion` datetime DEFAULT NULL,
  `grupo_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cliente_id` (`cliente_id`),
  KEY `abogado_id` (`abogado_id`),
  KEY `categoria_id` (`categoria_id`),
  KEY `fk_casos_grupo` (`grupo_id`),
  CONSTRAINT `casos_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`),
  CONSTRAINT `casos_ibfk_2` FOREIGN KEY (`abogado_id`) REFERENCES `encargados` (`id`),
  CONSTRAINT `casos_ibfk_3` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`),
  CONSTRAINT `fk_casos_grupo` FOREIGN KEY (`grupo_id`) REFERENCES `grupos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `casos`
--

LOCK TABLES `casos` WRITE;
/*!40000 ALTER TABLE `casos` DISABLE KEYS */;
INSERT INTO `casos` VALUES (5,NULL,NULL,NULL,NULL,NULL,'2025-01-05 18:16:32','2025-01-05 18:16:32',251.00,NULL,NULL,NULL);
INSERT INTO `casos` VALUES (6,NULL,NULL,NULL,NULL,NULL,'2025-01-05 18:17:40','2025-01-05 18:17:40',251.00,NULL,NULL,NULL);
INSERT INTO `casos` VALUES (17,9,1,NULL,'A','Abierto','2025-03-12 19:20:08','2025-03-12 23:33:13',10562.00,'2025-03-12 19:19:00','2025-03-19 10:23:00',1);
INSERT INTO `casos` VALUES (19,9,13,NULL,'sdfsg','Abierto','2025-03-12 23:02:36','2025-03-12 23:02:36',36574.00,'2025-03-10 17:01:00','2025-03-12 17:01:00',2);
/*!40000 ALTER TABLE `casos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `stock` int DEFAULT '0',
  `grupo_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_categorias_grupo` (`grupo_id`),
  CONSTRAINT `fk_categorias_grupo` FOREIGN KEY (`grupo_id`) REFERENCES `grupos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (9,'cate 1',1234.00,'saasdsdsfsj sdhs','2025-03-12 19:14:14',12,1);
INSERT INTO `categorias` VALUES (10,'cate 2',345.00,'sassa','2025-03-12 19:14:25',23,1);
INSERT INTO `categorias` VALUES (11,'Angel David',34242.00,'adasa','2025-03-12 23:00:36',23,2);
INSERT INTO `categorias` VALUES (12,'Angel David 2',2332.00,'wsdfsdds','2025-03-12 23:00:47',34,2);
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `apellido` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `telefono` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `direccion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  `grupo_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_caso_clientes_grupo` (`grupo_id`),
  CONSTRAINT `fk_caso_clientes_grupo` FOREIGN KEY (`grupo_id`) REFERENCES `grupos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (7,'Angel David','Aranda Campos','dvicamadsp@gmail.com','2463095291',NULL,'2025-03-12 17:49:08',1);
INSERT INTO `clientes` VALUES (8,'Angel','Aranda Campos','dvicampasdasd@gmail.com','2463095291',NULL,'2025-03-12 18:04:02',1);
INSERT INTO `clientes` VALUES (9,'Angel David','Aranda Campos','dvicamsdsadap@gmail.com','2463095291',NULL,'2025-03-12 19:10:54',1);
INSERT INTO `clientes` VALUES (10,'Angel David','Aranda Campos','sdfssd@gmail.com','2463095291',NULL,'2025-03-12 23:00:16',2);
INSERT INTO `clientes` VALUES (11,'Angel David','Aranda Campos','sasp@gmail.com','2463095291',NULL,'2025-03-12 23:00:21',2);
INSERT INTO `clientes` VALUES (12,'da','a Campos','dvicasfsdsdmp@gmail.com','2463095291',NULL,'2025-03-13 01:15:10',1);
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documentos`
--

DROP TABLE IF EXISTS `documentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documentos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `caso_id` int DEFAULT NULL,
  `nombre_archivo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ruta_archivo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `tipo_documento` enum('PDF','DOC','IMG','Otros') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Otros',
  `fecha_subida` datetime DEFAULT CURRENT_TIMESTAMP,
  `grupo_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `caso_id` (`caso_id`),
  KEY `fk_documentos_grupo` (`grupo_id`),
  CONSTRAINT `documentos_ibfk_1` FOREIGN KEY (`caso_id`) REFERENCES `casos` (`id`),
  CONSTRAINT `fk_documentos_grupo` FOREIGN KEY (`grupo_id`) REFERENCES `grupos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documentos`
--

LOCK TABLES `documentos` WRITE;
/*!40000 ALTER TABLE `documentos` DISABLE KEYS */;
/*!40000 ALTER TABLE `documentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `encargados`
--

DROP TABLE IF EXISTS `encargados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `encargados` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `apellido` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `telefono` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `especialidad` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  `grupo_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_encargados_grupo` (`grupo_id`),
  CONSTRAINT `fk_encargados_grupo` FOREIGN KEY (`grupo_id`) REFERENCES `grupos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `encargados`
--

LOCK TABLES `encargados` WRITE;
/*!40000 ALTER TABLE `encargados` DISABLE KEYS */;
INSERT INTO `encargados` VALUES (1,'Angel David','Aranda Campos','dvicamp@gmail.com','2463095291','Empleado','$2b$10$YCrf0p0OpQebKFPuicMYGOqOH7wRLdBafexpsK0rfVaNxrcrlq.aG','2025-01-05 16:25:59',NULL);
INSERT INTO `encargados` VALUES (11,'Angel David','Aranda Campos','aranda.campos.david@gmail.com','2463095291','No se','$2b$10$xyVY.S6/eZRQYXfrFefd6ezudjcI0WodQ4yeKDCOEExydsEegPHLK','2025-03-12 04:59:58',1);
INSERT INTO `encargados` VALUES (12,'Angel David','Aranda Campos','dvicampas@gmail.com','2463095291','Empleado','$2b$10$aNgqSUs5wdo4Lcn99xDe2OdrOJtvSGoDCuCdRoXI.4eSn6Ch0ZWma','2025-03-12 20:59:26',1);
INSERT INTO `encargados` VALUES (13,'Angel David','Aranda Campos','david@gmail.com','2463095291','Empleador','$2b$10$iLjIx82fePaBMMhBCyQvReUj/5FRaklW1G/XddhDt4WwtT5T4cjJ2','2025-03-12 21:04:04',2);
/*!40000 ALTER TABLE `encargados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grupo_encargado`
--

DROP TABLE IF EXISTS `grupo_encargado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grupo_encargado` (
  `id` int NOT NULL AUTO_INCREMENT,
  `grupo_id` int NOT NULL,
  `encargado_id` int NOT NULL,
  `fecha_union` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `grupo_id` (`grupo_id`),
  KEY `encargado_id` (`encargado_id`),
  CONSTRAINT `grupo_encargado_ibfk_1` FOREIGN KEY (`grupo_id`) REFERENCES `grupos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `grupo_encargado_ibfk_2` FOREIGN KEY (`encargado_id`) REFERENCES `encargados` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grupo_encargado`
--

LOCK TABLES `grupo_encargado` WRITE;
/*!40000 ALTER TABLE `grupo_encargado` DISABLE KEYS */;
INSERT INTO `grupo_encargado` VALUES (4,1,11,'2025-03-12 04:59:58');
INSERT INTO `grupo_encargado` VALUES (5,2,13,'2025-03-12 21:04:04');
/*!40000 ALTER TABLE `grupo_encargado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grupos`
--

DROP TABLE IF EXISTS `grupos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grupos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_empresa` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `rubro` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `ubicacion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `foto_perfil` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grupos`
--

LOCK TABLES `grupos` WRITE;
/*!40000 ALTER TABLE `grupos` DISABLE KEYS */;
INSERT INTO `grupos` VALUES (1,'Alquiladora DAIM','Alquiladora','Alquiladora DAIM','San Cosme Atlamaxac, Tlaxcala','2025-03-12 04:41:24','uploads/1741826511194.jpg');
INSERT INTO `grupos` VALUES (2,'DAVANI','Tecnologia','Empresa de tecnologia','Tlaxcala','2025-03-12 21:03:46','uploads/1741833478365.png');
/*!40000 ALTER TABLE `grupos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notas`
--

DROP TABLE IF EXISTS `notas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `contenido` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `grupo_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_notas_grupo` (`grupo_id`),
  CONSTRAINT `fk_notas_grupo` FOREIGN KEY (`grupo_id`) REFERENCES `grupos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notas`
--

LOCK TABLES `notas` WRITE;
/*!40000 ALTER TABLE `notas` DISABLE KEYS */;
INSERT INTO `notas` VALUES (1,'Titulo 3','asd',1);
INSERT INTO `notas` VALUES (2,'Titulo 3s','sdsfsdf',2);
/*!40000 ALTER TABLE `notas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recordatorios`
--

DROP TABLE IF EXISTS `recordatorios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recordatorios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `contenido` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `completado` tinyint(1) DEFAULT '0',
  `grupo_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_recordatorios_grupo` (`grupo_id`),
  CONSTRAINT `fk_recordatorios_grupo` FOREIGN KEY (`grupo_id`) REFERENCES `grupos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recordatorios`
--

LOCK TABLES `recordatorios` WRITE;
/*!40000 ALTER TABLE `recordatorios` DISABLE KEYS */;
INSERT INTO `recordatorios` VALUES (1,'Titulo 3','asa','2025-03-11','2025-03-22',0,1);
INSERT INTO `recordatorios` VALUES (2,'fsfsf','sdff','2025-03-11','2025-03-14',0,2);
INSERT INTO `recordatorios` VALUES (3,'assa','assasa','2025-03-12','2025-03-12',0,2);
/*!40000 ALTER TABLE `recordatorios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'aseashvt_abogados_asociados'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-12 22:02:55
