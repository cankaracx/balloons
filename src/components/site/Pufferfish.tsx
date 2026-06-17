export default function Pufferfish({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 210" aria-hidden="true">
      <defs>
        <radialGradient id="fg" cx="42%" cy="34%" r="74%">
          <stop offset="0%" stopColor="#FFB089" />
          <stop offset="46%" stopColor="#F2541B" />
          <stop offset="100%" stopColor="#C13A12" />
        </radialGradient>
      </defs>
      <g fill="#D8431A">
        <path d="M100 30 100 8 116 36Z" /><path d="M140 44 160 30 148 56Z" /><path d="M166 78 190 72 170 92Z" />
        <path d="M172 116 194 122 170 130Z" /><path d="M154 152 170 174 138 158Z" /><path d="M100 172 100 196 84 166Z" />
        <path d="M46 152 30 174 62 158Z" /><path d="M28 116 6 122 30 130Z" /><path d="M34 78 10 72 30 92Z" /><path d="M60 44 40 30 52 56Z" />
      </g>
      <circle cx="100" cy="106" r="64" fill="url(#fg)" />
      <ellipse cx="62" cy="124" rx="11" ry="7" fill="#FFB089" opacity=".55" />
      <ellipse cx="138" cy="124" rx="11" ry="7" fill="#FFB089" opacity=".55" />
      <circle cx="79" cy="96" r="15" fill="#fff" /><circle cx="121" cy="96" r="15" fill="#fff" />
      <circle cx="83" cy="99" r="7" fill="#16171B" /><circle cx="125" cy="99" r="7" fill="#16171B" />
      <circle cx="80" cy="96" r="2.2" fill="#fff" /><circle cx="122" cy="96" r="2.2" fill="#fff" />
      <path d="M84 130 q16 13 32 0" stroke="#16171B" strokeWidth="3.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}
