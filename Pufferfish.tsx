import type { CSSProperties } from "react";

type Props = {
  size?: number;
  className?: string;
  style?: CSSProperties;
  title?: string;
};

/**
 * BALLOONS mascot — an inflated red pufferfish.
 * The signature element of the brand: small by nature, but built to expand
 * far beyond its size. Pure inline SVG so it scales crisply and costs nothing.
 */
export default function Pufferfish({ size = 120, className, style, title = "BALLOONS pufferfish" }: Props) {
  const cx = 100;
  const cy = 104;
  const bodyR = 56;
  const spikeLen = 16;
  const spikeCount = 14;

  // Generate evenly-spaced spikes around the body.
  const spikes = Array.from({ length: spikeCount }, (_, i) => {
    const a = (i / spikeCount) * Math.PI * 2 - Math.PI / 2;
    const half = (Math.PI / spikeCount) * 0.62;
    const x1 = cx + Math.cos(a - half) * bodyR;
    const y1 = cy + Math.sin(a - half) * bodyR;
    const x2 = cx + Math.cos(a + half) * bodyR;
    const y2 = cy + Math.sin(a + half) * bodyR;
    const tx = cx + Math.cos(a) * (bodyR + spikeLen);
    const ty = cy + Math.sin(a) * (bodyR + spikeLen);
    return `M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${tx.toFixed(1)} ${ty.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)} Z`;
  });

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      style={style}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="puffBody" cx="42%" cy="36%" r="72%">
          <stop offset="0%" stopColor="#F8717B" />
          <stop offset="48%" stopColor="#E5283C" />
          <stop offset="100%" stopColor="#C01F30" />
        </radialGradient>
      </defs>

      {/* tail fin */}
      <path d={`M ${cx + 44} ${cy} q 34 -22 30 22 q -4 22 -30 0 Z`} fill="#C01F30" opacity="0.92" />

      {/* spikes */}
      <g fill="#D32236">
        {spikes.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      {/* body */}
      <circle cx={cx} cy={cy} r={bodyR} fill="url(#puffBody)" />

      {/* belly highlight */}
      <ellipse cx={cx - 6} cy={cy + 18} rx={34} ry={24} fill="#fff" opacity="0.12" />

      {/* side fins */}
      <path d={`M ${cx - 50} ${cy + 6} q -18 6 -2 20 q 12 4 12 -10 Z`} fill="#D32236" />

      {/* eyes */}
      <circle cx={cx - 18} cy={cy - 10} r="14" fill="#fff" />
      <circle cx={cx + 18} cy={cy - 10} r="14" fill="#fff" />
      <circle cx={cx - 15} cy={cy - 8} r="6.5" fill="#0B1F3A" />
      <circle cx={cx + 21} cy={cy - 8} r="6.5" fill="#0B1F3A" />
      <circle cx={cx - 13} cy={cy - 10} r="2" fill="#fff" />
      <circle cx={cx + 23} cy={cy - 10} r="2" fill="#fff" />

      {/* mouth */}
      <path d={`M ${cx - 8} ${cy + 18} q 8 7 16 0`} stroke="#0B1F3A" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}
