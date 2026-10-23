// Small painted cherry blossom (own art, independent of the story scenes).
type P = { className?: string; color?: string; style?: React.CSSProperties };

export default function Blossom({ className, color = "var(--blossom)", style }: P) {
  const petals = Array.from({ length: 5 }, (_, i) => i * 72);
  return (
    <svg viewBox="-100 -100 200 200" className={className} style={style} aria-hidden>
      {petals.map((r) => (
        <path key={r} d="M0 -14 C -34 -40 -30 -86 -8 -92 L0 -80 L8 -92 C 30 -86 34 -40 0 -14Z" fill={color} stroke="var(--navy)" strokeWidth="4" strokeLinejoin="round" transform={`rotate(${r})`} />
      ))}
      <circle r="16" fill="var(--lime)" stroke="var(--navy)" strokeWidth="4" />
    </svg>
  );
}
