import { cn } from '../../lib/cn'

// 7x7 dot-matrix glyphs, like the pixel icons in the inspiration tiles.
// '#' = big dot, '.' = small dot, ' ' = empty. Add your own freely.
const GLYPHS = {
  one: ['  ##   ', '   #   ', '   #   ', '   #   ', '   #   ', '   #   ', ' ##### '],
  two: [' ##### ', '     # ', '     # ', ' ##### ', ' #     ', ' #     ', ' ##### '],
  three: [' ##### ', '     # ', '     # ', '  #### ', '     # ', '     # ', ' ##### '],
  plus: ['   #   ', '   .   ', '   #   ', '#.###.#', '   #   ', '   .   ', '   #   '],
  spark: ['   #   ', '  .#.  ', ' . # . ', '###.###', ' . # . ', '  .#.  ', '   #   '],
  arrow: ['       ', '    #  ', '     # ', '#######', '     # ', '    #  ', '       '],
  check: ['       ', '      #', '     # ', '#   #  ', ' # #   ', '  #    ', '       '],
  grid: ['# # # #', '       ', '# # # #', '       ', '# # # #', '       ', '# # # #'],
  bolt: ['    ## ', '   ##  ', '  ##   ', ' ##### ', '   ##  ', '  ##   ', ' ##    '],
  heart: ['       ', ' ## ## ', '#######', '#######', ' ##### ', '  ###  ', '   #   '],
  user: ['  ###  ', ' #   # ', ' #   # ', '  ###  ', '       ', ' ##### ', '#     #'],
  star: ['   #   ', '   #   ', '#######', ' ##### ', '  ###  ', ' ## ## ', '#     #'],
}

export const DOT_GLYPHS = Object.keys(GLYPHS)

/** Dot-matrix glyph. <DotGlyph name="plus" className="h-8 w-8" /> */
export function DotGlyph({ name = 'plus', className }) {
  const rows = GLYPHS[name] || GLYPHS.plus
  return (
    <svg viewBox="0 0 70 70" className={className} aria-hidden="true">
      {rows.flatMap((row, y) =>
        [...row].map((c, x) =>
          c === ' ' ? null : <circle key={`${x}-${y}`} cx={x * 10 + 5} cy={y * 10 + 5} r={c === '#' ? 3.6 : 1.8} fill="currentColor" />,
        ),
      )}
    </svg>
  )
}

/** The black rounded tile holding a glyph (top-left of feature cards). */
export function DotIcon({ name, tone = 'ink', size = 'md', className }) {
  const t = { ink: 'bg-ink text-on-ink', primary: 'bg-primary text-on-primary', light: 'bg-surface text-ink', accent: 'bg-accent text-on-accent' }[tone]
  const s = { sm: 'h-11 w-11 p-2.5 rounded-[10px]', md: 'h-16 w-16 p-3.5 rounded-[14px]', lg: 'h-20 w-20 p-4 rounded-[18px]' }[size]
  return (
    <div className={cn('grid shrink-0 place-items-center', t, s, className)}>
      <DotGlyph name={name} className="h-full w-full" />
    </div>
  )
}
