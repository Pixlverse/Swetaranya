"use client";

import { useEffect } from "react";

const MIN_MS = 1200;
const MAX_MS = 2600;

/** Lifts the splash when the page has loaded (never sooner than MIN_MS, never later than MAX_MS). */
export function SplashController() {
  useEffect(() => {
    const el = document.getElementById("site-splash");
    if (!el || document.documentElement.dataset.splash === "seen") return;
    const started = performance.now();
    let done = false;
    const lift = () => {
      if (done) return;
      done = true;
      const wait = Math.max(0, MIN_MS - (performance.now() - started));
      window.setTimeout(() => {
        el.classList.add("is-done");
        try {
          sessionStorage.setItem("swet_splash", "1");
        } catch {}
        window.setTimeout(() => (document.documentElement.dataset.splash = "seen"), 700);
      }, wait);
    };
    if (document.readyState === "complete") lift();
    else window.addEventListener("load", lift, { once: true });
    const cap = window.setTimeout(lift, MAX_MS);
    return () => {
      window.removeEventListener("load", lift);
      window.clearTimeout(cap);
    };
  }, []);
  return null;
}
