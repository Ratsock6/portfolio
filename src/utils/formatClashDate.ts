function parseClashDate(dateStr: string): Date | null {
  const s = String(dateStr).trim();
  const m = s.match(
    /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(?:\.(\d{1,3}))?Z$/
  );
  if (m) {
    const [, Y, Mo, D, h, mi, se, ms = "000"] = m;
    const iso = `${Y}-${Mo}-${D}T${h}:${mi}:${se}.${ms.padEnd(3, "0")}Z`;
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
  }

  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

export function formatClashDate(dateStr: string | null) {
  if (!dateStr) return "";

  const date = parseClashDate(dateStr);
  if (!date) return dateStr

  const now = new Date();

  const sameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  const isToday = sameDay(date, now);

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = sameDay(date, yesterday);

  const time = date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) return `Aujourd'hui à ${time}`;
  if (isYesterday) return `Hier à ${time}`;

  const dayMonth = date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
  });

  return `${dayMonth} à ${time}`;
}