import "server-only";

/** One CSV cell: always quoted, with spreadsheet formula injection neutralised. */
export const csvCell = (v: unknown) => {
  const s = v === undefined || v === null ? "" : v instanceof Date ? v.toISOString() : String(v);
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
};

/** A UTF-8 (BOM-prefixed, so Excel reads it correctly) CSV download. */
export function csvResponse(filenameBase: string, header: string[], rows: unknown[][]) {
  const csv = [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n");
  const date = new Date().toISOString().slice(0, 10);
  return new Response(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filenameBase}-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
