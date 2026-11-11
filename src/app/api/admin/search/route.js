import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { slugify } from "@/lib/slug";
import { searchGuests } from "@/lib/checkin";

export async function GET(req) {
  const auth = await requireAdmin(req);
  if (auth.denied) return auth.denied;
  const slug = slugify(req.nextUrl.searchParams.get("slug") ?? "", 80);
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim().slice(0, 60);
  if (!slug || q.length < 2) return NextResponse.json({ matches: [] });
  try {
    return NextResponse.json({ matches: await searchGuests(slug, q) });
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json({ error: "Gagal mencari." }, { status: 500 });
  }
}
