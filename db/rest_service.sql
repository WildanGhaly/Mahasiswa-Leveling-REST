CREATE TABLE `challenge` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `threshold` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT INTO `challenge` (`id`, `name`, `description`, `threshold`) VALUES
(1, 'MyTestSubject', 'qqqqqqqqqqqqqqqqqqq', 'aaaaaaaaaaaaaaaaaaaaa');

ALTER TABLE `challenge`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `challenge`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;
