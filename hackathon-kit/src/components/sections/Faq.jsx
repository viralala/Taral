import { site } from '../../config/site'
import { Accordion, Section } from '../ui'

export function Faq({ title = 'Questions, answered', items = site.faq }) {
  return (
    <Section id="faq">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <h2 className="display-lg max-w-[9ch]">{title}</h2>
        <Accordion items={items} />
      </div>
    </Section>
  )
}
