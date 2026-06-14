"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A thin glowing vertical line fixed to the viewport that "draws" downward as
 * the user scrolls. The line weaves left<->right as each section boundary
 * approaches, and a glowing dot always rides the tip of the drawn portion.
 *
 * Implementation: one tall SVG sized to the document height. A vertical path
 * weaves horizontally using the offsets of each <section> as control points.
 * Scroll progress drives strokeDashoffset (the "draw") and the dot position.
 */
export default function ScrollLine() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGGElement>(null);

  const [d, setD] = useState("");
  const [docH, setDocH] = useState(0);
  const [pathLen, setPathLen] = useState(0);
  const [enabled, setEnabled] = useState(true);

  // Horizontal band the line lives in (px from left). It rests at REST and
  // swings to NEAR_EDGE on alternating sides as sections approach.
  const REST = 26;

  // Build the weaving path from the positions of each <section>.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 767px)").matches;
    if (reduce || narrow) {
      setEnabled(false);
      return;
    }
    setEnabled(true);

    function build() {
      const docHeight = document.documentElement.scrollHeight;
      const sections = Array.from(document.querySelectorAll("main section")) as HTMLElement[];
      if (sections.length === 0) return;

      const swing = Math.min(Math.max(window.innerWidth * 0.06, 40), 90); // how far it weaves
      const top = sections[0].offsetTop + 80;

      // Control points: rest at each section's middle, swing at each boundary.
      const pts: { x: number; y: number }[] = [{ x: REST, y: top }];
      sections.forEach((sec, i) => {
        const start = sec.offsetTop;
        const mid = sec.offsetTop + sec.offsetHeight / 2;
        const side = i % 2 === 0 ? 1 : -1; // alternate weave direction
        // boundary swing (line pushes out as the section arrives)
        pts.push({ x: REST + side * swing, y: start });
        // settle back toward rest through the body of the section
        pts.push({ x: REST, y: mid });
      });
      const last = sections[sections.length - 1];
      pts.push({ x: REST, y: last.offsetTop + last.offsetHeight - 40 });

      // Smooth the points into a path with quadratic midpoint smoothing.
      let path = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2;
        const my = (pts[i].y + pts[i + 1].y) / 2;
        path += ` Q ${pts[i].x} ${pts[i].y} ${mx} ${my}`;
      }
      const end = pts[pts.length - 1];
      path += ` L ${end.x} ${end.y}`;

      setD(path);
      setDocH(docHeight);
    }

    build();
    const ro = new ResizeObserver(build);
    ro.observe(document.body);
    window.addEventListener("resize", build);
    // rebuild after images/fonts settle
    const t1 = setTimeout(build, 400);
    const t2 = setTimeout(build, 1200);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", build);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Measure path length whenever the path changes.
  useEffect(() => {
    if (pathRef.current && d) setPathLen(pathRef.current.getTotalLength());
  }, [d]);

  // Drive the draw + dot on scroll.
  useEffect(() => {
    if (!enabled || !pathLen) return;
    let raf = 0;

    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? Math.min(Math.max(window.scrollY / scrollable, 0), 1) : 0;
        const drawn = pathLen * progress;

        if (pathRef.current) {
          pathRef.current.style.strokeDashoffset = String(pathLen - drawn);
        }
        if (dotRef.current && pathRef.current) {
          const p = pathRef.current.getPointAtLength(drawn);
          dotRef.current.setAttribute("transform", `translate(${p.x} ${p.y})`);
        }
      });
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [enabled, pathLen]);

  if (!enabled) return null;

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0 z-[5] hidden md:block" aria-hidden>
      <svg width="100%" height={docH} className="absolute left-0 top-0" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="line-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E5283C" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#F25563" stopOpacity="0.9" />
          </linearGradient>
          <filter id="dot-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* faint full track */}
        <path d={d} fill="none" stroke="#41618F" strokeOpacity="0.18" strokeWidth="1.5" strokeLinecap="round" />

        {/* drawn (progress) line */}
        <path
          ref={pathRef}
          d={d}
          fill="none"
          stroke="url(#line-grad)"
          strokeWidth="1.75"
          strokeLinecap="round"
          style={{
            strokeDasharray: pathLen,
            strokeDashoffset: pathLen,
            filter: "drop-shadow(0 0 3px rgba(229,40,60,0.55))",
          }}
        />

        {/* glowing dot at the tip */}
        <g ref={dotRef} filter="url(#dot-glow)">
          <circle r="6" fill="#F25563" opacity="0.35" />
          <circle r="3" fill="#fff" />
          <circle r="3" fill="#E5283C" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
}
