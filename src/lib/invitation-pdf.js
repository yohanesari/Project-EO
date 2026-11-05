// Hanya untuk server. Membuat PDF undangan (A5) berisi QR tamu.
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";

const OLIVE = rgb(63 / 255, 59 / 255, 43 / 255);
const OCHRE = rgb(150 / 255, 105 / 255, 36 / 255);
const MUTED = rgb(0.36, 0.34, 0.27);
const CREAM = rgb(243 / 255, 233 / 255, 217 / 255);

export async function buildInvitationPdf({ info, guestName, qrUrl }) {
  const pdf = await PDFDocument.create();
  const W = 419.53;
  const H = 595.28;
  const page = pdf.addPage([W, H]);
  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const italic = await pdf.embedFont(StandardFonts.TimesRomanItalic);
  const bold = await pdf.embedFont(StandardFonts.TimesRomanBold);

  // font bawaan PDF hanya mengenal huruf Latin; karakter lain dibuang agar tidak error
  const safe = (text, font) => {
    const set = new Set(font.getCharacterSet());
    return [...String(text ?? "")].filter((c) => set.has(c.codePointAt(0))).join("");
  };

  const top = (y) => H - y; // y dihitung dari atas halaman

  const center = (text, font, size, y, color = OLIVE, spacing = 0) => {
    const t = safe(text, font);
    if (!t) return;
    const chars = [...t];
    const width =
      chars.reduce((s, c) => s + font.widthOfTextAtSize(c, size), 0) +
      spacing * (chars.length - 1);
    let x = (W - width) / 2;
    if (spacing === 0) {
      page.drawText(t, { x, y: top(y), size, font, color });
      return;
    }
    for (const c of chars) {
      page.drawText(c, { x, y: top(y), size, font, color });
      x += font.widthOfTextAtSize(c, size) + spacing;
    }
  };

  const wrap = (text, font, size, maxW) => {
    const words = safe(text, font).split(/\s+/).filter(Boolean);
    const lines = [];
    let line = "";
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (font.widthOfTextAtSize(test, size) > maxW && line) {
        lines.push(line);
        line = w;
      } else line = test;
    }
    if (line) lines.push(line);
    return lines;
  };

  // latar + bingkai
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: CREAM });
  page.drawRectangle({
    x: 18, y: 18, width: W - 36, height: H - 36,
    borderColor: OLIVE, borderWidth: 0.75,
  });

  // kepala
  center("Undangan Pernikahan", italic, 13, 66, MUTED);
  center(String(info.groom ?? "").toUpperCase(), serif, 25, 104, OLIVE, 3);
  center("dan", italic, 15, 128, OCHRE);
  center(String(info.bride ?? "").toUpperCase(), serif, 25, 158, OLIVE, 3);
  if (info.dateLabel) center(info.dateLabel, serif, 11, 188, OLIVE, 1.2);

  page.drawLine({
    start: { x: W / 2 - 24, y: top(204) },
    end: { x: W / 2 + 24, y: top(204) },
    thickness: 0.6, color: OCHRE,
  });

  // acara
  let y = 226;
  for (const e of (info.events ?? []).slice(0, 3)) {
    center(e.title, italic, 14, y, OLIVE);
    y += 15;
    if (e.time) { center(e.time, serif, 10, y, MUTED); y += 13; }
    if (e.place) { center(e.place, bold, 10.5, y, OLIVE); y += 13; }
    if (e.address) {
      for (const ln of wrap(e.address, serif, 9, W - 110).slice(0, 2)) {
        center(ln, serif, 9, y, MUTED);
        y += 11;
      }
    }
    y += 12;
  }

  // tamu + QR (selalu di bagian bawah)
  center("Kepada Yth.", serif, 9, 392, MUTED);
  center(guestName, serif, 17, 412, OLIVE);

  const qr = await QRCode.toBuffer(qrUrl, {
    margin: 1, width: 420,
    color: { dark: "#3f3b2b", light: "#f3e9d9" },
  });
  const img = await pdf.embedPng(qr);
  const size = 100;
  page.drawImage(img, { x: (W - size) / 2, y: top(428 + size), width: size, height: size });
  center("Tunjukkan QR ini kepada penerima tamu saat tiba.", italic, 8.5, 546, MUTED);

  return pdf.save();
}
