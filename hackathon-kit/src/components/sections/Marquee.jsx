import { LogoMark } from '../ui'

const DEFAULT = ['Northwind', 'Acme Labs', 'Globex', 'Initech', 'Umbrella', 'Hooli', 'Stark', 'Wayne Co.']

/** Infinite scrolling strip of partner names (swap for logos). */
export function Marquee({ label = 'Trusted by teams at', items = DEFAULT }) {
  const row = [...items, ...items]
  return (
    <div className="py-6">
      <p className="mb-4 text-center text-[13px] font-medium uppercase tracking-[0.14em] text-muted">{label}</p>
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max animate-[marquee_38s_linear_infinite] gap-14 motion-reduce:animate-none">
          {row.map((name, i) => (
            <span key={i} className="flex items-center gap-2 whitespace-nowrap text-2xl font-semibold tracking-tight text-ink/45">
              <LogoMark className="text-xl" />
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
