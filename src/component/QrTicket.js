"use client";

import { useRef, useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, FileText } from "lucide-react";

// Dipakai di halaman QR dan di kartu sukses RSVP. Latar gelap (zaitun).
export default function QrTicket({ value, fileName, pdfHref }) {
  const ref = useRef(null);
  const [url, setUrl] = useState("");

  useEffect(() => {
    // QR berisi alamat lengkap halaman tamu, jadi bisa dipindai kamera biasa
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrl(`${window.location.origin}${value}`);
  }, [value]);

  const download = () => {
    const a = document.createElement("a");
    a.href = ref.current.toDataURL("image/png");
    a.download = `${fileName}.png`;
    a.click();
  };

  return (
    <div className="text-center">
      <div className="mx-auto inline-block bg-[#f3e9d9] p-4">
        {url ? (
          <QRCodeCanvas ref={ref} value={url} size={208} level="M" bgColor="#f3e9d9" fgColor="#3f3b2b" />
        ) : (
          <div className="h-[208px] w-[208px]" />
        )}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={download}
          disabled={!url}
          className="inline-flex items-center gap-2 border border-[#f3e9d9]/70 px-6 py-2.5 text-sm font-light text-[#f3e9d9] transition hover:bg-[#f3e9d9] hover:text-[#3f3b2b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f3e9d9] disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          Simpan QR
        </button>
        {pdfHref && (
          <a href={pdfHref} download className="inline-flex items-center gap-2 border border-[#f3e9d9]/70 px-6 py-2.5 text-sm font-light text-[#f3e9d9] transition hover:bg-[#f3e9d9] hover:text-[#3f3b2b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f3e9d9]">
            <FileText className="h-4 w-4" />
            Unduh undangan (PDF)
          </a>
        )}
      </div>
    </div>
  );
}
