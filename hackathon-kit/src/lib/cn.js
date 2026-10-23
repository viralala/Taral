// Tiny className joiner: cn('a', cond && 'b', { c: true }) -> 'a b c'
export function cn(...args) {
  const out = []
  for (const a of args) {
    if (!a) continue
    if (typeof a === 'string') out.push(a)
    else if (typeof a === 'object') for (const k in a) if (a[k]) out.push(k)
  }
  return out.join(' ')
}
