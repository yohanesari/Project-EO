import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { slugify } from "@/lib/slug";
import { checkIn, undoCheckIn } from "@/lib/checkin";

export async function POST(req) {
  const auth = await requireAdmin(req);
  if (auth.denied) return auth.denied;

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }
  const slug = slugify(String(body.slug ?? ""), 80);
  const code = String(body.code ?? "").toLowerCase();
  if (!slug || !/^[0-9a-f]{10}$/.test(code)) {
    return NextResponse.json({ status: "invalid" });
  }

  try {
    const result =
      body.action === "undo"
        ? await undoCheckIn(slug, code)
        : await checkIn(slug, code, auth.admin.id);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Check-in error:", err);
    return NextResponse.json({ error: "Gagal memproses check-in." }, { status: 500 });
  }
}
