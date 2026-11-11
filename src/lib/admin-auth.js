// Hanya untuk server. Login admin: akun di tabel `admins` + cookie sesi bertanda tangan.
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { pool } from "./db";

export const COOKIE = "admin_session";
export const SESSION_SECONDS = 12 * 60 * 60;

function secret() {
  const s = process.env.ADMIN_SECRET;
  if (!s || s.length < 16) {
    throw new Error("ADMIN_SECRET belum diatur di .env.local (minimal 16 karakter)");
  }
  return s;
}

const sign = (payload) => createHmac("sha256", secret()).update(payload).digest("hex");

// token: <id admin>.<kedaluwarsa>.<tanda tangan>
export function createSession(adminId) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = `${adminId}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

function readSession(token) {
  if (!token) return null;
  const parts = String(token).split(".");
  if (parts.length !== 3) return null;
  const [id, exp, sig] = parts;
  if (!/^\d+$/.test(id) || !/^\d+$/.test(exp)) return null;
  const expected = Buffer.from(sign(`${id}.${exp}`));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  if (Number(exp) <= Date.now() / 1000) return null;
  return Number(id);
}

// Akun yang dinonaktifkan langsung ditolak, walaupun cookie-nya masih berlaku
export async function adminFromToken(token) {
  const id = readSession(token);
  if (!id) return null;
  const [rows] = await pool.query(
    "SELECT id, username, name FROM admins WHERE id = ? AND is_active = 1",
    [id]
  );
  return rows[0] ?? null;
}

export async function findAdminByUsername(username) {
  const [rows] = await pool.query(
    "SELECT id, username, name, password_hash FROM admins WHERE username = ? AND is_active = 1",
    [username]
  );
  return rows[0] ?? null;
}

export async function touchLogin(id) {
  await pool.query("UPDATE admins SET last_login_at = UTC_TIMESTAMP() WHERE id = ?", [id]);
}

// untuk halaman (server component)
export async function getAdmin() {
  const store = await cookies();
  return adminFromToken(store.get(COOKIE)?.value);
}

// untuk API route: { admin } bila boleh lanjut, atau { denied } berisi respons 401
export async function requireAdmin(req) {
  const admin = await adminFromToken(req.cookies.get(COOKIE)?.value);
  if (admin) return { admin };
  return {
    denied: NextResponse.json({ error: "Sesi berakhir. Silakan masuk lagi." }, { status: 401 }),
  };
}
