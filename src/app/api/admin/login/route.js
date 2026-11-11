import { NextResponse } from "next/server";
import {
  COOKIE, SESSION_SECONDS, createSession, findAdminByUsername, touchLogin,
} from "@/lib/admin-auth";
import { verifyPassword, DUMMY_HASH } from "@/lib/password";

// Pembatas percobaan sederhana (per instance server): 5 salah -> tunggu 5 menit
const attempts = (globalThis.__adminAttempts ??= new Map());
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function POST(req) {
  const ip = (req.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
  const entry = attempts.get(ip) ?? { count: 0, until: 0 };
  if (entry.until > Date.now()) {
    return NextResponse.json(
      { error: "Terlalu banyak percobaan. Coba lagi beberapa menit lagi." },
      { status: 429 }
    );
  }

  let body = {};
  try {
    body = await req.json();
  } catch {}
  const username = String(body.username ?? "").trim().toLowerCase().slice(0, 50);
  const password = String(body.password ?? "").slice(0, 200);

  try {
    const admin = username ? await findAdminByUsername(username) : null;
    // verifikasi tetap dijalankan walau username tidak ada, supaya waktu responsnya sama
    const valid = await verifyPassword(password, admin?.password_hash ?? DUMMY_HASH);

    if (!admin || !valid) {
      entry.count += 1;
      if (entry.count >= 5) {
        entry.count = 0;
        entry.until = Date.now() + 5 * 60 * 1000;
      }
      attempts.set(ip, entry);
      await sleep(600);
      return NextResponse.json({ error: "Username atau password salah." }, { status: 401 });
    }

    attempts.delete(ip);
    await touchLogin(admin.id);
    const res = NextResponse.json({ ok: true, name: admin.name });
    res.cookies.set(COOKIE, createSession(admin.id), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_SECONDS,
    });
    return res;
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json(
      { error: "Gagal masuk. Pastikan tabel admins sudah dibuat dan ADMIN_SECRET diatur." },
      { status: 500 }
    );
  }
}
