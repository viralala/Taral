# Hackathon kit

A ready-made React + Vite + Tailwind v4 frontend in the Caldera style (see `DESIGN.md`).
It includes a landing page, sign-in, sign-up, a multi-step form, an account page, a 404 page and a UI-kit reference page.
Everything runs on a mock API until you point it at a real backend.

```bash
npm install
npm run dev        # http://localhost:5173
```

Demo login: `demo@kiln.test` / `demo1234`

## Routes

| Path | What |
|---|---|
| `/` | Landing page: halftone hero, marquee, big headline, feature bento, stats, steps, news (from the API), FAQ, CTA, footer |
| `/login`, `/signup` | Auth with validation and a password-strength meter |
| `/apply` | 3-step form with validation, file upload and review, posting to `/submissions` |
| `/account` | Protected page that lists the user's submissions |
| `/ui` | Every component, plus palette and dark-mode switchers |
| anything else | 404 |

## When the problem statement drops (first 15 minutes)

1. **Copy:** edit `src/config/site.js` (brand name, nav, hero, features, stats, steps, FAQ, footer, form options).
2. **Colours:** pick a palette at `/ui`, or edit the hex values in `src/styles/theme.css`. For a permanent palette, set `data-palette="..."` on `<html>` in `index.html`.
3. **Sections:** reorder or delete them in `src/pages/Home.jsx`.
4. **Form:** rename fields and steps in `src/pages/Apply.jsx` (the `STEPS` array plus the JSX for each step).
5. **Data:** add routes to `src/mock/server.js` and seed data in `src/mock/seed.json`.
6. **Title:** set `<title>` in `index.html` and swap `public/favicon.svg`.

## Data layer

```js
import { api } from './lib/api'
import { useFetch } from './lib/useFetch'

const { data, loading, error, reload } = useFetch('/items')
await api.post('/items', { title: 'New' })
```

- With no `VITE_API_URL`, requests go to `src/mock/server.js`. It has a 350ms fake delay, and data persists in localStorage. Call `resetMockDb()` to reset it.
- To use a real backend, create `.env.local` with `VITE_API_URL=http://localhost:5000` and restart. The same calls then use `fetch` and send `Authorization: Bearer <token>`.
- Auth: `const { user, login, signup, logout } = useAuth()`. Protect a route with `<RequireAuth>`.
- Forms: `useForm(initial, validate)` plus `rules.required` / `email` / `min(n)` / `phone`. See `Login.jsx` for the pattern.

## Adding a page

```jsx
// src/pages/Dashboard.jsx
import { Card, Container } from '../components/ui'
export default function Dashboard() {
  return <Container className="py-10"><Card className="p-8"><h1 className="display-lg">Dashboard</h1></Card></Container>
}
```

Then add `<Route path="dashboard" element={<Dashboard />} />` in `src/App.jsx`.

## Structure

```
src/
  config/site.js        ← all copy
  styles/theme.css      ← all colours, fonts, radii
  components/ui/        ← Button, Card, Halftone, DotIcon, form controls, Toast, Modal…
  components/sections/  ← landing sections
  components/layout/    ← Navbar, Footer, SiteLayout
  pages/                ← routes
  lib/                  ← api, auth, useFetch, useForm, theme
  mock/                 ← fake backend + seed data
```

## Deploy

`npm run build` writes to `dist/`. On Vercel or Netlify, add an SPA rewrite to `/index.html` so deep links like `/apply` work. Vercel: `vercel.json` is included.
