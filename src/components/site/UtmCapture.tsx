"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/** Records UTM parameters on the visitor's first landing (first-touch attribution). */
export function UtmCapture() {
  useEffect(() => captureAttribution(), []);
  return null;
}
