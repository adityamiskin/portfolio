const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

function isoIfReal(year: number, month: number, day: number) {
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCMonth() === month - 1 && date.getUTCDate() === day
    ? date.toISOString().slice(0, 10)
    : null;
}

/** Normalizes frontmatter dates ("2025-12-27", "December 27, 2025", "dec 27, 2025") to YYYY-MM-DD. */
export function toIsoDate(raw: string): string | null {
  const s = raw.trim();
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (iso) return isoIfReal(Number(iso[1]), Number(iso[2]), Number(iso[3]));
  const named = /^([a-z]{3,})\.?\s+(\d{1,2}),?\s+(\d{4})$/i.exec(s);
  if (!named) return null;
  const month = MONTHS.indexOf(named[1].slice(0, 3).toLowerCase()) + 1;
  return month ? isoIfReal(Number(named[3]), month, Number(named[2])) : null;
}

const longDate = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
const shortDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/** "December 27, 2025" — post pages. */
export const formatBlogDate = (isoDate: string) => longDate.format(new Date(isoDate));

/** "dec 27, 2025" — listings. */
export const formatBlogDateShort = (isoDate: string) =>
  shortDate.format(new Date(isoDate)).toLowerCase();
