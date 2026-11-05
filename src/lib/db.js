// Hanya untuk server. Satu pool dipakai ulang (aman saat hot reload di dev).
import mysql from "mysql2/promise";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL belum diatur di .env.local");
}

export const pool =
  globalThis.__mysqlPool ??
  (globalThis.__mysqlPool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 5,
    charset: "utf8mb4",
  }));
