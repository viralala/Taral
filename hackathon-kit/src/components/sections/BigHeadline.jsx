import { site } from '../../config/site'
import { useInView } from '../../lib/useReveal'
import { cn } from '../../lib/cn'
import { Container } from '../ui'

/** Giant headline over the dot field, words rise in one by one. */
export function BigHeadline({ lines = site.bigHeadline.lines, dots = true, className }) {
  const [ref, inView] = useInView({ threshold: 0.3 })
  let n = 0
  return (
    <section className={cn('pb-10 pt-16 md:pb-14 md:pt-24', dots && 'dot-grid', className)}>
      <Container>
        <h2 ref={ref} className="display-xl">
          {lines.map((line, i) => (
            <span key={i} className="block">
              {line.split(' ').map((word, j) => {
                const delay = n++ * 70
                return (
                  <span key={j} className="inline-block overflow-hidden pb-[0.06em] align-bottom">
                    <span
                      className="inline-block transition-transform duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)]"
                      style={{ transform: inView ? 'none' : 'translateY(105%)', transitionDelay: `${delay}ms` }}
                    >
                      {word}&nbsp;
                    </span>
                  </span>
                )
              })}
            </span>
          ))}
        </h2>
      </Container>
    </section>
  )
}
