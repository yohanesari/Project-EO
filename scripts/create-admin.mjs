// Membuat admin baru, atau mengganti password admin yang sudah ada.
//
// Pakai (dari folder project):
//   node --env-file=.env.local scripts/create-admin.mjs <username> <password> "<Nama Lengkap>"
//
// Contoh:
//   node --env-file=.env.local scripts/create-admin.mjs admin "RahasiaPanjang123" "Admin Aeterna"
//
import mysql from "mysql2/promise";
import { randomBytes, scrypt as _scrypt } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(_scrypt);

// Format harus sama dengan src/lib/password.js
async function hashPassword(password) {
  const salt = randomBytes(16);
  const key = await scrypt(String(password), salt, 64);
  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}

const [rawUser, password, ...nameParts] = process.argv.slice(2);
const username = String(rawUser ?? "").trim().toLowerCase();
const name = nameParts.join(" ").trim() || username;

if (!/^[a-z0-9._-]{3,50}$/.test(username)) {
  console.error("Username 3-50 karakter: huruf kecil, angka, titik, strip, atau garis bawah.");
  process.exit(1);
}
if (!password || password.length < 8) {
  console.error("Password minimal 8 karakter.");
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL tidak terbaca. Jalankan dengan: node --env-file=.env.local ...");
  process.exit(1);
}

const db = await mysql.createConnection(process.env.DATABASE_URL);
try {
  await db.query(
    `INSERT INTO admins (username, name, password_hash) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE name = VALUES(name), password_hash = VALUES(password_hash), is_active = 1`,
    [username, name, await hashPassword(password)]
  );
  console.log(`Admin "${username}" (${name}) siap dipakai.`);
} catch (err) {
  if (err.code === "ER_NO_SUCH_TABLE") {
    console.error("Tabel admins belum ada. Jalankan db/admins.sql lebih dulu.");
  } else {
    console.error(err.message);
  }
  process.exitCode = 1;
} finally {
  await db.end();
}
