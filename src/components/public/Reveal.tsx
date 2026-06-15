"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Injects its own CSS once, so reveals work without relying on globals.css. */
let injected = false;
function ensureStyles() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const css = `
.bl-reveal{opacity:0;transform:translateY(28px) scale(.985);filter:blur(6px);
  transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1),filter .8s cubic-bezier(.16,1,.3,1);
  will-change:opacity,transform,filter}
.bl-reveal.is-visible{opacity:1;transform:none;filter:none}
@media (prefers-reduced-motion: reduce){.bl-reveal{opacity:1;transform:none;filter:none;transition:none}}`;
  const el = document.createElement("style");
  el.textContent = css;
  document.head.appendChild(el);
}

export default function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "section";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    ensureStyles();
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    // @ts-expect-error — dynamic tag with ref is fine at runtime
    <Tag ref={ref} className={`bl-reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}
