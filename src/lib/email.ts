import "server-only";
import { Resend } from "resend";

/** Resend wrapper. Without RESEND_API_KEY (local dev) emails are logged instead of sent. */
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.EMAIL_FROM ?? "Swetaranya <care@swetaranya.com>";

export async function sendEmail({ to, subject, text, html }: { to: string | string[]; subject: string; text: string; html?: string }) {
  if (!resend) {
    console.info("[email:dev] not sent (no RESEND_API_KEY)", { to, subject, text: text.slice(0, 400) });
    return { ok: true, dev: true };
  }
  const { error } = await resend.emails.send({ from: FROM, to, subject, text, html });
  if (error) {
    console.error("[email] send failed", error);
    return { ok: false };
  }
  return { ok: true };
}

/** Plain, warm HTML — one column, brand colours, no marketing chrome. */
export function emailHtml(heading: string, paragraphs: string[], cta?: { label: string; href: string }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
  return `<!doctype html><html><body style="margin:0;background:#F7F9F8;font-family:Orkney,Helvetica,Arial,sans-serif;color:#14201F">
<div style="max-width:560px;margin:0 auto;padding:40px 24px">
<p style="margin:0 0 28px"><img src="${siteUrl}/wordmark.png" alt="Swetāranya" width="180" height="30" style="display:block;border:0"></p>
<h1 style="font-family:Georgia,serif;font-weight:400;font-size:28px;line-height:1.2;color:#1D393C;margin:0 0 20px">${esc(heading)}</h1>
${paragraphs.map((p) => `<p style="font-size:16px;line-height:1.7;margin:0 0 16px">${esc(p)}</p>`).join("")}
${cta ? `<p style="margin:28px 0"><a href="${esc(cta.href)}" style="background:#59AA99;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:bold">${esc(cta.label)}</a></p>` : ""}
<p style="font-size:13px;color:#1D393C;opacity:.7;margin-top:36px;border-top:1px solid #d6dedc;padding-top:16px">Swetaranya — a traditional Ayurvedic home in Kerala.</p>
</div></body></html>`;
}
