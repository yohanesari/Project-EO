// Hanya untuk server.
import { randomBytes } from "node:crypto";
import { pool } from "./db";

// "0812-3456-789" / "+62 812..." -> "62812..."
export function normalizePhone(raw) {
  let d = String(raw ?? "").replace(/\D/g, "");
  if (d.startsWith("0")) d = "62" + d.slice(1);
  else if (d.startsWith("8")) d = "62" + d;
  return d;
}

export function isValidPhone(p) {
  return /^\d{9,15}$/.test(p);
}

// Simpan RSVP. Nomor HP yang sama di acara yang sama = memperbarui jawaban
// (kode QR tetap sama, jadi link yang sudah dibagikan tidak rusak).
export async function saveRsvp({ eventSlug, name, phone, attending }) {
  const [events] = await pool.query("SELECT id FROM events WHERE slug = ?", [eventSlug]);
  if (events.length === 0) return null;
  const eventId = events[0].id;

  const code = randomBytes(5).toString("hex"); // 10 karakter
  await pool.query(
    `INSERT INTO rsvps (event_id, name, phone, attending, code)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE name = VALUES(name), attending = VALUES(attending)`,
    [eventId, name, phone, attending ? 1 : 0, code]
  );

  const [rows] = await pool.query(
    "SELECT name, attending, code FROM rsvps WHERE event_id = ? AND phone = ?",
    [eventId, phone]
  );
  const r = rows[0];
  return { name: r.name, attending: !!r.attending, code: r.code };
}

export async function findRsvpByCode(eventSlug, code) {
  const [rows] = await pool.query(
    `SELECT r.name, r.attending, r.code
       FROM rsvps r JOIN events e ON e.id = r.event_id
      WHERE e.slug = ? AND r.code = ?`,
    [eventSlug, code]
  );
  if (rows.length === 0) return null;
  return { name: rows[0].name, attending: !!rows[0].attending, code: rows[0].code };
}

export async function findRsvpByPhone(eventSlug, phone) {
  const [rows] = await pool.query(
    `SELECT r.name, r.attending, r.code
       FROM rsvps r JOIN events e ON e.id = r.event_id
      WHERE e.slug = ? AND r.phone = ?`,
    [eventSlug, phone]
  );
  if (rows.length === 0) return null;
  return { name: rows[0].name, attending: !!rows[0].attending, code: rows[0].code };
}
