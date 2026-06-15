"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Self-contained scroll-progress line.
 * A thin glowing line fixed to the left of the viewport that "draws" downward
 * as you scroll the page, weaving left<->right, with a glowing dot at its tip.
 * Depends on NOTHING else (no globals.css, no tailwind keyframes).
 */
export default function ScrollLine() {
  const pathRef = useRef<SVGPathElement>(null);
  const drawRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGGElement>(null);

  const [size, setSize] = useState({ w: 200, h: 800 });
  const [enabled, setEnabled] = useState(false);

  // enable only on wider screens + non-reduced-motion
  useEffect(() => {
    const check = () => {
      const ok =
        window.innerWidth >= 768 &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setEnabled(ok);
      setSize({ w: Math.min(window.innerWidth * 0.2, 240), h: window.innerHeight });
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // build a weaving sine path that spans the viewport height
  const path = (() => {
    const { w, h } = size;
    const cx = w * 0.45;
    const amp = w * 0.4; // how far it swings left/right
    const waves = Math.max(2, Math.round(h / 320)); // swings per screen
    const steps = 60;
    let d = "";
    for (let i = 0; i <= steps; i++) {
      const y = (h / steps) * i;
      const x = cx + amp * Math.sin((i / steps) * waves * Math.PI * 2);
      d += i === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    return d;
  })();

  const [len, setLen] = useState(0);
  useEffect(() => {
    if (pathRef.current) setLen(pathRef.current.getTotalLength());
  }, [path]);

  // drive draw + dot on scroll
  useEffect(() => {
    if (!enabled || !len) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
        const drawn = len * p;
        if (drawRef.current) drawRef.current.style.strokeDashoffset = String(len - drawn);
        if (dotRef.current && pathRef.current) {
          const pt = pathRef.current.getPointAtLength(drawn);
          dotRef.current.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [enabled, len]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: size.w,
        height: "100vh",
        pointerEvents: "none",
        zIndex: 30,
      }}
    >
      <style>{`@keyframes blpulse{0%,100%{opacity:.35;transform:scale(1)}50%{opacity:.7;transform:scale(1.6)}}`}</style>
      <svg width={size.w} height={size.h} style={{ overflow: "visible", display: "block" }}>
        <defs>
          <linearGradient id="bl-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E5283C" />
            <stop offset="100%" stopColor="#F25563" />
          </linearGradient>
        </defs>

        {/* faint full track */}
        <path ref={pathRef} d={path} fill="none" stroke="#94a3b8" strokeOpacity="0.25" strokeWidth="1.5" />

        {/* drawn progress line */}
        <path
          ref={drawRef}
          d={path}
          fill="none"
          stroke="url(#bl-grad)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{
            strokeDasharray: len,
            strokeDashoffset: len,
            filter: "drop-shadow(0 0 4px rgba(229,40,60,0.7))",
          }}
        />

        {/* glowing dot at the tip */}
        <g ref={dotRef}>
          <circle r="7" fill="#F25563" style={{ animation: "blpulse 1.8s ease-in-out infinite", transformOrigin: "center" }} />
          <circle r="3.5" fill="#fff" />
        </g>
      </svg>
    </div>
  );
}
