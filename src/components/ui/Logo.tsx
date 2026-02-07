type LogoProps = {
  className?: string;
};

export default function Logo({ className = "w-8 h-8" }: LogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 40"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Tail - spiky zigzag */}
      <path d="M2 22 L6 18 L5 23 L9 19 L8 24 L12 21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Back leg */}
      <path d="M14 30 L10 36 L15 34 L13 38 L18 32" fill="currentColor" />

      {/* Shell body - big solid dome */}
      <path d="M12 28 C12 12 22 6 32 6 C42 6 50 12 50 28 Z" />

      {/* Shell spikes/ridges on top - prominent */}
      <path d="M20 14 L22 5 L25 14" fill="currentColor" />
      <path d="M27 11 L30 2 L33 11" fill="currentColor" />
      <path d="M35 12 L38 4 L41 13" fill="currentColor" />
      <path d="M42 16 L44 8 L46 17" fill="currentColor" />

      {/* Shell pattern */}
      <path d="M20 18 L32 14 L44 18 L44 26 L32 28 L20 26 Z" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />

      {/* Front leg */}
      <path d="M44 30 L48 36 L45 34 L47 38 L50 32" fill="currentColor" />

      {/* Neck - thick */}
      <path d="M48 20 C52 18 54 16 56 16 L58 16 L58 26 C56 26 54 26 50 24" fill="currentColor" />

      {/* Head - big and round */}
      <ellipse cx="58" cy="18" rx="6" ry="6" />

      {/* Upper jaw - aggressive pointed beak */}
      <path d="M62 15 L64 11 L63 16 Z" fill="currentColor" />

      {/* Lower jaw - open wide */}
      <path d="M62 21 L64 24 L63 20 Z" fill="currentColor" />

      {/* Eye */}
      <circle cx="58" cy="16" r="1.8" fill="white" />
      <circle cx="58.5" cy="16" r="0.9" fill="#052e16" />
    </svg>
  );
}
