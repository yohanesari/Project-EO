"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { Camera, CameraOff, Check, LogOut, Search, X } from "lucide-react";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500"] });
const sans = Jost({ subsets: ["latin"], weight: ["300", "400", "500"] });

// Isi QR bisa berupa link lengkap (…/weeding/<slug>/<kode>) atau kode 10 karakter saja
function parseCode(text, slug) {
  const m = String(text).match(/\/weeding\/([a-z0-9-]+)\/([0-9a-f]{10})(?:[/?#]|$)/i);
  if (m) return { slug: m[1].toLowerCase(), code: m[2].toLowerCase() };
  const raw = String(text).trim();
  if (/^[0-9a-f]{10}$/i.test(raw)) return { slug, code: raw.toLowerCase() };
  return null;
}

const fmtTime = (iso) =>
  iso
    ? new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    : "";

const TONES = {
  good: "border-[#6b6a45] bg-[#dfe6cf] text-[#27310f]",
  warn: "border-[#b8812f] bg-[#f4e3bd] text-[#4a3208]",
  bad: "border-[#8a3b2a] bg-[#f3d9d1] text-[#4a1a10]",
};

function describe(result) {
  switch (result.status) {
    case "ok":
      return { tone: "good", title: "Check-in berhasil" };
    case "already":
      return { tone: "warn", title: "Sudah check-in sebelumnya" };
    case "undone":
      return { tone: "warn", title: "Check-in dibatalkan" };
    case "not_attending":
      return { tone: "bad", title: "Tamu menyatakan tidak hadir" };
    case "wrong_event":
      return { tone: "bad", title: "QR ini untuk acara lain" };
    case "error":
      return { tone: "bad", title: result.message || "Gagal memproses" };
    default:
      return { tone: "bad", title: "QR tidak dikenali" };
  }
}

export default function CheckinConsole({ slug, title, adminName }) {
  const router = useRouter();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(0);
  const lastScanRef = useRef({ text: "", at: 0 });
  const busyRef = useRef(false);
  const decodedRef = useRef(() => {});

  const [camOn, setCamOn] = useState(false);
  const [camError, setCamError] = useState("");
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState(null);
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState([]);
  const [version, setVersion] = useState(0); // naik tiap ada check-in, memicu muat ulang data

  const toLogin = useCallback(() => {
    router.replace(`/admin/login?next=${encodeURIComponent(`/admin/${slug}`)}`);
  }, [router, slug]);

  // ---------- data ----------
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch(`/api/admin/stats?slug=${slug}`, { cache: "no-store" });
        if (res.status === 401) return toLogin();
        if (res.ok && alive) setStats(await res.json());
      } catch {}
    };
    load();
    const id = setInterval(load, 15000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [slug, version, toLogin]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    const id = setTimeout(async () => {
      try {
        const res = await fetch(`/api/admin/search?slug=${slug}&q=${encodeURIComponent(q)}`);
        if (res.status === 401) return toLogin();
        if (res.ok) setMatches((await res.json()).matches);
      } catch {}
    }, 300);
    return () => clearTimeout(id);
  }, [query, slug, version, toLogin]);

  // ---------- check-in ----------
  const submitCode = async (code, action = "checkin") => {
    busyRef.current = true;
    try {
      const res = await fetch("/api/admin/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, code, action }),
      });
      if (res.status === 401) return toLogin();
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setResult({ status: "error", message: json.error || "Gagal memproses." });
      } else {
        setResult({ ...json, code });
        navigator.vibrate?.(json.status === "ok" ? 60 : [80, 60, 80]);
      }
      setVersion((v) => v + 1);
    } catch {
      setResult({ status: "error", message: "Tidak bisa terhubung ke server." });
    } finally {
      busyRef.current = false;
    }
  };
  // eslint-disable-next-line react-hooks/refs
  decodedRef.current = (text) => {
    const now = Date.now();
    const last = lastScanRef.current;
    // QR yang sama masih di depan kamera: abaikan sampai 4 detik tanpa terbaca
    if (last.text === text && now - last.at < 4000) {
      lastScanRef.current = { text, at: now };
      return;
    }
    lastScanRef.current = { text, at: now };
    if (busyRef.current) return;
    const parsed = parseCode(text, slug);
    if (!parsed) return setResult({ status: "invalid" });
    if (parsed.slug !== slug) return setResult({ status: "wrong_event" });
    submitCode(parsed.code);
  };

  // ---------- kamera ----------
  const stopCamera = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCamOn(false);
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  const startCamera = async () => {
    setCamError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamError("Kamera tidak tersedia. Buka halaman ini lewat HTTPS.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current;
      video.srcObject = stream;
      await video.play();
      setCamOn(true);

      const { default: jsQR } = await import("jsqr");
      let lastTick = 0;
      const tick = (t) => {
        rafRef.current = requestAnimationFrame(tick);
        if (t - lastTick < 120) return; // sekitar 8 kali per detik
        lastTick = t;
        const v = videoRef.current;
        const c = canvasRef.current;
        if (!v || !c || v.readyState < 2 || !v.videoWidth) return;
        const scale = Math.min(1, 640 / v.videoWidth);
        const w = Math.round(v.videoWidth * scale);
        const h = Math.round(v.videoHeight * scale);
        c.width = w;
        c.height = h;
        const ctx = c.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(v, 0, 0, w, h);
        const img = ctx.getImageData(0, 0, w, h);
        const found = jsQR(img.data, w, h, { inversionAttempts: "dontInvert" });
        if (found?.data) decodedRef.current(found.data);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch (err) {
      setCamError(
        err?.name === "NotAllowedError"
          ? "Izin kamera ditolak. Aktifkan izin kamera di pengaturan browser."
          : "Kamera tidak bisa dibuka."
      );
      stopCamera();
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    router.replace("/admin/login");
  };

  const percent = stats && stats.expected > 0 ? Math.round((stats.arrived / stats.expected) * 100) : 0;
  const info = result ? describe(result) : null;

  return (
    <div className={`${sans.className} min-h-screen bg-[#3f3b2b] text-[#f3e9d9] pb-6 pt-28`}>
      <div className="mx-auto max-w-md px-5 py-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-light tracking-wide text-[#f3e9d9]/70">Check-in tamu</p>
            <h1 className={`${serif.className} text-2xl font-light leading-tight`}>{title}</h1>
            {adminName && (
              <p className="mt-1 text-xs font-light text-[#f3e9d9]/60">Masuk sebagai {adminName}</p>
            )}
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 border border-[#f3e9d9]/40 px-3 py-2 text-xs font-light transition hover:bg-[#f3e9d9] hover:text-[#3f3b2b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3e9d9]"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Keluar
          </button>
        </header>

        {/* Ringkasan */}
        <section className="mt-6 border border-[#f3e9d9]/25 p-4" aria-label="Ringkasan kehadiran">
          {stats ? (
            <>
              <p className="text-3xl font-light">
                {stats.arrived}
                <span className="text-lg text-[#f3e9d9]/70"> / {stats.expected} orang</span>
              </p>
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
                aria-label="Persentase tamu yang sudah check-in"
                className="mt-3 h-2 bg-[#f3e9d9]/20"
              >
                <div className="h-2 bg-[#e4c99a]" style={{ width: `${percent}%` }} />
              </div>
              <p className="mt-2 text-xs font-light text-[#f3e9d9]/70">
                {stats.partiesArrived} dari {stats.parties} konfirmasi sudah masuk
              </p>
            </>
          ) : (
            <p className="text-sm font-light text-[#f3e9d9]/70">Memuat…</p>
          )}
        </section>

        {/* Pemindai */}
        <section className="mt-6" aria-label="Pemindai QR">
          <div className="relative aspect-square overflow-hidden border border-[#f3e9d9]/25 bg-black">
            <video
              ref={videoRef}
              playsInline
              muted
              aria-label="Tampilan kamera"
              className={`h-full w-full object-cover ${camOn ? "" : "invisible"}`}
            />
            {camOn && (
              <div className="pointer-events-none absolute inset-[18%] border-2 border-[#e4c99a]/80" />
            )}
            {!camOn && (
              <div className="absolute inset-0 grid place-items-center px-6 text-center text-sm font-light text-[#f3e9d9]/70">
                Kamera belum dinyalakan
              </div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />

          <button
            type="button"
            onClick={camOn ? stopCamera : startCamera}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 bg-[#f3e9d9] px-6 py-3.5 text-sm font-medium text-[#3f3b2b] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f3e9d9]"
          >
            {camOn ? (
              <CameraOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Camera className="h-4 w-4" aria-hidden="true" />
            )}
            {camOn ? "Hentikan kamera" : "Mulai pindai"}
          </button>
          {camError && (
            <p role="alert" className="mt-3 text-sm text-[#f0b8a8]">
              {camError}
            </p>
          )}
        </section>

        {/* Hasil */}
        <div role="status" aria-live="polite" className="mt-4">
          {result && info && (
            <div className={`border-2 p-4 ${TONES[info.tone]}`}>
              <p className="flex items-center gap-2 text-lg font-medium">
                {info.tone === "good" ? (
                  <Check className="h-5 w-5 shrink-0" aria-hidden="true" />
                ) : info.tone === "warn" ? (
                  <span aria-hidden="true" className="grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 border-current text-xs font-bold">!</span>
                ) : (
                  <X className="h-5 w-5 shrink-0" aria-hidden="true" />
                )}
                {info.title}
              </p>
              {result.rsvp && (
                <div className="mt-2">
                  <p className={`${serif.className} text-3xl leading-tight`}>{result.rsvp.name}</p>
                  {result.status !== "not_attending" && result.status !== "undone" && (
                    <p className="mt-1 text-sm">
                      {result.rsvp.guestCount} orang
                      {result.rsvp.checkedInAt ? ` · pukul ${fmtTime(result.rsvp.checkedInAt)}` : ""}
                    </p>
                  )}
                </div>
              )}
              {result.status === "ok" && result.code && (
                <button
                  type="button"
                  onClick={() => submitCode(result.code, "undo")}
                  className="mt-3 border border-current px-4 py-2 text-sm transition hover:bg-black/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
                >
                  Batalkan check-in
                </button>
              )}
            </div>
          )}
        </div>

        {/* Cari manual */}
        <section className="mt-8" aria-label="Cari tamu manual">
          <label htmlFor="guest-search" className="flex items-center gap-2 text-sm font-medium">
            <Search className="h-4 w-4" aria-hidden="true" />
            Cari nama atau nomor HP
          </label>
          <p className="mt-1 text-xs font-light text-[#f3e9d9]/60">
            Untuk tamu yang QR-nya tidak bisa dibuka.
          </p>
          <input
            id="guest-search"
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value.trim().length < 2) setMatches([]);
            }}
            placeholder="Ketik minimal 2 huruf"
            className="mt-2 w-full border border-[#f3e9d9]/40 bg-transparent px-4 py-3 font-light placeholder:text-[#f3e9d9]/40 focus:border-[#f3e9d9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f3e9d9]/50"
          />
          {query.trim().length >= 2 && (
            <ul className="mt-3 space-y-2">
              {matches.length === 0 && (
                <li className="text-sm font-light text-[#f3e9d9]/60">Tidak ada tamu yang cocok.</li>
              )}
              {matches.map((m) => (
                <li
                  key={m.code}
                  className="flex items-center justify-between gap-3 border border-[#f3e9d9]/25 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate">{m.name}</p>
                    <p className="text-xs font-light text-[#f3e9d9]/70">
                      {m.guestCount} orang
                      {m.checkedInAt ? ` · sudah check-in pukul ${fmtTime(m.checkedInAt)}` : " · belum check-in"}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={!!m.checkedInAt}
                    onClick={() => submitCode(m.code)}
                    className="shrink-0 bg-[#f3e9d9] px-4 py-2 text-sm font-medium text-[#3f3b2b] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3e9d9] disabled:opacity-40"
                  >
                    Check-in
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Terbaru */}
        <section className="mt-8 pb-8" aria-label="Check-in terbaru">
          <h2 className={`${serif.className} text-xl font-light`}>Terbaru</h2>
          {stats && stats.recent.length > 0 ? (
            <ul className="mt-2 divide-y divide-[#f3e9d9]/15">
              {stats.recent.map((r, i) => (
                <li key={`${r.name}-${r.checkedInAt}-${i}`} className="flex justify-between gap-3 py-2 text-sm">
                  <span className="truncate">
                    {r.name} <span className="text-[#f3e9d9]/60">· {r.guestCount} orang</span>
                  </span>
                  <span className="shrink-0 font-light text-[#f3e9d9]/70">{fmtTime(r.checkedInAt)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm font-light text-[#f3e9d9]/60">Belum ada yang check-in.</p>
          )}
        </section>
      </div>
    </div>
  );
}
