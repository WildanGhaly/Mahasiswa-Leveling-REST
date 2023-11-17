-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: mhslvl-rest-db
-- Generation Time: Nov 17, 2023 at 03:26 AM
-- Server version: 8.0.35
-- PHP Version: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `products` (
  `ProductID` int NOT NULL,
  `ProductName` varchar(255) NOT NULL DEFAULT 'Product',
  `Description` text,
  `Category` varchar(255) DEFAULT NULL,
  `Price` decimal(10,2) NOT NULL DEFAULT '1.00',
  `StockQuantity` int NOT NULL DEFAULT '1',
  `ImagePath` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Users` (
  `id` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL DEFAULT 'tester@gmail.com',
  `notification` tinyint(1) NOT NULL DEFAULT '0',
  `name` varchar(255) NOT NULL DEFAULT 'My Name'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user_product` (
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE `products`
  ADD PRIMARY KEY (`ProductID`),
  ADD KEY `Product_Name_Index` (`ProductName`);

ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Users_Username_Unique` (`username`);

ALTER TABLE `user_product`
  ADD PRIMARY KEY (`user_id`,`product_id`),
  ADD KEY `foreign_key_user_id` (`product_id`);

ALTER TABLE `products`
  MODIFY `ProductID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=95;

ALTER TABLE `Users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `user_product`
  ADD CONSTRAINT `foreign_key_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`ProductID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `foreign_key_user_id` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;
