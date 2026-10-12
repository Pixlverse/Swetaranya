"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "framer-motion";

type Stop = { label: string; text: string };

const EASE = [0.22, 0.61, 0.36, 1] as const;
/** Copper: the brand's terracotta warmed with blush, so the thread glows on the dark ground. */
const COPPER = "color-mix(in srgb, var(--color-terracotta) 65%, var(--color-blush))";

/**
 * "The thread of care": one hand-drawn copper line that draws itself as the visitor scrolls — across
 * the screen (which holds in place) on wider screens, down the left edge on phones. At each stop it opens into a photograph
 * of that part of Swetaranya, and that stop's fact appears the moment the line reaches it.
 * With reduced motion the whole thread is simply drawn.
 */
export function ThreadOfCare({ heading, stops }: { heading: string; stops: readonly Stop[] }) {
  const reduce = !!useReducedMotion();
  const track = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const probe = useRef<SVGPathElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [marks, setMarks] = useState<number[]>([]);
  const [reached, setReached] = useState(-1);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    // Measure the padding box: the SVG and the absolutely placed facts are both laid out against it.
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
    // Re-attach when the layout switches between the phone and wide versions (a different element is measured).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.w < 768]);

  const narrow = size.w < 768;
  const wide = !narrow;
  const n = stops.length;

  // Where each stop sits, and the thread that wanders between them.
  const { points, d } = useMemo(() => {
    const { w, h } = size;
    if (!w || !h) return { points: [] as { x: number; y: number }[], d: "" };
    if (wide) {
      // Across the screen: rising and falling between stops, text above the high ones and below the low ones.
      const mid = h / 2;
      const amp = Math.min(h * 0.11, 62);
      const pts = stops.map((_, i) => ({ x: ((i + 0.5) / n) * w, y: mid + (i % 2 ? amp : -amp) }));
      let path = `M0 ${mid}`;
      let prev = { x: 0, y: mid };
      for (const p of [...pts, { x: w, y: mid }]) {
        const dx = (p.x - prev.x) / 2;
        path += ` C${prev.x + dx * 0.9} ${prev.y + 14} ${p.x - dx * 1.1} ${p.y - 14} ${p.x} ${p.y}`;
        prev = p;
      }
      return { points: pts, d: path };
    }
    const pts = stops.map((_, i) => ({ x: 40, y: ((i + 0.5) / n) * h }));
    let path = "M40 0";
    let prev = { x: 40, y: 0 };
    // Between stops the thread swings out to one side and back across, an S that alternates direction,
    // so it reads as a hand-laid thread rather than a straight rule.
    [...pts, { x: 40, y: h }].forEach((p, i) => {
      const dy = p.y - prev.y;
      const s = i % 2 ? -1 : 1;
      path += ` C${prev.x + s * 110} ${prev.y + dy * 0.3} ${p.x - s * 110} ${p.y - dy * 0.3} ${p.x} ${p.y}`;
      prev = p;
    });
    return { points: pts, d: path };
  }, [size, stops, n, wide]);

  // How far along the thread each stop is, measured on the real path.
  useLayoutEffect(() => {
    const el = probe.current;
    if (!el || !d) return;
    const total = el.getTotalLength();
    const out: number[] = [];
    let j = 0;
    for (let l = 0; l <= total && j < points.length; l += 4) {
      const at = el.getPointAtLength(l);
      if (wide ? at.x >= points[j].x - 1 : at.y >= points[j].y - 1) {
        out.push(l / total);
        j++;
      }
    }
    setMarks(out);
  }, [d, points, wide]);

  // Wide: the section holds on screen and scrolling through it draws the thread. Narrow: the thread follows the page.
  const { scrollYProgress } = useScroll(wide ? { target: track, offset: ["start start", "end end"] } : { target: box, offset: ["start 60%", "end 60%"] });
  const drawn = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  useMotionValueEvent(drawn, "change", (v) => setReached(marks.filter((m) => v >= m - 0.005).length - 1));
  const shown = reduce ? n - 1 : reached;

  const thread = d && (
    <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
      <path ref={probe} d={d} fill="none" stroke="none" />
      {/* The thread's faint guide, then the thread itself. */}
      <path d={d} fill="none" stroke="var(--color-cream)" strokeOpacity="0.08" strokeWidth="1.5" />
      <motion.path d={d} fill="none" stroke={COPPER} strokeWidth={narrow ? 2 : 2.5} strokeLinecap="round" style={reduce ? undefined : { pathLength: drawn }} />
      {points.map((p, i) => (
        <Motif key={i} index={i} x={p.x} y={p.y} size={narrow ? 64 : 108} on={i <= shown} reduce={reduce} />
      ))}
    </svg>
  );

  const fact = (i: number, align: string) => (
    <motion.div
      className={align}
      initial={false}
      animate={{ opacity: i <= shown ? 1 : 0, y: i <= shown || reduce ? 0 : 8 }}
      transition={{ duration: reduce ? 0 : 0.6, ease: EASE }}
    >
      {/* Engraved caption, a fine rule, then the fact itself. */}
      <p className="text-balance text-[0.7rem] font-bold uppercase leading-relaxed tracking-[0.22em]" style={{ color: COPPER }}>
        {stops[i].label}
      </p>
      <span aria-hidden className={`mt-2.5 block h-px w-8 ${align === "text-center" ? "mx-auto" : ""}`} style={{ background: COPPER, opacity: 0.6 }} />
      <p className={`mt-2.5 font-heading font-normal leading-snug text-cream ${wide ? "text-[clamp(0.98rem,1.3vw,1.2rem)]" : "text-[1.1rem]"}`}>
        {stops[i].text}
      </p>
    </motion.div>
  );

  const title = <h2 className="text-center text-[clamp(1.8rem,3vw,2.6rem)] text-cream">{heading}</h2>;

  // Phones: the thread runs down the left edge, each fact beside its shape.
  if (!wide) {
    return (
      <div className="on-dark bg-nordic pb-12 pt-12 text-cream">
        <div className="px-5 pb-8">{title}</div>
        <div ref={box} className="relative mx-auto px-3" style={{ height: `${n * 19}svh`, minHeight: n * 140 }}>
          {thread}
          <ol>
            {points.map((p, i) => (
              <li key={stops[i].label} className="absolute w-[calc(100%-6.5rem)] -translate-y-1/2" style={{ top: p.y, left: p.x + 50 }}>
                {fact(i, "")}
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

  // Wider screens: the section holds while the thread is drawn across it.
  return (
    <div ref={track} className="relative" style={{ height: reduce ? "auto" : "240vh" }}>
      <div className={`on-dark flex flex-col overflow-hidden bg-nordic text-cream ${reduce ? "py-20" : "sticky top-0 h-[100svh] pb-6 pt-[5.5rem] sm:pt-24"}`}>
        {title}
        <div
          ref={box}
          className="relative mx-auto mt-2 h-[min(37rem,76svh)] w-full max-w-[88rem] px-5 sm:px-8"
          style={reduce ? { height: "28rem" } : undefined}
        >
          {thread}
          <ol>
            {points.map((p, i) => {
              const high = i % 2 === 0;
              const colW = Math.min(240, size.w / n + 30);
              return (
                <li
                  key={stops[i].label}
                  className="absolute"
                  style={{ left: p.x - colW / 2, width: colW, ...(high ? { bottom: size.h - p.y + 70 } : { top: p.y + 70 }) }}
                >
                  {fact(i, "text-center")}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}

/** The photograph at each stop, in the order the thread reaches them. */
const PHOTOS = ["/home-icon.jpg", "/room-icon.jpg", "/physician-icon.jpg", "/treatment-icon.jpg", "/vaidya-sala-icon.jpg", "/guest-icon.jpg"];
/** Served through Next's image optimiser so a 1 MB original arrives as a small, sharp thumbnail. */
const thumb = (src: string) => `/_next/image?url=${encodeURIComponent(src)}&w=256&q=75`;

/** At each stop the thread opens into a round photograph inside a copper double ring. */
function Motif({ index, x, y, size, on, reduce }: { index: number; x: number; y: number; size: number; on: boolean; reduce: boolean }) {
  const r = size / 2;
  const id = `thread-clip-${index}`;
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <clipPath id={id}>
          <circle r={r - 6} />
        </clipPath>
      </defs>
      {/* A dark disc so the thread passes behind the photograph. */}
      <circle r={r + 2} fill="var(--color-nordic)" />
      <motion.g initial={false} animate={{ opacity: on ? 1 : 0.18, scale: on || reduce ? 1 : 0.9 }} transition={{ duration: reduce ? 0 : 0.7, ease: EASE }}>
        <image
          href={thumb(PHOTOS[index % PHOTOS.length])}
          x={-(r - 6)}
          y={-(r - 6)}
          width={(r - 6) * 2}
          height={(r - 6) * 2}
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${id})`}
        />
      </motion.g>
      <motion.circle
        r={r}
        fill="none"
        stroke={COPPER}
        strokeWidth="1.5"
        initial={false}
        animate={{ opacity: on ? 0.9 : 0.25 }}
        transition={{ duration: reduce ? 0 : 0.5 }}
      />
      <circle r={r - 3.5} fill="none" stroke={COPPER} strokeWidth="0.8" opacity="0.45" />
    </g>
  );
}
