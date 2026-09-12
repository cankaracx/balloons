export default function Pufferfish({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" aria-hidden="true">
      <circle cx="40" cy="40" r="40" fill="#B91C1C" />
      <path
        fill="#F3EFE6"
        d="M40 10l3.2 8.4 8.6-2.6-2.8 8.6 8.4 3.2-8.4 3.2 2.8 8.6-8.6-2.6L40 70l-3.2-8.4-8.6 2.6 2.8-8.6L22.6 52.4l8.4-3.2-2.8-8.6 8.6 2.6L40 10z"
      />
      <circle cx="40" cy="40" r="16" fill="#B91C1C" />
      <circle cx="34.5" cy="38" r="3.2" fill="#F3EFE6" />
      <circle cx="45.5" cy="38" r="3.2" fill="#F3EFE6" />
      <path d="M35 46.5c3 2.6 7 2.6 10 0" fill="none" stroke="#F3EFE6" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
