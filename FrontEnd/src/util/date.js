export function parseApiDate(s) {
  if (!s) return null;
  try {
    if (typeof s === "number") return new Date(s);
    if (s.includes("T")) {
      const d = new Date(s);
      return isNaN(d.getTime()) ? null : d;
    }
    // handle MySQL datetime like '2026-06-22 15:26:57.000000'
    const cleaned = s.replace(" ", "T").split(".")[0];
    const d = new Date(cleaned);
    if (!isNaN(d.getTime())) return d;
    // try replacing space with T and adding Z
    const z = cleaned + "Z";
    const d2 = new Date(z);
    return isNaN(d2.getTime()) ? null : d2;
  } catch (e) {
    return null;
  }
}

export function formatLocal(s, locale = "ko-KR", options) {
  const d = s instanceof Date ? s : parseApiDate(s);
  if (!d) return "";
  return d.toLocaleString(locale, options);
}

export default { parseApiDate, formatLocal };
