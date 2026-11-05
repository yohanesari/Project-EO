import { NextResponse } from "next/server";
import { slugify } from "@/lib/slug";
import { saveRsvp, normalizePhone, isValidPhone } from "@/lib/rsvp";

const fail = (error, status = 400) => NextResponse.json({ error }, { status });

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return fail("Permintaan tidak valid.");
  }

  const name = String(body.name ?? "").trim().replace(/\s+/g, " ");
  const phone = normalizePhone(body.phone);
  const eventSlug = slugify(String(body.slug ?? ""), 80);

  if (name.length < 2 || name.length > 120) return fail("Mohon isi nama Anda.");
  if (!isValidPhone(phone)) return fail("Nomor HP tidak valid.");
  if (typeof body.attending !== "boolean") return fail("Mohon pilih hadir atau tidak hadir.");
  if (!eventSlug) return fail("Acara tidak ditemukan.", 404);

  try {
    const result = await saveRsvp({ eventSlug, name, phone, attending: body.attending });
    if (!result) return fail("Acara tidak ditemukan.", 404);
    return NextResponse.json(result);
  } catch (err) {
    console.error("RSVP error:", err);
    return fail("Gagal menyimpan. Silakan coba lagi.", 500);
  }
}
