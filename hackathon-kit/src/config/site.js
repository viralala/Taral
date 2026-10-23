// ============================================================
// SITE CONFIG — edit this file first when the problem
// statement drops. Every section on the landing page, the
// navbar, the footer and the form wizard read from here.
// ============================================================

export const site = {
  brand: {
    name: 'kiln',
    tagline: 'Turn a raw idea into a working product in one afternoon.',
    // 'auto' uses the built-in logo mark + name. Replace with a path like '/logo.svg' to use an image.
    logo: 'auto',
  },

  nav: [
    { label: 'Product', href: '/#features' },
    { label: 'How it works', href: '/#how' },
    { label: 'Updates', href: '/#news' },
    { label: 'FAQ', href: '/#faq' },
  ],

  // Shown as icon buttons. Supported: discord, x, telegram, github, linkedin, instagram, youtube
  socials: [
    { type: 'discord', href: '#' },
    { type: 'x', href: '#' },
    { type: 'github', href: '#' },
  ],

  cta: { label: 'Get started', href: '/signup' },

  hero: {
    title: 'The Internet Of Ideas',
    subtitle: 'A single place where people, data and decisions connect — built for the problem you are solving today.',
    primary: { label: 'Start now', href: '/signup' },
    secondary: { label: 'Book a demo', href: '/apply' },
  },

  bigHeadline: {
    lines: ['More is more.', 'Go further.'],
  },

  features: {
    // Card 1 — paper card with a dot-icon tile and bullet points
    primary: {
      icon: 'one',
      title: 'Build',
      bullets: [
        'Spin up the core workflow in minutes, not weeks.',
        'Plug in any data source with a single fetch helper.',
        'Ship a polished interface that already feels finished.',
      ],
    },
    // Card 2 — violet card with selectable option groups
    picker: [
      { title: 'Choose a mode', options: ['Personal', 'Team', 'Enterprise'] },
      { title: 'Choose a region', options: ['Asia', 'Europe', 'Americas'] },
    ],
    // Row 2 — split cards
    split: [
      {
        icon: 'plus',
        title: 'The engine, for massive impact',
        body: 'Every user gets their own space to work without compromises, and everything stays in sync.',
        link: { label: 'Learn more', href: '#how' },
        tone: 'surface',
      },
      {
        icon: 'spark',
        title: 'Real-time by default',
        body: 'Live updates, instant feedback and a UI that responds before you finish clicking.',
        link: { label: 'See it live', href: '/apply' },
        tone: 'primary',
      },
    ],
  },

  stats: [
    { value: 120, suffix: '+', label: 'Teams onboarded' },
    { value: 98, suffix: '%', label: 'Uptime this year' },
    { value: 4.9, suffix: '/5', label: 'Average rating', decimals: 1 },
    { value: 2, suffix: 'min', label: 'Time to first result' },
  ],

  steps: [
    { icon: 'one', title: 'Sign up', body: 'Create an account in seconds — no card, no setup call.' },
    { icon: 'two', title: 'Tell us your goal', body: 'A short guided form captures exactly what you need.' },
    { icon: 'three', title: 'Get results', body: 'We match, compute or route it — and show you the outcome.' },
  ],

  news: {
    title: 'Explore our news',
    subtitle: 'Articles, case studies and updates about what we are building and why.',
  },

  faq: [
    { q: 'Who is this for?', a: 'Anyone facing the problem we solve — students, teams and organisations of any size.' },
    { q: 'How much does it cost?', a: 'It is free while in beta. Paid plans will add collaboration and analytics.' },
    { q: 'Is my data safe?', a: 'Data is encrypted in transit and at rest, and you can export or delete it at any time.' },
    { q: 'Can I integrate it with my tools?', a: 'Yes — there is a simple REST API and webhooks for the most common events.' },
  ],

  ctaBand: {
    title: 'Ready when you are.',
    body: 'Join the people already using it to move faster.',
    primary: { label: 'Create account', href: '/signup' },
    secondary: { label: 'Talk to us', href: '/apply' },
  },

  footer: {
    pitch: 'Fastest way from problem statement to working product',
    cta: { label: 'Book a call', href: '/apply' },
    links: [
      { label: 'Product', href: '/#features' },
      { label: 'How it works', href: '/#how' },
      { label: 'Updates', href: '/#news' },
      { label: 'Sign in', href: '/login' },
      { label: 'Apply', href: '/apply' },
      { label: 'UI kit', href: '/ui' },
    ],
  },

  // Multi-step form at /apply — rename fields to fit the problem statement.
  wizard: {
    title: 'Tell us what you need',
    subtitle: 'Three quick steps. Takes about a minute.',
    categories: [
      { value: 'individual', label: 'Individual', hint: 'Just me' },
      { value: 'team', label: 'Team', hint: '2–50 people' },
      { value: 'org', label: 'Organisation', hint: '50+ people' },
    ],
    priorities: ['Low', 'Medium', 'High', 'Urgent'],
  },
}
