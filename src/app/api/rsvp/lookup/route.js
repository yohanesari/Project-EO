import { NextResponse } from "next/server";
import { slugify } from "@/lib/slug";
import { findRsvpByPhone, normalizePhone, isValidPhone } from "@/lib/rsvp";

const fail = (error, status = 400) => NextResponse.json({ error }, { status });

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return fail("Permintaan tidak valid.");
  }
  const phone = normalizePhone(body.phone);
  const eventSlug = slugify(String(body.slug ?? ""), 80);
  if (!isValidPhone(phone)) return fail("Nomor HP tidak valid.");
  if (!eventSlug) return fail("Acara tidak ditemukan.", 404);

  try {
    const rsvp = await findRsvpByPhone(eventSlug, phone);
    if (!rsvp) return fail("Nomor ini belum terdaftar. Silakan isi konfirmasi kehadiran.", 404);
    return NextResponse.json(rsvp);
  } catch (err) {
    console.error("Lookup error:", err);
    return fail("Gagal mencari data. Silakan coba lagi.", 500);
  }
}
