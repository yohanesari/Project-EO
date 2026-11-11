USE event_org;

-- akun admin / petugas
CREATE TABLE IF NOT EXISTS admins (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(50)  NOT NULL UNIQUE,
  name          VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  last_login_at DATETIME NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- mencatat admin mana yang melakukan check-in (jalankan sekali saja)
ALTER TABLE rsvps ADD COLUMN checked_in_by INT UNSIGNED NULL AFTER checked_in_at;
ALTER TABLE rsvps ADD CONSTRAINT fk_rsvps_admin
  FOREIGN KEY (checked_in_by) REFERENCES admins(id) ON DELETE SET NULL;
