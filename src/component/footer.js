import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white/80">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="font-heading text-2xl text-white">Aeterna</p>
          <p className="mt-2 text-sm">
            Wujudkan momen impian tanpa beban & khawatir.
          </p>
        </div>

        <div>
          <p className="mb-3 font-semibold text-white">Menu</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/layanan">Layanan</Link></li>
            <li><Link href="/about">Tentang Kami</Link></li>
            <li><Link href="/contact">Kontak</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 font-semibold text-white">Hubungi Kami</p>
          <p className="text-sm">WhatsApp: 0851-2334-223</p>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs">
        © {new Date().getFullYear()} Aeterna Event Organizer
      </div>
    </footer>
  );
}