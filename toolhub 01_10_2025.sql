-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 01 oct. 2025 à 13:44
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `toolhub`
--

-- --------------------------------------------------------

--
-- Structure de la table `bookmarks`
--

CREATE TABLE `bookmarks` (
  `ID_User` int(10) UNSIGNED NOT NULL,
  `ID_Tools` int(10) UNSIGNED NOT NULL,
  `Add_Date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `bookmarks`
--

INSERT INTO `bookmarks` (`ID_User`, `ID_Tools`, `Add_Date`) VALUES
(1, 1, '2025-06-28'),
(1, 3, '2025-06-27'),
(2, 2, '2025-06-26'),
(2, 5, '2025-06-25'),
(3, 4, '2025-06-24'),
(3, 6, '2025-06-23');

-- --------------------------------------------------------

--
-- Structure de la table `category`
--

CREATE TABLE `category` (
  `ID_Category` int(10) UNSIGNED NOT NULL,
  `Name_Category` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `category`
--

INSERT INTO `category` (`ID_Category`, `Name_Category`) VALUES
(1, 'Design'),
(2, 'Developement'),
(3, 'Communication'),
(4, 'Data Analysis'),
(13, 'productivity');

-- --------------------------------------------------------

--
-- Structure de la table `create_toolbox`
--

CREATE TABLE `create_toolbox` (
  `ID_User` int(10) UNSIGNED NOT NULL,
  `ID_Tools` int(10) UNSIGNED NOT NULL,
  `Add_Date` date DEFAULT NULL,
  `NameToolbox` varchar(100) DEFAULT NULL,
  `Link_Toolbox` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `create_toolbox`
--

INSERT INTO `create_toolbox` (`ID_User`, `ID_Tools`, `Add_Date`, `NameToolbox`, `Link_Toolbox`) VALUES
(1, 1, '2025-06-28', 'Design Essentials', 'https://mytoolbox.com/design'),
(1, 2, '2025-06-27', 'Dev Mastery', 'https://mytoolbox.com/development'),
(2, 3, '2025-06-25', 'Team Chat', 'https://workspace.example.com/slack'),
(2, 4, '2025-06-26', 'Creative Suite', 'https://workspace.example.com/photoshop'),
(3, 5, '2025-06-20', 'Analytics Tools', 'https://analytics.example.com'),
(3, 6, '2025-06-21', 'Meet & Greet', 'https://meet.example.com');

-- --------------------------------------------------------

--
-- Structure de la table `docs`
--

CREATE TABLE `docs` (
  `ID_Tools` int(10) UNSIGNED NOT NULL,
  `ID_Ressource` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `docs`
--

INSERT INTO `docs` (`ID_Tools`, `ID_Ressource`) VALUES
(1, 7),
(1, 8),
(2, 15),
(2, 16),
(3, 17),
(3, 18),
(4, 12),
(4, 13),
(4, 14),
(5, 19),
(5, 20),
(6, 21),
(6, 22);

-- --------------------------------------------------------

--
-- Structure de la table `need_platform`
--

CREATE TABLE `need_platform` (
  `ID_Tools` int(10) UNSIGNED NOT NULL,
  `ID_Platform` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `need_platform`
--

INSERT INTO `need_platform` (`ID_Tools`, `ID_Platform`) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 2),
(3, 1),
(3, 2),
(3, 3),
(4, 2),
(4, 3),
(5, 1),
(5, 2),
(5, 3),
(6, 1),
(6, 2),
(6, 3);

-- --------------------------------------------------------

--
-- Structure de la table `os`
--

CREATE TABLE `os` (
  `ID_OS` int(10) UNSIGNED NOT NULL,
  `Name_OS` varchar(100) NOT NULL,
  `Icon_OS` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `os`
--

INSERT INTO `os` (`ID_OS`, `Name_OS`, `Icon_OS`) VALUES
(1, 'Windows', 'Assets/Platform Icon/icons8-windows-os.svg'),
(2, 'MacOS', 'Assets/Platform Icon/icons8-mac-os.svg'),
(3, 'Linux', 'Assets/Platform Icon/linux-svgrepo-com.svg'),
(4, 'Android', 'Assets/Platform Icon/icons8-android.svg'),
(5, 'iOS', 'Assets/Platform Icon/icons8-ios.svg');

-- --------------------------------------------------------

--
-- Structure de la table `platforms`
--

CREATE TABLE `platforms` (
  `ID_Platform` int(10) UNSIGNED NOT NULL,
  `Platform_Name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `platforms`
--

INSERT INTO `platforms` (`ID_Platform`, `Platform_Name`) VALUES
(1, 'Web'),
(2, 'Desktop'),
(3, 'Mobile');

-- --------------------------------------------------------

--
-- Structure de la table `rating`
--

CREATE TABLE `rating` (
  `ID_User` int(10) UNSIGNED NOT NULL,
  `ID_Tools` int(10) UNSIGNED NOT NULL,
  `Add_Date` date DEFAULT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `Stars` decimal(15,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `rating`
--

INSERT INTO `rating` (`ID_User`, `ID_Tools`, `Add_Date`, `Description`, `Stars`) VALUES
(1, 1, '2025-06-27', 'Great tool for quick prototyping.', 4.00),
(1, 2, '2025-06-26', 'Lightweight and powerful code editor.', 5.00),
(1, 3, '2025-06-22', 'Slack is essential at work.', 3.00),
(2, 1, '2025-06-21', 'Figma really eases collaborative design.', 5.00),
(2, 3, '2025-06-25', 'Very useful for team communication.', 4.00),
(2, 4, '2025-06-25', 'Professional photo editing but a bit pricey.', 3.50),
(3, 5, '2025-06-24', 'Top-notch web traffic analytics.', 4.80),
(3, 6, '2025-06-23', 'Meetings are easy and smooth.', 4.20);

-- --------------------------------------------------------

--
-- Structure de la table `ressources`
--

CREATE TABLE `ressources` (
  `ID_Ressource` int(10) UNSIGNED NOT NULL,
  `Path` varchar(255) NOT NULL,
  `Title` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `ressources`
--

INSERT INTO `ressources` (`ID_Ressource`, `Path`, `Title`) VALUES
(1, 'https://developer.mozilla.org/fr/', 'MDN Web Docs – Comprehensive documentation on HTML, CSS, JavaScript, and more.'),
(2, 'https://www.w3schools.com/', 'W3Schools – Tutorials and web references.'),
(3, 'https://css-tricks.com/', 'CSS-Tricks – Tips and articles on CSS and front-end development.'),
(4, 'https://www.freecodecamp.org/', 'freeCodeCamp – Free courses to learn coding.'),
(5, 'https://openclassrooms.com/fr/', 'OpenClassrooms – Online courses for web development and more.'),
(6, 'https://github.com/', 'GitHub – Code hosting and collaboration.'),
(7, 'https://www.figma.com/community', 'Figma Community – UI kits, icons, templates, and resources shared by the community.'),
(8, 'https://www.figma.com/resources/learn-design/', 'Figma Learn Design – Tutorials and guides to get started with Figma.'),
(9, 'https://www.flaticon.com/', 'Flaticon – Millions of free vector icons.'),
(10, 'https://unsplash.com/', 'Unsplash – Royalty-free and free photos for your projects.'),
(11, 'https://fonts.google.com/', 'Google Fonts – Free and open-source fonts for the web.'),
(12, 'https://helpx.adobe.com/fr/photoshop/tutorials.html', 'Official Photoshop tutorials – Learn the basics and advanced techniques.'),
(13, 'https://www.photoshopessentials.com/', 'Photoshop Essentials – Practical tutorials, effects, filters, and tips.'),
(14, 'https://www.creativebloq.com/how-to/photoshop', 'Photoshop Tips – Tips, guides, and inspiration for Photoshop.'),
(15, 'https://code.visualstudio.com/docs', 'VS Code Docs – Official documentation and user guides.'),
(16, 'https://www.freecodecamp.org/news/the-visual-studio-code-handbook/', 'VS Code Handbook – Tips, extensions, and productivity in VS Code.'),
(17, 'https://slack.com/help/categories/200111606', 'Slack Help Center – Tutorials, integrations, and best practices.'),
(18, 'https://zapier.com/blog/slack-tips/', 'Slack Tips – Tips to automate and save time on Slack.'),
(19, 'https://analytics.google.com/analytics/academy/', 'Google Analytics Academy – Free training on Google Analytics.'),
(20, 'https://www.lovesdata.com/blog/google-analytics-tips', 'Google Analytics Tips – Tips and tricks for effectively analyzing your data.'),
(21, 'https://support.google.com/meet/answer/9302870?hl=fr', 'Google Meet Help – User guide and best practices for online meetings.'),
(22, 'https://zapier.com/blog/google-meet-tips/', 'Google Meet Tips – Tips for effective video conferences.');

-- --------------------------------------------------------

--
-- Structure de la table `roles`
--

CREATE TABLE `roles` (
  `ID_Role` int(10) UNSIGNED NOT NULL,
  `Name_Role` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `roles`
--

INSERT INTO `roles` (`ID_Role`, `Name_Role`) VALUES
(1, 'visitor'),
(2, 'member'),
(3, 'admin'),
(4, 'moderator');

-- --------------------------------------------------------

--
-- Structure de la table `run_on`
--

CREATE TABLE `run_on` (
  `ID_Tools` int(10) UNSIGNED NOT NULL,
  `ID_OS` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `run_on`
--

INSERT INTO `run_on` (`ID_Tools`, `ID_OS`) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 2),
(2, 3),
(3, 1),
(3, 2),
(3, 3),
(3, 4),
(3, 5),
(4, 1),
(4, 2),
(4, 4),
(4, 5),
(5, 1),
(5, 2),
(5, 3),
(5, 4),
(5, 5),
(6, 1),
(6, 2),
(6, 3),
(6, 4),
(6, 5);

-- --------------------------------------------------------

--
-- Structure de la table `statuts`
--

CREATE TABLE `statuts` (
  `ID_Statut` int(10) UNSIGNED NOT NULL,
  `Name_Statut` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `statuts`
--

INSERT INTO `statuts` (`ID_Statut`, `Name_Statut`) VALUES
(1, 'Active'),
(2, 'pending'),
(3, 'archived'),
(4, 'deprecated'),
(5, 'draft'),
(6, 'rejected');

-- --------------------------------------------------------

--
-- Structure de la table `tools`
--

CREATE TABLE `tools` (
  `ID_Tools` int(10) UNSIGNED NOT NULL,
  `Name_Tools` varchar(100) DEFAULT NULL,
  `Description_Tools` varchar(255) DEFAULT NULL,
  `Link_Tools` varchar(255) DEFAULT NULL,
  `ImageTools` varchar(255) DEFAULT NULL,
  `Image_Alt` varchar(255) DEFAULT NULL,
  `Add_Date` datetime DEFAULT NULL,
  `ID_Statut` int(10) UNSIGNED NOT NULL,
  `ID_Category` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `tools`
--

INSERT INTO `tools` (`ID_Tools`, `Name_Tools`, `Description_Tools`, `Link_Tools`, `ImageTools`, `Image_Alt`, `Add_Date`, `ID_Statut`, `ID_Category`) VALUES
(1, 'Figma', 'Collaborative design tool for creating mockups and prototypes.', 'https://www.figma.com', './Assets/Card Product Icons/figma icon.png', 'Figma Icon', '2025-06-26 16:14:26', 1, 1),
(2, 'Visual Studio Code', 'Code editor, lightweight yet powerful, with many extensions.', 'https://code.visualstudio.com/', './Assets/Card Product Icons/vs code icon.png', 'Visual Studio Code Icon', '2025-06-26 16:14:26', 1, 2),
(3, 'Slack', 'Team platform for real-time chats, file sharing, and integrations.', 'https://slack.com/intl/fr-ch/', './Assets/Card Product Icons/slack icon.png', 'Slack Icon', '2025-06-26 16:14:26', 1, 3),
(4, 'Adobe Photoshop', 'Professional image editing and graphic design software.', 'https://www.adobe.com/ch_fr/products/photoshop.html', './Assets/Card Product Icons/photoshop icon.png', 'Adobe Photoshop Icon', '2025-06-26 16:14:26', 1, 1),
(5, 'Google Analytics', 'Web traffic analysis tool for tracking and analyzing website.', 'https://business.google.com/us/google-analytics', './Assets/Card Product Icons/google Analytics icon.png', 'Google Analytics Icon', '2025-06-26 16:14:26', 1, 4),
(6, 'Google Meet', 'Google video conferencing service for secure, high-quality meetings.', 'https://workspace.google.com/products/meet/', './Assets/Card Product Icons/google meet icon.png', 'Google Meet Icon', '2025-06-26 16:14:26', 1, 3);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `ID_User` int(10) UNSIGNED NOT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `Register_date` date DEFAULT NULL,
  `ID_Role` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`ID_User`, `Name`, `Email`, `Password`, `Register_date`, `ID_Role`) VALUES
(1, 'GuestBot', 'guest@example.com', '$2y$10$VisitorFakePassword12345', '2024-01-01', 1),
(2, 'Alice Dupont', 'alice@example.com', '$2y$10$AliceHashPass1234567890', '2024-02-01', 2),
(3, 'Bob Martin', 'bob@example.com', '$2y$10$BobHashPasswordFake99999', '2024-03-10', 2),
(4, 'Charlie Nguyen', 'charlie@example.com', '$2y$10$CharlieFakeHash666666', '2024-03-15', 2),
(5, 'Lina Bakri', 'lina@example.com', '$2y$10$LinaFakeHash77777777777', '2024-04-01', 2),
(6, 'AdminMaster', 'admin@toolhub.dev', '$2y$10$AdminTopSecret12345678', '2023-12-25', 3),
(7, 'Max Control', 'mod@toolhub.dev', '$2y$10$ModHashForModeration9999', '2024-01-15', 4);

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `v_tools_summary`
-- (Voir ci-dessous la vue réelle)
--
CREATE TABLE `v_tools_summary` (
`ID_Tools` int(10) unsigned
,`ImageTools` varchar(255)
,`Name_Tools` varchar(100)
,`Description_Tools` varchar(255)
,`Name_Category` varchar(100)
,`Name_OS` mediumtext
,`Stars` decimal(16,2)
,`Link_Tools` varchar(255)
,`Platform_Name` mediumtext
,`Bookmarks` bigint(21)
);

-- --------------------------------------------------------

--
-- Structure de la vue `v_tools_summary`
--
DROP TABLE IF EXISTS `v_tools_summary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_tools_summary`  AS SELECT `t`.`ID_Tools` AS `ID_Tools`, `t`.`ImageTools` AS `ImageTools`, `t`.`Name_Tools` AS `Name_Tools`, `t`.`Description_Tools` AS `Description_Tools`, `c`.`Name_Category` AS `Name_Category`, group_concat(distinct `o`.`Name_OS` order by `o`.`Name_OS` ASC separator ', ') AS `Name_OS`, round(avg(`r`.`Stars`),2) AS `Stars`, `t`.`Link_Tools` AS `Link_Tools`, group_concat(distinct `p`.`Platform_Name` order by `p`.`Platform_Name` ASC separator ', ') AS `Platform_Name`, count(distinct `b`.`ID_User`) AS `Bookmarks` FROM (((((((`tools` `t` left join `category` `c` on(`t`.`ID_Category` = `c`.`ID_Category`)) left join `run_on` `ro` on(`t`.`ID_Tools` = `ro`.`ID_Tools`)) left join `os` `o` on(`ro`.`ID_OS` = `o`.`ID_OS`)) left join `need_platform` `np` on(`t`.`ID_Tools` = `np`.`ID_Tools`)) left join `platforms` `p` on(`np`.`ID_Platform` = `p`.`ID_Platform`)) left join `rating` `r` on(`t`.`ID_Tools` = `r`.`ID_Tools`)) left join `bookmarks` `b` on(`t`.`ID_Tools` = `b`.`ID_Tools`)) GROUP BY `t`.`ID_Tools`, `t`.`ImageTools`, `t`.`Name_Tools`, `t`.`Description_Tools`, `c`.`Name_Category`, `t`.`Link_Tools` ;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `bookmarks`
--
ALTER TABLE `bookmarks`
  ADD PRIMARY KEY (`ID_User`,`ID_Tools`),
  ADD KEY `ID_Tools` (`ID_Tools`);

--
-- Index pour la table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`ID_Category`);

--
-- Index pour la table `create_toolbox`
--
ALTER TABLE `create_toolbox`
  ADD PRIMARY KEY (`ID_User`,`ID_Tools`),
  ADD KEY `ID_Tools` (`ID_Tools`);

--
-- Index pour la table `docs`
--
ALTER TABLE `docs`
  ADD PRIMARY KEY (`ID_Tools`,`ID_Ressource`),
  ADD KEY `ID_Ressource` (`ID_Ressource`);

--
-- Index pour la table `need_platform`
--
ALTER TABLE `need_platform`
  ADD PRIMARY KEY (`ID_Tools`,`ID_Platform`),
  ADD KEY `ID_Platform` (`ID_Platform`);

--
-- Index pour la table `os`
--
ALTER TABLE `os`
  ADD PRIMARY KEY (`ID_OS`);

--
-- Index pour la table `platforms`
--
ALTER TABLE `platforms`
  ADD PRIMARY KEY (`ID_Platform`);

--
-- Index pour la table `rating`
--
ALTER TABLE `rating`
  ADD PRIMARY KEY (`ID_User`,`ID_Tools`),
  ADD KEY `ID_Tools` (`ID_Tools`);

--
-- Index pour la table `ressources`
--
ALTER TABLE `ressources`
  ADD PRIMARY KEY (`ID_Ressource`);

--
-- Index pour la table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`ID_Role`);

--
-- Index pour la table `run_on`
--
ALTER TABLE `run_on`
  ADD PRIMARY KEY (`ID_Tools`,`ID_OS`),
  ADD KEY `ID_OS` (`ID_OS`);

--
-- Index pour la table `statuts`
--
ALTER TABLE `statuts`
  ADD PRIMARY KEY (`ID_Statut`);

--
-- Index pour la table `tools`
--
ALTER TABLE `tools`
  ADD PRIMARY KEY (`ID_Tools`),
  ADD KEY `ID_Statut` (`ID_Statut`),
  ADD KEY `ID_Category` (`ID_Category`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID_User`),
  ADD KEY `ID_Role` (`ID_Role`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `category`
--
ALTER TABLE `category`
  MODIFY `ID_Category` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `os`
--
ALTER TABLE `os`
  MODIFY `ID_OS` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT pour la table `platforms`
--
ALTER TABLE `platforms`
  MODIFY `ID_Platform` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT pour la table `ressources`
--
ALTER TABLE `ressources`
  MODIFY `ID_Ressource` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT pour la table `roles`
--
ALTER TABLE `roles`
  MODIFY `ID_Role` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `statuts`
--
ALTER TABLE `statuts`
  MODIFY `ID_Statut` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `tools`
--
ALTER TABLE `tools`
  MODIFY `ID_Tools` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `ID_User` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `bookmarks`
--
ALTER TABLE `bookmarks`
  ADD CONSTRAINT `bookmarks_ibfk_1` FOREIGN KEY (`ID_User`) REFERENCES `users` (`ID_User`),
  ADD CONSTRAINT `bookmarks_ibfk_2` FOREIGN KEY (`ID_Tools`) REFERENCES `tools` (`ID_Tools`);

--
-- Contraintes pour la table `create_toolbox`
--
ALTER TABLE `create_toolbox`
  ADD CONSTRAINT `create_toolbox_ibfk_1` FOREIGN KEY (`ID_User`) REFERENCES `users` (`ID_User`),
  ADD CONSTRAINT `create_toolbox_ibfk_2` FOREIGN KEY (`ID_Tools`) REFERENCES `tools` (`ID_Tools`);

--
-- Contraintes pour la table `docs`
--
ALTER TABLE `docs`
  ADD CONSTRAINT `docs_ibfk_1` FOREIGN KEY (`ID_Tools`) REFERENCES `tools` (`ID_Tools`),
  ADD CONSTRAINT `docs_ibfk_2` FOREIGN KEY (`ID_Ressource`) REFERENCES `ressources` (`ID_Ressource`);

--
-- Contraintes pour la table `need_platform`
--
ALTER TABLE `need_platform`
  ADD CONSTRAINT `need_platform_ibfk_1` FOREIGN KEY (`ID_Tools`) REFERENCES `tools` (`ID_Tools`),
  ADD CONSTRAINT `need_platform_ibfk_2` FOREIGN KEY (`ID_Platform`) REFERENCES `platforms` (`ID_Platform`);

--
-- Contraintes pour la table `rating`
--
ALTER TABLE `rating`
  ADD CONSTRAINT `rating_ibfk_1` FOREIGN KEY (`ID_User`) REFERENCES `users` (`ID_User`),
  ADD CONSTRAINT `rating_ibfk_2` FOREIGN KEY (`ID_Tools`) REFERENCES `tools` (`ID_Tools`);

--
-- Contraintes pour la table `run_on`
--
ALTER TABLE `run_on`
  ADD CONSTRAINT `run_on_ibfk_1` FOREIGN KEY (`ID_Tools`) REFERENCES `tools` (`ID_Tools`),
  ADD CONSTRAINT `run_on_ibfk_2` FOREIGN KEY (`ID_OS`) REFERENCES `os` (`ID_OS`);

--
-- Contraintes pour la table `tools`
--
ALTER TABLE `tools`
  ADD CONSTRAINT `tools_ibfk_1` FOREIGN KEY (`ID_Statut`) REFERENCES `statuts` (`ID_Statut`),
  ADD CONSTRAINT `tools_ibfk_2` FOREIGN KEY (`ID_Category`) REFERENCES `category` (`ID_Category`);

--
-- Contraintes pour la table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`ID_Role`) REFERENCES `roles` (`ID_Role`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
