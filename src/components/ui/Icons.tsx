type IconProps = {
  className?: string;
};

export function BrainIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      {/* Neural network: 3 layers of nodes connected by lines */}
      {/* Layer 1 (left) */}
      <circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none" />
      {/* Layer 2 (middle) */}
      <circle cx="12" cy="8" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none" />
      {/* Layer 3 (right) */}
      <circle cx="20" cy="6" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="20" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="20" cy="18" r="1.5" fill="currentColor" stroke="none" />
      {/* Connections L1 → L2 */}
      <line x1="5.5" y1="6" x2="10.5" y2="8" strokeLinecap="round" />
      <line x1="5.5" y1="6" x2="10.5" y2="16" strokeLinecap="round" />
      <line x1="5.5" y1="12" x2="10.5" y2="8" strokeLinecap="round" />
      <line x1="5.5" y1="12" x2="10.5" y2="16" strokeLinecap="round" />
      <line x1="5.5" y1="18" x2="10.5" y2="8" strokeLinecap="round" />
      <line x1="5.5" y1="18" x2="10.5" y2="16" strokeLinecap="round" />
      {/* Connections L2 → L3 */}
      <line x1="13.5" y1="8" x2="18.5" y2="6" strokeLinecap="round" />
      <line x1="13.5" y1="8" x2="18.5" y2="12" strokeLinecap="round" />
      <line x1="13.5" y1="8" x2="18.5" y2="18" strokeLinecap="round" />
      <line x1="13.5" y1="16" x2="18.5" y2="6" strokeLinecap="round" />
      <line x1="13.5" y1="16" x2="18.5" y2="12" strokeLinecap="round" />
      <line x1="13.5" y1="16" x2="18.5" y2="18" strokeLinecap="round" />
    </svg>
  );
}

export function ChartIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  );
}

export function ZapIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
    </svg>
  );
}

export function CloudIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
    </svg>
  );
}

export function CodeIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
    </svg>
  );
}

export const SERVICE_ICONS: Record<string, React.ReactNode> = {
  ai: <BrainIcon />,
  dynamics: <ChartIcon />,
  powerplatform: <ZapIcon />,
  azure: <CloudIcon />,
  customcrm: <CodeIcon />,
};
