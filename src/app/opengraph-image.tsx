import { ImageResponse } from "next/og";
import { loadData } from "@/lib/store";
import { pick } from "@/lib/i18n";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const alt = "BALLOONS — rookie FRC team at TED Antalya Koleji";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CHAR = "#15161A";
const BONE = "#F7F4ED";
const ACCENT = "#EE4A1B";
const INK_SOFT = "#8E8F96";

async function loadFont() {
  const res = await fetch(
    "https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2ZL7.ttf",
    { next: { revalidate: 86400 } },
  );
  if (!res.ok) return null;
  return res.arrayBuffer();
}

export default async function OgImage() {
  const data = await loadData();
  const font = await loadFont();
  const teamNo = data.brand.teamNumber?.trim();
  const tagline = pick(data.hero.sub, "en");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: CHAR,
          color: BONE,
          fontFamily: font ? "Inter" : "system-ui",
        }}
      >
        <div style={{ width: 10, background: ACCENT, flexShrink: 0 }} />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 64px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <svg width="56" height="56" viewBox="0 0 200 210" aria-hidden="true">
              <circle cx="100" cy="106" r="64" fill="#F2541B" />
              <circle cx="79" cy="96" r="14" fill="#fff" />
              <circle cx="121" cy="96" r="14" fill="#fff" />
              <circle cx="83" cy="99" r="6" fill={CHAR} />
              <circle cx="125" cy="99" r="6" fill={CHAR} />
            </svg>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>
                {data.brand.name}
              </span>
              <span style={{ fontSize: 14, color: INK_SOFT, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                FIRST Robotics Competition · Antalya
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 920 }}>
            <p
              style={{
                fontSize: 52,
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              Rookie team, built to expand.
            </p>
            <p style={{ fontSize: 24, lineHeight: 1.45, color: INK_SOFT, margin: 0 }}>
              {tagline.length > 140 ? `${tagline.slice(0, 137)}…` : tagline}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 16, color: INK_SOFT }}>TED Antalya Koleji</span>
            {teamNo ? (
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  padding: "10px 16px",
                  border: `2px solid ${ACCENT}`,
                  borderRadius: 4,
                  color: BONE,
                }}
              >
                FRC Team {teamNo}
              </span>
            ) : (
              <span style={{ fontSize: 15, color: ACCENT, fontWeight: 600 }}>Founding sponsors welcome</span>
            )}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font
        ? [{ name: "Inter", data: font, weight: 700, style: "normal" }]
        : undefined,
    },
  );
}
