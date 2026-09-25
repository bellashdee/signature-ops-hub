// Small, minimal stroke icons — kept local so the dashboard has no icon-library dependency.
type IconProps = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export function IconCoins({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <ellipse cx="9" cy="7" rx="6" ry="3.2" />
      <path d="M3 7v4.5c0 1.77 2.69 3.2 6 3.2s6-1.43 6-3.2V7" />
      <path d="M3 11.5V16c0 1.77 2.69 3.2 6 3.2 1.1 0 2.13-.16 3-.44" />
      <ellipse cx="16.5" cy="13.3" rx="4.5" ry="2.4" />
      <path d="M12 13.3v3c0 1.33 2.02 2.4 4.5 2.4s4.5-1.07 4.5-2.4v-3" />
    </svg>
  );
}

export function IconReceipt({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6 3h12v18l-2.5-1.6L13 21l-1-1.6-1 1.6-2.5-1.6L6 21V3Z" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </svg>
  );
}

export function IconGauge({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 15a8 8 0 1 1 16 0" />
      <path d="M12 15l3.5-4.2" />
      <path d="M12 15h.01" />
    </svg>
  );
}

export function IconAlert({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M10.6 3.6 2.9 17a1.8 1.8 0 0 0 1.55 2.7h15.1A1.8 1.8 0 0 0 21.1 17L13.4 3.6a1.8 1.8 0 0 0-2.8 0Z" />
      <path d="M12 9.5v4" />
      <path d="M12 16.7h.01" />
    </svg>
  );
}

export function IconStorefront({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 9.5 5 4h14l1 5.5" />
      <path d="M4 9.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" />
      <path d="M5.5 10.2V20h13v-9.8" />
      <path d="M10 20v-5.5h4V20" />
    </svg>
  );
}

export function IconArrowRight({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconEye({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function IconEyeOff({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 3l18 18" />
      <path d="M10.6 5.2A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a13.6 13.6 0 0 1-3.1 3.9M6.8 6.9C4 8.7 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 3.4-.6" />
      <path d="M9.9 10a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}

export function IconUser({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5" />
    </svg>
  );
}
