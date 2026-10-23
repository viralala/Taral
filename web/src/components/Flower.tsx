// Reusable SVG flowers matching the reference: a fat 5-petal blob and a thin asterisk.
type P = { className?: string; color?: string; style?: React.CSSProperties };

export function BlobFlower({ className, color = "var(--blush)", style }: P) {
  const petals = Array.from({ length: 5 }, (_, i) => i * 72);
  return (
    <svg viewBox="-100 -100 200 200" className={className} style={style} aria-hidden>
      {petals.map((r) => (
        <ellipse key={r} cx="0" cy="-48" rx="34" ry="52" fill={color} stroke="var(--cocoa)" strokeWidth="3" transform={`rotate(${r})`} />
      ))}
      <circle r="26" fill={color} />
    </svg>
  );
}

export function StarFlower({ className, color = "var(--blush)", style }: P) {
  const petals = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg viewBox="-100 -100 200 200" className={className} style={style} aria-hidden>
      {petals.map((r) => (
        <ellipse key={r} cx="0" cy="-50" rx="11" ry="42" fill={color} stroke="var(--blush-deep)" strokeWidth="3" transform={`rotate(${r})`} />
      ))}
      <circle r="12" fill="var(--blush-deep)" />
    </svg>
  );
}
