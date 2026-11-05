CREATE DATABASE IF NOT EXISTS event_org
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE event_org;

CREATE TABLE IF NOT EXISTS events (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug        VARCHAR(80)  NOT NULL UNIQUE,
  title       VARCHAR(160) NOT NULL,
  event_date  DATE NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rsvps (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  event_id      INT UNSIGNED NOT NULL,
  name          VARCHAR(120) NOT NULL,
  phone         VARCHAR(20)  NOT NULL,
  attending     TINYINT(1)   NOT NULL,
  guest_count   TINYINT UNSIGNED NOT NULL DEFAULT 1,
  code          CHAR(10)     NOT NULL UNIQUE,
  checked_in_at DATETIME NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_event_phone (event_id, phone),
  CONSTRAINT fk_rsvps_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- acara pertama (slug harus sama dengan URL /weeding/raka-and-naya)
INSERT IGNORE INTO events (slug, title) VALUES ('raka-and-naya', 'Pernikahan Raka & Naya');
