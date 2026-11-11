// Hanya untuk server. Hash password dengan scrypt (bawaan Node, tanpa paket tambahan).
import { randomBytes, scrypt as _scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(_scrypt);

// Format tersimpan: scrypt$<salt hex>$<hash hex>
export async function hashPassword(password) {
  const salt = randomBytes(16);
  const key = await scrypt(String(password), salt, 64);
  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}

export async function verifyPassword(password, stored) {
  const [alg, saltHex, keyHex] = String(stored ?? "").split("$");
  if (alg !== "scrypt" || !saltHex || !keyHex) return false;
  const expected = Buffer.from(keyHex, "hex");
  const key = await scrypt(String(password), Buffer.from(saltHex, "hex"), expected.length);
  return key.length === expected.length && timingSafeEqual(key, expected);
}

// Dipakai agar waktu respons sama saat username tidak ditemukan
export const DUMMY_HASH = `scrypt$${"00".repeat(16)}$${"00".repeat(64)}`;
