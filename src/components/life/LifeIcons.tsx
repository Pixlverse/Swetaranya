/** Small line icons for the "Icons" lists on Life at Swetaranya. Keppel stroke, drawn on a 24px grid. */
const PATHS: Record<string, string[]> = {
  // The place
  "Nature all around": ["M12 21v-7", "M12 14c-4 0-7-3-7-8 4 0 7 3 7 8Z", "M12 12c0-4 2.5-7 7-7 0 4.5-3 7-7 7Z", "M4 21h16"],
  "A traditional home": ["M2.5 11 12 4l9.5 7", "M4.5 9.5 3 12M19.5 9.5 21 12", "M5.5 10.5V20h13v-9.5", "M10 20v-5h4v5"],
  "Only a few patients": ["M8 10a2.6 2.6 0 1 0 0-5.2A2.6 2.6 0 0 0 8 10Z", "M3.5 19a4.5 4.5 0 0 1 9 0", "M16 10.5a2.2 2.2 0 1 0 0-4.4", "M15 13.6a4 4 0 0 1 5.5 3.9"],
  // Your treatment
  "Body nature (prakriti)": ["M12 7.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z", "M12 7.5v8", "M7 11h10", "M12 15.5l-3.5 6M12 15.5l3.5 6"],
  Digestion: ["M12 21c3.5 0 6-2.6 6-6 0-4.4-6-11-6-11S6 10.6 6 15c0 3.4 2.5 6 6 6Z", "M12 17.5a2.5 2.5 0 0 1-2.5-2.5"],
  "Mind & emotions": ["M12 20.5s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 8a4.3 4.3 0 0 1 7.5 2.5c0 5.4-7.5 10-7.5 10Z", "M9 12.5h1.5l1-2 1.5 4 1-2H15"],
  "Other health conditions": ["M9 3.5h6v5.5h5.5v6H15v5.5H9V15H3.5V9H9Z"],
  "Where you live & your climate": ["M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z", "M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"],
};

export function LifeIcon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  const d = PATHS[name] ?? [];
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {d.map((p) => (
        <path key={p} d={p} />
      ))}
    </svg>
  );
}
