/**
 * WhatsApp — Phase 1 stub. Builds click-to-chat links now; outbound messages are logged, not sent.
 * TODO: wire WhatsApp Cloud API (WHATSAPP_CLOUD_API_TOKEN + WHATSAPP_PHONE_NUMBER_ID).
 */
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? process.env.WHATSAPP_NUMBER ?? "919000000000";

export function whatsappLink(message = "Hello, I would like to know more about staying at Swetaranya.") {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export interface WhatsAppSender {
  sendTemplate(to: string, template: string, params: Record<string, string>): Promise<{ ok: boolean; id?: string }>;
}

class StubWhatsAppSender implements WhatsAppSender {
  async sendTemplate(to: string, template: string, params: Record<string, string>) {
    // TODO: wire WhatsApp Cloud API
    console.info("[whatsapp:stub] would send", { to, template, params });
    return { ok: true, id: `stub-${Date.now()}` };
  }
}

export const whatsapp: WhatsAppSender = new StubWhatsAppSender();
