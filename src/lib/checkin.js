// Hanya untuk server.
import { pool } from "./db";
import { normalizePhone } from "./rsvp";

const iso = (d) => (d ? new Date(d).toISOString() : null);

const shape = (r) => ({
  name: r.name,
  guestCount: r.guest_count,
  checkedInAt: iso(r.checked_in_at),
});

export async function listEvents() {
  const [rows] = await pool.query("SELECT slug, title FROM events ORDER BY id");
  return rows;
}

export async function getEvent(slug) {
  const [rows] = await pool.query("SELECT slug, title FROM events WHERE slug = ?", [slug]);
  return rows[0] ?? null;
}

async function findByCode(eventSlug, code) {
  const [rows] = await pool.query(
    `SELECT r.id, r.name, r.attending, r.guest_count, r.checked_in_at
       FROM rsvps r JOIN events e ON e.id = r.event_id
      WHERE e.slug = ? AND r.code = ?`,
    [eventSlug, code]
  );
  return rows[0] ?? null;
}

// status: ok | already | not_attending | invalid
export async function checkIn(eventSlug, code, adminId = null) {
  const r = await findByCode(eventSlug, code);
  if (!r) return { status: "invalid" };
  if (!r.attending) return { status: "not_attending", rsvp: shape(r) };

  // UPDATE bersyarat: kalau dua petugas memindai QR yang sama bersamaan, hanya satu yang berhasil
  const [res] = await pool.query(
    `UPDATE rsvps SET checked_in_at = UTC_TIMESTAMP(), checked_in_by = ?
      WHERE id = ? AND checked_in_at IS NULL`,
    [adminId, r.id]
  );
  const fresh = await findByCode(eventSlug, code);
  return { status: res.affectedRows === 1 ? "ok" : "already", rsvp: shape(fresh) };
}

export async function undoCheckIn(eventSlug, code) {
  const r = await findByCode(eventSlug, code);
  if (!r) return { status: "invalid" };
  await pool.query("UPDATE rsvps SET checked_in_at = NULL, checked_in_by = NULL WHERE id = ?", [r.id]);
  return { status: "undone", rsvp: { ...shape(r), checkedInAt: null } };
}

export async function getStats(eventSlug) {
  const [[s]] = await pool.query(
    `SELECT
       COALESCE(SUM(CASE WHEN r.attending = 1 THEN r.guest_count END), 0) AS expected,
       COALESCE(SUM(CASE WHEN r.attending = 1 AND r.checked_in_at IS NOT NULL THEN r.guest_count END), 0) AS arrived,
       COALESCE(SUM(r.attending = 1), 0) AS parties,
       COALESCE(SUM(r.attending = 1 AND r.checked_in_at IS NOT NULL), 0) AS parties_arrived
     FROM rsvps r JOIN events e ON e.id = r.event_id
     WHERE e.slug = ?`,
    [eventSlug]
  );
  const [recent] = await pool.query(
    `SELECT r.name, r.guest_count, r.checked_in_at
       FROM rsvps r JOIN events e ON e.id = r.event_id
      WHERE e.slug = ? AND r.checked_in_at IS NOT NULL
      ORDER BY r.checked_in_at DESC LIMIT 8`,
    [eventSlug]
  );
  return {
    expected: Number(s.expected),
    arrived: Number(s.arrived),
    parties: Number(s.parties),
    partiesArrived: Number(s.parties_arrived),
    recent: recent.map(shape),
  };
}

// Cari tamu yang menyatakan hadir lewat nama atau nomor HP (cadangan bila QR tidak terbaca)
export async function searchGuests(eventSlug, q) {
  const esc = (t) => t.replace(/[\\%_]/g, "\\$&");
  const params = [eventSlug, `%${esc(q)}%`];
  let cond = "r.name LIKE ?";
  const digits = q.replace(/\D/g, "");
  if (digits.length >= 3) {
    cond += " OR r.phone LIKE ?";
    params.push(`%${esc(normalizePhone(digits))}%`);
  }
  const [rows] = await pool.query(
    `SELECT r.name, r.guest_count, r.checked_in_at, r.code
       FROM rsvps r JOIN events e ON e.id = r.event_id
      WHERE e.slug = ? AND r.attending = 1 AND (${cond})
      ORDER BY r.name LIMIT 8`,
    params
  );
  return rows.map((r) => ({ ...shape(r), code: r.code }));
}
