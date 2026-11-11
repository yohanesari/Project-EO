import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { slugify } from "@/lib/slug";
import { getStats } from "@/lib/checkin";

export async function GET(req) {
  const auth = await requireAdmin(req);
  if (auth.denied) return auth.denied;
  const slug = slugify(req.nextUrl.searchParams.get("slug") ?? "", 80);
  if (!slug) return NextResponse.json({ error: "Acara tidak ditemukan." }, { status: 404 });
  try {
    return NextResponse.json(await getStats(slug), { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("Stats error:", err);
    return NextResponse.json({ error: "Gagal memuat data." }, { status: 500 });
  }
}
