# Design system

Inspired by the Caldera site (see `../Inspiration`, main reference `ins vid.mp4`).
The look is loud display type, calm body copy, big rounded colour blocks and one moving
halftone field.

## 1. Principles

1. **Type does the shouting.** Headlines are huge, heavy and condensed. Everything else stays small and quiet.
2. **Blocks, not borders.** Group content in big rounded cards with solid colour fills. Avoid thin outlined boxes and drop shadows.
3. **One moving thing per screen.** The halftone canvas is the signature. Don't add more motion around it.
4. **Dots everywhere.** Halftone hero, dot-grid background, dot-matrix icons, dotted dividers and dotted outline buttons all repeat one motif.
5. **Grey canvas.** The page is warm grey (`--bg`), never white. Cards (`--surface`) are a lighter paper colour.

## 2. Colour tokens (`src/styles/theme.css`)

| Token | Default | Use |
|---|---|---|
| `--bg` | `#dfdfda` warm grey | Page background |
| `--surface` | `#f6f5f1` paper | Cards, inputs |
| `--surface-2` | `#ecebe6` | Nested panels, list rows |
| `--ink` | `#0d0d0c` | Text, dark cards, dark buttons |
| `--muted` | `#5b5a54` | Secondary text |
| `--primary` | `#ff4f00` safety orange | Primary CTA, social circles, accents in numbers |
| `--accent` | `#5546e8` electric violet | Feature cards, halftone partner |
| `--highlight` | `#efed8a` lemon | Badges, news/intro cards |
| `--success` / `--danger` | green / red | Form states, toasts |

Tailwind classes map straight to these: `bg-primary`, `text-ink`, `bg-surface`, `text-muted`, `border-line`, …

**Palettes:** `default`, `ocean`, `forest`, `berry`, `mono`. Set `<html data-palette="ocean">` or use the switcher at `/ui`.
**Dark mode:** `<html data-theme="dark">`, toggled from the moon icon in the navbar.

Ratio guide per screen: about 60% grey and paper, 25% ink, and 15% orange, violet and lemon combined. Use at most two saturated blocks next to each other.

## 3. Typography

| Class | Size | Use |
|---|---|---|
| `.display-xl` | 48 → 152px | One per page: big statement (“More is more.”) |
| `.display-lg` | 42 → 92px | Page titles, section titles |
| `.display-md` | 32 → 52px | Card titles |
| `.display-sm` | 23 → 34px | Small card titles, modal titles |
| body | 15px DM Sans | Paragraphs, 1.6 line height |

- Display font: **Archivo** variable at `font-stretch: 75%`, weight 860, tracking -0.02em, line-height 0.9.
- Body font: **DM Sans**.
- Both are self-hosted through `@fontsource`, so they work offline at the venue.
- Keep headlines to 2–3 words per line and ≤ 3 lines.

## 4. Shape and spacing

- Radii: `rounded-card` 28px for section cards, `rounded-panel` 18px for nested panels, `rounded-tile` 12px for inputs and tiles, `rounded-full` for buttons and badges.
- Cards sit in a grid with a **16px gap** (`gap-4`). Inside a card: `p-7` on mobile, `p-10` on desktop.
- Feature cards put the icon top-left and the text block bottom-left, with empty space between (`justify-between`, `min-h-[420px]`).
- Max content width is 1240px.

## 5. Components (`src/components/ui`, live at `/ui`)

| Component | Notes |
|---|---|
| `Button` | `primary`, `dark`, `outline` (dotted border, fills ink on hover), `light`, `accent`, `ghost`. Sizes `sm` / `md` / `lg`. `to=` for router links, `loading` prop. |
| `Card` | `tone`: `surface`, `ink`, `primary`, `accent`, `highlight`, `muted`. |
| `Badge` | Yellow pill by default. |
| `DotIcon` / `DotGlyph` | 7×7 dot-matrix icons: one, two, three, plus, spark, arrow, check, grid, bolt, heart, user, star. Add more in `DotIcon.jsx`. |
| `Halftone` | `colors={['--primary','--accent']}`, `cell`, `speed`, `interactive`. Reacts to theme changes and pauses offscreen. |
| `OptionTiles` | Dotted selectable tiles (the “Rollup stack” picker). `tone="dark"` inside ink panels. |
| Form | `Field`, `Input`, `PasswordInput`, `Textarea`, `Select`, `Checkbox`, `Switch`, `Segmented`, `FileDrop`. |
| Feedback | `useToast()`, `Modal`, `Stepper`, `Spinner`, `Skeleton`, `Accordion`. |

## 6. Motion

- Hero halftone: the noise field drifts continuously and the pointer pushes dots locally.
- Scroll reveal: `<Reveal delay={100}>` fades and lifts by 18px over 700ms.
- Big headline: words slide up out of a mask, staggered by 70ms.
- Navbar: the full bar becomes a floating pill once you scroll past 120px.
- Buttons scale to 0.97 on press. The outline button fills with ink on hover.
- Everything respects `prefers-reduced-motion`.

## 7. Don'ts

- Don't use pure white backgrounds or 1px grey borders around cards.
- Don't use gradients other than the halftone.
- Don't use more than one `display-xl` per page.
- Don't centre-align long paragraphs.
