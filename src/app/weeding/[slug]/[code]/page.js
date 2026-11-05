import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { findRsvpByCode } from "@/lib/rsvp";
import { titleCase } from "@/lib/slug";
import QrTicket from "@/component/QrTicket";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500"], style: ["normal", "italic"] });
const sans = Jost({ subsets: ["latin"], weight: ["300", "400", "500"] });

export const metadata = { title: "QR Tamu Undangan", robots: { index: false } };

async function Pass({ params }) {
  const { slug, code } = await params;
  if (!/^[0-9a-f]{10}$/.test(code)) notFound();

  const rsvp = await findRsvpByCode(slug, code);
  if (!rsvp || !rsvp.attending) notFound();

  const couple = slug.split("-and-").map(titleCase).join(" & ");

  return (
    <main className={`${sans.className} grid min-h-screen place-items-center bg-[#3f3b2b] px-6 py-12 text-[#f3e9d9]`}>
      <div className="w-full max-w-sm border border-[#f3e9d9]/30 px-8 py-10 text-center">
        <p className={`${serif.className} text-xl italic font-light`}>Pernikahan</p>
        <h1 className={`${serif.className} mt-2 text-3xl font-light uppercase tracking-[0.14em]`}>{couple}</h1>

        <div className="mt-8">
          <p className="text-xs font-light text-[#f3e9d9]/70">Tamu undangan</p>
          <p className={`${serif.className} mt-1 text-2xl`}>{rsvp.name}</p>
        </div>

        <div className="mt-8">
          <QrTicket
            value={`/weeding/${slug}/${code}`}
            fileName={`qr-${code}`}
            pdfHref={`/api/rsvp/pdf?slug=${slug}&code=${code}`}
          />
        </div>

        <p className="mt-6 text-sm font-light text-[#f3e9d9]/75">
          Tunjukkan QR ini kepada penerima tamu saat tiba di lokasi.
        </p>
      </div>
    </main>
  );
}

export default function GuestPass({ params }) {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#3f3b2b]" />}>
      <Pass params={params} />
    </Suspense>
  );
}
