"use client";

import { useEffect, useState } from "react";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { slugify } from "@/lib/slug";
import QrTicket from "@/component/QrTicket";
import {
  CalendarDays, ArrowUpRight, Users, MapPin, Church, Building2,
  Images, Shirt, Clock3, Heart, Flower2,
} from "lucide-react";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});
const sans = Jost({ subsets: ["latin"], weight: ["300", "400", "500"] });

const BANDS = 7; // jumlah pita horizontal pada transisi buka

/*
  Palet (diambil dari video):
  zaitun gelap #3f3b2b · lumut #6b6a45 · kulit/pasir #d9b9a0
  krem kertas #f3e9d9 · perkamen #e9dccb · oker daun #b8812f
*/
const css = `
/* ===== LUKISAN LATAR =====
   Isi DATA.cover dengan gambar lukisan lanskap (mis. "/lukisan.jpg").
   Kalau kosong, dipakai lukisan buatan CSS sebagai pengganti. */
.paint{
  background-color:#a79a7c;
  background-size:cover;
  background-position:center top;
  background-repeat:no-repeat;
}
.paint-fallback{
  background-image:
    radial-gradient(ellipse 62% 22% at 14% 6%, rgba(66,70,42,.9), transparent 72%),
    radial-gradient(ellipse 46% 16% at 78% 24%, rgba(125,108,98,.55), transparent 70%),
    radial-gradient(ellipse 85% 10% at 40% 58%, rgba(150,148,126,.55), transparent 70%),
    radial-gradient(ellipse 70% 14% at 88% 94%, rgba(184,129,47,.8), transparent 70%),
    radial-gradient(ellipse 95% 24% at 28% 90%, rgba(52,56,34,.95), transparent 72%),
    linear-gradient(180deg,#dcbca3 0%,#cdac92 32%,#a99c7e 56%,#6b6a45 80%,#44442b 100%);
}
.paint-tone{position:absolute;inset:0;background:linear-gradient(180deg,rgba(63,59,43,.28),rgba(63,59,43,.42))}

/* ===== PITA PENUTUP (sampul) ===== */
.band{
  position:absolute;left:0;width:100%;overflow:hidden;
  transition:transform 1.25s cubic-bezier(.7,0,.2,1);
  transition-delay:var(--d);
  will-change:transform;
}
.band + .band{margin-top:-1px}
.is-opening .band{transform:translateX(var(--dir))}

.cover-text{transition:opacity .55s ease}
.is-opening .cover-text{opacity:0;pointer-events:none}

/* ===== URUTAN TEKS HERO (satu momen terkoreografi) ===== */
.seq{opacity:0}
.is-live .seq{animation:fadeUp 1.3s ease both;animation-delay:var(--t)}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}

.open-btn:focus-visible,.link-line:focus-visible{outline:2px solid #f3e9d9;outline-offset:5px}

@media (prefers-reduced-motion:reduce){
  .band,.cover-text{transition-duration:.01s;transition-delay:0s}
  .is-live .seq{animation:none;opacity:1}
}

/* ===== SECTION TAMBAHAN: tetap memakai palet dan karakter template ===== */
.section-kicker{letter-spacing:.24em;text-transform:uppercase;font-size:.65rem;color:#8a7655}
.paper-card{background:#f3e9d9;border:1px solid rgba(63,59,43,.2)}
.illustration-frame{display:grid;place-items:center;width:5rem;height:5rem;border:1px solid rgba(184,129,47,.55);border-radius:9999px;color:#6b6a45;background:rgba(220,205,182,.28)}
.gallery-photo{width:100%;height:100%;object-fit:cover;transition:transform .7s ease}
.gallery-frame{overflow:hidden;background:#dccdb6;border:7px solid #f3e9d9;box-shadow:0 5px 18px rgba(63,59,43,.1)}
.gallery-frame:hover .gallery-photo{transform:scale(1.04)}
`;

function Paint({ cover, className = "", style }) {
  return (
    <div
      className={`paint ${cover ? "" : "paint-fallback"} ${className}`}
      style={{ ...(cover ? { backgroundImage: `url(${cover})` } : null), ...style }}
    />
  );
}

function Countdown({ targetDate, label = "Menuju hari bahagia" }) {
  const getRemaining = () => {
    const target = new Date(targetDate).getTime();
    if (!Number.isFinite(target)) return null;
    const distance = Math.max(0, target - Date.now());
    return {
      days: Math.floor(distance / 86400000),
      hours: Math.floor((distance % 86400000) / 3600000),
      minutes: Math.floor((distance % 3600000) / 60000),
      seconds: Math.floor((distance % 60000) / 1000),
      finished: target <= Date.now(),
    };
  };
  const [remaining, setRemaining] = useState(getRemaining);

  useEffect(() => {
    const update = () => setRemaining(getRemaining());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [targetDate]);

  if (!remaining) return null;
  const units = [
    [remaining.days, "Hari"],
    [remaining.hours, "Jam"],
    [remaining.minutes, "Menit"],
    [remaining.seconds, "Detik"],
  ];

  return (
    <section className="px-6 py-20 text-center">
      <Flower2 className="mx-auto h-5 w-5 text-[#b8812f]" strokeWidth={1.2} />
      <p className="section-kicker mt-4">The day is coming</p>
      <h3 className={`${serif.className} mt-2 text-4xl font-light`}>{label}</h3>
      {remaining.finished ? (
        <p className="mt-7 text-sm tracking-[.18em]">HARI BAHAGIA TELAH TIBA</p>
      ) : (
        <div className="mx-auto mt-9 grid max-w-lg grid-cols-4 gap-2 sm:gap-4">
          {units.map(([value, unit]) => (
            <div key={unit} className="border-y border-[#b8812f]/50 py-4">
              <p className={`${serif.className} text-3xl font-light tabular-nums sm:text-5xl`}>
                {String(value).padStart(2, "0")}
              </p>
              <p className="mt-2 text-[10px] uppercase tracking-[.16em] text-[#3f3b2b]/65">{unit}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function EventIllustration({ type }) {
  const Icon = type === "ceremony" ? Church : type === "reception" ? Building2 : MapPin;
  return (
    <div className="illustration-frame" aria-hidden="true">
      <Icon size={38} strokeWidth={1.1} />
    </div>
  );
}

export default function Weeding({ data: DATA }) {
  const weddingSlug = DATA.slug || slugify(`${DATA.groom}-and-${DATA.bride}`, 80);
  const [stage, setStage] = useState("closed"); // closed | opening | open
  const [guest, setGuest] = useState("Tamu Undangan");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [attend, setAttend] = useState(""); // "hadir" | "tidak"
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [mode, setMode] = useState("form"); // form | lookup
  const [saved, setSaved] = useState(null); // { name, attending, code } setelah RSVP tersimpan

  useEffect(() => {
    const to = new URLSearchParams(window.location.search).get("to");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (to) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGuest(to);
      setName(to);
    }
  }, []);

  // ingat RSVP di perangkat ini, supaya QR bisa dibuka lagi di hari H
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`rsvp:${weddingSlug}`);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setSaved(JSON.parse(raw));
    } catch {}
  }, [weddingSlug]);

  // kunci scroll selama sampul belum terbuka
  useEffect(() => {
    document.body.style.overflow = stage === "open" ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [stage]);

  const openCover = () => {
    if (stage !== "closed") return;
    setStage("opening");
    setTimeout(() => setStage("open"), 2400);
  };

  const place = DATA.location || DATA.events?.[0]?.place || "";
  const countdownTarget = DATA.countdown?.targetDate;

  const submitRsvp = async (e) => {
    e.preventDefault();
    if (sending) return;
    if (!name.trim()) return setError("Mohon isi nama Anda.");
    if (phone.replace(/\D/g, "").length < 9) return setError("Mohon isi nomor HP yang valid.");
    if (!attend) return setError("Mohon pilih hadir atau tidak hadir.");
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: weddingSlug,
          name: name.trim(),
          phone,
          attending: attend === "hadir",
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Gagal menyimpan. Silakan coba lagi.");
      setSaved(json);
      try {
        localStorage.setItem(`rsvp:${weddingSlug}`, JSON.stringify(json));
      } catch {}
    } catch (err) {
      setError(err.message || "Gagal menyimpan. Silakan coba lagi.");
    } finally {
      setSending(false);
    }
  };

  const lookupRsvp = async (e) => {
    e.preventDefault();
    if (sending) return;
    if (phone.replace(/\D/g, "").length < 9) return setError("Mohon isi nomor HP yang valid.");
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/rsvp/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: weddingSlug, phone }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Gagal mencari data. Silakan coba lagi.");
      setSaved(json);
      try {
        localStorage.setItem(`rsvp:${weddingSlug}`, JSON.stringify(json));
      } catch {}
    } catch (err) {
      setError(err.message || "Gagal mencari data. Silakan coba lagi.");
    } finally {
      setSending(false);
    }
  };

  const bandH = 100 / BANDS;

  return (
    <div className={`${sans.className} min-h-screen bg-[#e9dccb] text-[#3f3b2b]`}>
      <style>{css}</style>

      {/* ===== SAMPUL: pita-pita lukisan yang bergeser keluar ===== */}
      {stage !== "open" && (
        <section
          aria-label="Sampul undangan"
          className={`fixed inset-0 z-50 overflow-hidden ${
            stage === "opening" ? "is-opening pointer-events-none" : ""
          }`}
        >
          {Array.from({ length: BANDS }).map((_, i) => (
            <div
              key={i}
              className="band"
              style={{
                top: `${i * bandH}%`,
                height: `${bandH}%`,
                "--dir": i % 2 === 0 ? "-105%" : "105%",
                "--d": `${(i % 2 === 0 ? i : BANDS - i) * 0.07}s`,
              }}
            >
              <Paint
                cover={DATA.cover}
                style={{
                  position: "absolute",
                  left: 0,
                  width: "100%",
                  height: `${BANDS * 100}%`,
                  top: `${-i * 100}%`,
                }}
              />
              <div
                className="paint-tone"
                style={{ height: `${BANDS * 100}%`, top: `${-i * 100}%` }}
              />
            </div>
          ))}

          <div className="cover-text absolute inset-0 grid place-items-center px-6 text-center text-[#f3e9d9]">
            <div className="w-full max-w-sm">
              <p className={`${serif.className} text-xl italic font-light`}>
                Simpan tanggalnya
              </p>
              <h1
                className={`${serif.className} mt-6 text-5xl font-light uppercase leading-[1.2] tracking-[0.14em]`}
              >
                {DATA.groom}
                <span className="block text-2xl normal-case italic tracking-normal text-[#e4c99a]">
                  dan
                </span>
                {DATA.bride}
              </h1>

              <div className="mt-14">
                <p className="text-xs font-light tracking-wide text-[#f3e9d9]/75">
                  Kepada Yth.
                </p>
                <p className={`${serif.className} mt-1 text-2xl font-light`}>{guest}</p>
              </div>

              <button
                type="button"
                onClick={openCover}
                className="open-btn mt-10 border border-[#f3e9d9]/70 px-9 py-3 text-sm font-light tracking-wide text-[#f3e9d9] transition hover:bg-[#f3e9d9] hover:text-[#3f3b2b]"
              >
                Buka undangan
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ===== ISI UNDANGAN (sudah ada di belakang sampul) ===== */}
      <main inert={stage === "closed" ? true : undefined}>
        {/* Hero: lukisan yang sama, teks muncul berurutan seperti di video */}
        <header
          className={`relative flex min-h-screen items-center justify-center overflow-hidden px-6 text-center text-[#f3e9d9] ${
            stage === "closed" ? "" : "is-live"
          }`}
        >
          <Paint
            cover={DATA.cover}
            style={{ position: "absolute", inset: 0, backgroundPosition: "center 35%" }}
          />
          <div className="paint-tone" />

          <div className="relative">
            <p className={`${serif.className} seq text-2xl italic font-light`} style={{ "--t": "1s" }}>
              Kami akan menikah
            </p>
            <h2
              className={`${serif.className} seq mt-8 text-5xl font-light uppercase leading-[1.25] tracking-[0.14em] sm:text-7xl`}
              style={{ "--t": "1.8s" }}
            >
              {DATA.groom}
              <span className="block text-3xl normal-case italic tracking-normal text-[#e4c99a] sm:text-4xl">
                dan
              </span>
              {DATA.bride}
            </h2>
            <p
              className="seq mt-12 flex items-center justify-center gap-2 text-sm font-light tracking-[0.2em]"
              style={{ "--t": "3s" }}
            >
              <CalendarDays className="h-4 w-4 text-[#e4c99a]" />
              {DATA.dateLabel}
            </p>
            {place && (
              <p
                className={`${serif.className} seq mt-3 flex items-center justify-center gap-2 text-xl italic font-light`}
                style={{ "--t": "3.8s" }}
              >
                <MapPin className="h-4 w-4 text-[#e4c99a]" />
                {place}
              </p>
            )}
          </div>
        </header>

        {/* Ayat */}
        <section className="mx-auto max-w-xl px-6 py-28 text-center">
          <p
            className={`${serif.className} text-2xl font-light italic leading-relaxed sm:text-3xl`}
          >
            {DATA.quote}
          </p>
        </section>

        {/* Countdown: aktif jika targetDate disediakan pada DATA */}
        {DATA.countdown?.enabled !== false && countdownTarget && (
          <Countdown
            targetDate={countdownTarget}
            label={DATA.countdown?.label || "Menuju hari bahagia"}
          />
        )}

        {/* Waktu & tempat: ilustrasi berbeda untuk pemberkatan dan resepsi */}
        <section className="bg-[#dccdb6] px-6 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-kicker">Save the date</p>
            <h3 className={`${serif.className} mt-3 text-4xl font-light`}>Waktu &amp; tempat</h3>
            <p className="mt-3 text-sm font-light text-[#3f3b2b]/65">Dengan penuh sukacita, kami mengundang Anda untuk hadir.</p>
          </div>
          <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
            {(DATA.events || []).map((e, index) => {
              const inferredType = e.type || (/resepsi|reception/i.test(e.title || "") ? "reception" : /pemberkatan|ceremony|holy matrimony/i.test(e.title || "") ? "ceremony" : "event");
              return (
                <article key={`${e.title}-${index}`} className="paper-card flex flex-col items-center px-7 py-9 text-center shadow-[0_8px_24px_rgba(63,59,43,.06)]">
                  <EventIllustration type={inferredType} />
                  <p className="section-kicker mt-6">{inferredType === "ceremony" ? "Holy Matrimony" : inferredType === "reception" ? "Wedding Reception" : "Wedding Event"}</p>
                  <h4 className={`${serif.className} mt-2 text-3xl font-normal`}>{e.title}</h4>
                  <div className="my-5 h-px w-12 bg-[#b8812f]/70" />
                  <p className="text-sm font-medium">{e.dateLabel || DATA.dateLabel}</p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-[#3f3b2b]/70"><Clock3 className="h-4 w-4" />{e.time}</p>
                  <p className="mt-5 font-medium">{e.place}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#3f3b2b]/65">{e.address}</p>
                  {e.maps && (
                    <a href={e.maps} target="_blank" rel="noreferrer" className="link-line mt-6 inline-flex items-center gap-1 border-b border-[#3f3b2b] pb-0.5 text-sm font-medium hover:text-[#8a5f1e]">
                      Lihat lokasi <ArrowUpRight className="h-4 w-4" />
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* Galeri foto: opsional, isi DATA.gallery dengan array foto */}
        {Array.isArray(DATA.gallery) && DATA.gallery.length > 0 && (
          <section className="mx-auto max-w-5xl px-6 py-24 text-center">
            <Images className="mx-auto h-5 w-5 text-[#b8812f]" strokeWidth={1.3} />
            <p className="section-kicker mt-4">Our moments</p>
            <h3 className={`${serif.className} mt-2 text-4xl font-light`}>{DATA.galleryTitle || "Cerita kami"}</h3>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
              {DATA.gallery.map((photo, index) => {
                const src = typeof photo === "string" ? photo : photo.src;
                const alt = typeof photo === "string" ? `Foto prewedding ${index + 1}` : (photo.alt || `Foto prewedding ${index + 1}`);
                return (
                  <div key={`${src}-${index}`} className={`gallery-frame aspect-[4/5] ${index === 1 ? "sm:translate-y-8" : ""}`}>
                    <img src={src} alt={alt} loading="lazy" className="gallery-photo" />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Rundown kegiatan: opsional */}
        {Array.isArray(DATA.itinerary) && DATA.itinerary.length > 0 && (
          <section className="bg-[#e2d5c2] px-6 py-24">
            <div className="mx-auto max-w-2xl text-center">
              <CalendarDays className="mx-auto h-5 w-5 text-[#b8812f]" strokeWidth={1.3} />
              <p className="section-kicker mt-4">Wedding day</p>
              <h3 className={`${serif.className} mt-2 text-4xl font-light`}>{DATA.itineraryTitle || "Susunan acara"}</h3>
            </div>
            <ol className="mx-auto mt-12 max-w-xl">
              {DATA.itinerary.map((item, index) => (
                <li key={`${item.time}-${index}`} className="relative grid grid-cols-[5.5rem_1.5rem_1fr] gap-3 pb-9 last:pb-0">
                  <p className="pt-0.5 text-right text-xs font-medium tracking-wide">{item.time}</p>
                  <div className="relative flex justify-center">
                    <span className="z-10 mt-1 h-2.5 w-2.5 rounded-full border border-[#b8812f] bg-[#f3e9d9]" />
                    {index !== DATA.itinerary.length - 1 && <span className="absolute top-3 h-full w-px bg-[#b8812f]/45" />}
                  </div>
                  <div>
                    <h4 className={`${serif.className} text-2xl font-normal`}>{item.title}</h4>
                    {item.description && <p className="mt-1 text-sm font-light leading-relaxed text-[#3f3b2b]/65">{item.description}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Dress code: opsional */}
        {DATA.dressCode?.enabled !== false && DATA.dressCode && (
          <section className="mx-auto max-w-xl px-6 py-24 text-center">
            <Shirt className="mx-auto h-6 w-6 text-[#b8812f]" strokeWidth={1.2} />
            <p className="section-kicker mt-4">A little note</p>
            <h3 className={`${serif.className} mt-2 text-4xl font-light`}>{DATA.dressCode.title || "Dress code"}</h3>
            {DATA.dressCode.description && <p className="mt-4 text-sm font-light leading-relaxed text-[#3f3b2b]/70">{DATA.dressCode.description}</p>}
            {Array.isArray(DATA.dressCode.colors) && DATA.dressCode.colors.length > 0 && (
              <div className="mt-7 flex flex-wrap justify-center gap-4">
                {DATA.dressCode.colors.map((color, index) => (
                  <div key={`${color.hex}-${index}`} className="flex flex-col items-center gap-2">
                    <span className="h-10 w-10 rounded-full border border-[#3f3b2b]/15 shadow-sm" style={{ backgroundColor: color.hex }} />
                    <span className="text-xs text-[#3f3b2b]/70">{color.name}</span>
                  </div>
                ))}
              </div>
            )}
            {DATA.dressCode.avoid?.length > 0 && <p className="mt-6 text-xs font-light text-[#3f3b2b]/60">Mohon hindari: {DATA.dressCode.avoid.join(", ")}</p>}
          </section>
        )}

        {/* RSVP */}
        <section className="mx-auto max-w-xl px-6 py-24 text-center">
          <Users className="mx-auto h-6 w-6 text-[#b8812f]" />
          <h3 className={`${serif.className} mt-4 text-4xl font-light`}>
            Konfirmasi kehadiran
          </h3>

          {saved ? (
            <div className="mt-8">
              <p className="font-light text-[#3f3b2b]/80">
                {saved.attending
                  ? `Terima kasih, ${saved.name}. Kehadiran Anda sudah tercatat.`
                  : `Terima kasih sudah memberi kabar, ${saved.name}. Doa restu Anda sangat berarti bagi kami.`}
              </p>

              {saved.attending && (
                <div className="mt-8 bg-[#3f3b2b] px-6 py-8 text-[#f3e9d9]">
                  <p className={`${serif.className} text-2xl font-light`}>QR kehadiran Anda</p>
                  <div className="mt-6">
                    <QrTicket
                      value={`/weeding/${weddingSlug}/${saved.code}`}
                      fileName={`qr-${saved.code}`}
                      pdfHref={`/api/rsvp/pdf?slug=${weddingSlug}&code=${saved.code}`}
                    />
                  </div>
                  <p className="mt-6 text-sm font-light text-[#f3e9d9]/75">
                    Tunjukkan QR ini kepada penerima tamu saat tiba.
                  </p>
                  <a
                    href={`/weeding/${weddingSlug}/${saved.code}`}
                    className="link-line mt-3 inline-block border-b border-[#f3e9d9]/70 pb-0.5 text-sm"
                  >
                    Buka halaman QR
                  </a>
                </div>
              )}

              <button
                type="button"
                onClick={() => { setSaved(null); setMode("form"); }}
                className="mt-6 border-b border-[#3f3b2b] pb-0.5 text-sm font-medium hover:text-[#8a5f1e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3f3b2b]"
              >
                Ubah jawaban
              </button>
            </div>
          ) : mode === "lookup" ? (
            <form onSubmit={lookupRsvp} noValidate className="mt-8 text-left">
              <p className="text-center font-light text-[#3f3b2b]/75">
                Masukkan nomor HP yang Anda pakai saat konfirmasi.
              </p>
              <label htmlFor="lookup-phone" className="mt-6 block text-sm font-medium">
                Nomor HP
              </label>
              <input
                id="lookup-phone"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                placeholder="08123456789"
                className="mt-2 w-full border border-[#3f3b2b]/30 bg-[#f3e9d9] px-4 py-3 font-light placeholder:text-[#3f3b2b]/40 focus:border-[#3f3b2b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3f3b2b]/40"
              />
              {error && (
                <p role="alert" className="mt-4 text-sm text-[#8a3b2a]">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={sending}
                className="mt-6 inline-flex w-full items-center justify-center bg-[#3f3b2b] px-8 py-3 text-sm font-light tracking-wide text-[#f3e9d9] transition hover:bg-[#6b6a45] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3f3b2b] disabled:opacity-60"
              >
                {sending ? "Mencari…" : "Cari QR saya"}
              </button>
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => { setMode("form"); setError(""); }}
                  className="border-b border-[#3f3b2b] pb-0.5 text-sm font-medium hover:text-[#8a5f1e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3f3b2b]"
                >
                  Kembali ke formulir
                </button>
              </div>
            </form>
          ) : (
            <>
              <p className="mt-4 font-light text-[#3f3b2b]/75">
                Kehadiran dan doa restu Anda sangat berarti bagi kami. Mohon isi
                formulir berikut.
              </p>

              <form onSubmit={submitRsvp} noValidate className="mt-10 text-left">
                <label htmlFor="rsvp-name" className="block text-sm font-medium">
                  Nama
                </label>
                <input
                  id="rsvp-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  placeholder="Nama lengkap Anda"
                  className="mt-2 w-full border border-[#3f3b2b]/30 bg-[#f3e9d9] px-4 py-3 font-light placeholder:text-[#3f3b2b]/40 focus:border-[#3f3b2b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3f3b2b]/40"
                />

                <label htmlFor="rsvp-phone" className="mt-6 block text-sm font-medium">
                  Nomor HP
                </label>
                <input
                  id="rsvp-phone"
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  placeholder="08123456789"
                  className="mt-2 w-full border border-[#3f3b2b]/30 bg-[#f3e9d9] px-4 py-3 font-light placeholder:text-[#3f3b2b]/40 focus:border-[#3f3b2b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3f3b2b]/40"
                />
                <p className="mt-2 text-xs font-light text-[#3f3b2b]/60">
                  Dipakai untuk menemukan QR Anda kembali di hari H.
                </p>

                <fieldset className="mt-6">
                  <legend className="text-sm font-medium">Apakah Anda bersedia hadir?</legend>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    {[
                      { v: "hadir", label: "Bersedia hadir" },
                      { v: "tidak", label: "Tidak bisa hadir" },
                    ].map((o) => (
                      <label key={o.v} className="cursor-pointer">
                        <input
                          type="radio"
                          name="attend"
                          value={o.v}
                          checked={attend === o.v}
                          onChange={() => setAttend(o.v)}
                          className="peer sr-only"
                        />
                        <span className="block border border-[#3f3b2b]/30 bg-[#f3e9d9] px-4 py-3 text-center text-sm font-light transition peer-checked:border-[#3f3b2b] peer-checked:bg-[#3f3b2b] peer-checked:text-[#f3e9d9] peer-focus-visible:ring-2 peer-focus-visible:ring-[#3f3b2b]/40">
                          {o.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                {error && (
                  <p role="alert" className="mt-4 text-sm text-[#8a3b2a]">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 bg-[#3f3b2b] px-8 py-3 text-sm font-light tracking-wide text-[#f3e9d9] transition hover:bg-[#6b6a45] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3f3b2b] disabled:opacity-60"
                >
                  {sending ? "Menyimpan…" : "Kirim konfirmasi"}
                </button>
              </form>
              <button
                type="button"
                onClick={() => { setMode("lookup"); setError(""); }}
                className="mt-6 border-b border-[#3f3b2b] pb-0.5 text-sm font-medium hover:text-[#8a5f1e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3f3b2b]"
              >
                Sudah konfirmasi? Cari QR saya
              </button>
            </>
          )}
        </section>

        <footer className="relative overflow-hidden px-6 py-16 text-center text-[#f3e9d9]">
          <Paint
            cover={DATA.cover}
            style={{ position: "absolute", inset: 0, backgroundPosition: "center bottom" }}
          />
          <div className="paint-tone" />
          <div className="relative">
            <Heart className="mx-auto mb-3 h-5 w-5 text-[#e4c99a]" strokeWidth={1.2} />
            <p className="text-sm font-light text-[#f3e9d9]/80">
              Terima kasih atas doa dan kehadirannya.
            </p>
            <p
              className={`${serif.className} mt-4 text-3xl font-light uppercase tracking-[0.14em]`}
            >
              {DATA.groom} &amp; {DATA.bride}
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
