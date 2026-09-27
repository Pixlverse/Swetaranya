const KEY = "swet_attribution";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export type Attribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  landingPage?: string;
  referrer?: string;
};

/** First-touch: only stored on the first landing, or when a later visit arrives with fresh UTM tags. */
export function captureAttribution() {
  try {
    const params = new URLSearchParams(window.location.search);
    const hasUtm = UTM_KEYS.some((k) => params.get(k));
    if (localStorage.getItem(KEY) && !hasUtm) return;
    const data: Attribution = {
      utmSource: params.get("utm_source") ?? undefined,
      utmMedium: params.get("utm_medium") ?? undefined,
      utmCampaign: params.get("utm_campaign") ?? undefined,
      utmTerm: params.get("utm_term") ?? undefined,
      utmContent: params.get("utm_content") ?? undefined,
      landingPage: window.location.pathname,
      referrer: document.referrer || undefined,
    };
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Storage blocked (private mode) — attribution is best-effort.
  }
}

export function readAttribution(): Attribution {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}
