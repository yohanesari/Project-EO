import { NextResponse } from "next/server";
import { slugify } from "@/lib/slug";
import { findRsvpByCode } from "@/lib/rsvp";
import { getEventInfo } from "@/lib/event-info";
import { buildInvitationPdf } from "@/lib/invitation-pdf";


export async function GET(req) {
  const url = new URL(req.url);
  const slug = slugify(url.searchParams.get("slug") ?? "", 80);
  const code = url.searchParams.get("code") ?? "";
  if (!slug || !/^[0-9a-f]{10}$/.test(code)) {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  try {
    const rsvp = await findRsvpByCode(slug, code);
    if (!rsvp || !rsvp.attending) {
      return NextResponse.json({ error: "Data tidak ditemukan." }, { status: 404 });
    }

    const info =
      getEventInfo(slug) ?? {
        groom: slug.split("-and-")[0]?.replace(/-/g, " ") ?? "",
        bride: slug.split("-and-")[1]?.replace(/-/g, " ") ?? "",
        events: [],
      };

    const bytes = await buildInvitationPdf({
      info,
      guestName: rsvp.name,
      qrUrl: `${url.origin}/weeding/${slug}/${code}`,
    });

    return new Response(bytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="undangan-${code}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("PDF error:", err);
    return NextResponse.json({ error: "Gagal membuat PDF." }, { status: 500 });
  }
}
