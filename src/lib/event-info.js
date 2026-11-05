import * as invitation from "@/data/invitation";

const isInfo = (v) => v && typeof v === "object" && "groom" in v && "bride" in v;

// Mencari objek undangan { groom, bride, dateLabel, events... } di dalam modul.
// Mendukung: export default {...}, export const DATA = {...},
// array berisi beberapa undangan (dicocokkan lewat slug), atau objek { [slug]: {...} }.
export function pickInfo(mod, slug) {
  const vals = [mod.default, ...Object.values(mod)];
  for (const v of vals) {
    if (!v || typeof v !== "object") continue;
    if (Array.isArray(v)) {
      const f = v.find((x) => x && x.slug === slug) ?? (v.length === 1 ? v[0] : null);
      if (isInfo(f)) return f;
    } else if (isInfo(v)) {
      return v;
    } else if (isInfo(v[slug])) {
      return v[slug];
    }
  }
  return null;
}

export const getEventInfo = (slug) => pickInfo(invitation, slug);
