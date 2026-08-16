# 04 — Frontend Specification Document (FSD)

**Product:** Aivanta AI Business Assistant v0.1
**Version:** 1.0
**Date:** 2026-08-16
**Status:** Current — specifies the shipped UI

---

## 1. Information architecture

```text
AIVANTA
├── /        Landing            — brand story + inline assistant preview
├── /demo    Live Demo          — full assistant + capture panel + KB summary
└── /leads   Leads Dashboard    — stats, filter, lead list, reset
```

Global chrome (`SiteHeader`, `SiteFooter`) is rendered per page from
`src/components/site-chrome.tsx`. Navigation items: Home, Live Demo, Leads Dashboard, plus a
persistent "Try the assistant" brand CTA.

## 2. Design tokens

Defined in `src/styles.css` under Tailwind v4 `@theme`. **Components must use semantic token
classes only** (`bg-primary`, `text-muted-foreground`, `border-border`) — never `text-white`,
`bg-black` or arbitrary hex.

| Token | Role | Value family |
|-------|------|--------------|
| `--background` / `--foreground` | Deep navy canvas / near-white text | `oklch(0.17 0.028 250)` / `oklch(0.97 0.006 240)` |
| `--primary` / `--ring` | Cyan-teal brand accent | `oklch(0.78 0.13 192)` |
| `--signal` | Amber secondary accent (warm leads, highlights) | `oklch(0.82 0.15 78)` |
| `--success` | Positive states (KB checkmarks) | `oklch(0.75 0.15 160)` |
| `--warning` | Caution | `oklch(0.82 0.15 78)` |
| `--destructive` | Hot leads, destructive actions | `oklch(0.64 0.2 22)` |
| `--surface`, `--surface-2` | Panel backgrounds | elevated navy |
| `--secondary`, `--muted`, `--accent` | Chips, subdued text, hover fills | navy scale |
| `--border` / `--input` | Hairlines and field borders | `oklch(0.32 0.03 250)` |
| `--chart-1..5`, `--sidebar-*` | Reserved scales | — |
| `--gradient-hero` | Two radial brand glows | primary + signal |
| `--gradient-brand` | 100° primary → signal linear | brand marks, CTAs |
| `--shadow-elegant`, `--shadow-card` | Brand-tinted elevation | — |
| `--radius` scale | `sm`→`4xl` derived from `--radius` | — |

**Custom utilities:** `bg-hero-glow`, `text-gradient-brand`, `bg-gradient-brand`, `shadow-elegant`,
`shadow-card`, `glass-panel` (translucent surface + hairline + 14 px blur), `grid-fade`
(masked grid backdrop).

**Typography:** display **Sora** (600–800) for `h1–h4` with `-0.02em` tracking; body
**IBM Plex Sans** (400–600). Loaded through a `<link>` in `src/routes/__root.tsx` head.
Uppercase micro-labels use `text-xs`/`text-[10px]` with wide tracking.

## 3. Layout system

- Content container: `mx-auto max-w-6xl px-5`.
- Vertical rhythm: section padding `py-12` (mobile) → `py-20/24` (desktop).
- Panels: `glass-panel rounded-2xl p-5`.
- Demo page grid: `grid gap-8 lg:grid-cols-[1.15fr_0.85fr]` (chat left, side panels right; stacks
  below `lg`).
- Header height `h-18`, sticky, `backdrop-blur-xl`, hairline bottom border.

## 4. Routes and screens

### 4.1 `/` — Landing (`src/routes/index.tsx`)

| Section | Content |
|---------|---------|
| Hero | Eyebrow badge, H1 with `text-gradient-brand` accent, positioning subcopy, primary CTA → `/demo`, secondary CTA → `/leads`, trust stats, `bg-hero-glow` + `grid-fade` backdrop |
| Problem | Three cards: Missed enquiries, Slow first response, Leaky follow-up |
| Solution | Three pillars: Always-on AI front desk, Structured lead capture, Automatic qualification |
| Live preview | `<AssistantChat compact />` embedded beside explanatory copy |
| Features | Six-card grid: Course & fee FAQ engine, Human handoff, Lead dashboard, LLM-ready architecture, 24/7 availability, Safe by design |
| How it works | Five numbered steps |
| Use cases | Segment cards (coaching institutes and adjacent SMB verticals) |
| CTA | Closing conversion band → `/demo` |
| Footer | Brand, tagline, nav, demo disclaimer |

**Head:** title `Aivanta — AI Built for Business | AI Admission Assistant`, description, `og:title`, `og:description`.

### 4.2 `/demo` — Live Demo (`src/routes/demo.tsx`)

- Header row: `DemoBadge` + "Sample institute: Sunrise Academy, Indore — fictional data".
- H1 "The **AI Admission Assistant**, live" + intro paragraph.
- Left: `<AssistantChat onLead={setLead} />`.
- Right column, three `glass-panel` sections:
  1. **Try asking** — six suggested prompts with sparkle icons.
  2. **Lead capture** — empty-state hint before capture; after capture a definition list of Lead ID, Name, Phone, Course, Timeline, Score/quality, Human handoff, plus a "View on leads dashboard" button → `/leads`.
  3. **Knowledge base loaded** — the four courses with duration and fees, plus the "deterministic local response engine" note.

**Head:** title `Live AI Admission Assistant Demo | Aivanta` + description + og pair.

### 4.3 `/leads` — Leads Dashboard (`src/routes/leads.tsx`)

- Four stat tiles: Total leads, Hot leads, Average score, Human handoffs (icon, uppercase label, large display value, hint line).
- Filter row: All / Hot / Warm / Cold pills; active pill uses `bg-secondary text-foreground`.
- Lead list: name, phone, course, timeline, source, relative/ISO created time, score, quality badge, handoff indicator.
  - Quality badge colours: Hot `bg-destructive/15 text-destructive border-destructive/30`; Warm `bg-signal/15 text-signal border-signal/30`; Cold `bg-secondary text-muted-foreground border-border`.
- "Clear captured leads" destructive-secondary action, visible when `capturedCount > 0`; seeded samples remain.
- Demo badge and fictional-data note.

**Head:** title `Leads Dashboard | Aivanta AI Business Assistant` + description + og pair.

## 5. Component specification

### 5.1 `AssistantChat` (`src/components/assistant-chat.tsx`)

Props: `{ className?: string; onLead?: (lead: Lead) => void; compact?: boolean }`.

Structure: header strip (bot avatar, institute name, online indicator, reset button) → scrollable
message viewport → quick-reply chip row → input row (text field + send button).

| State | Presentation |
|-------|--------------|
| Welcome | Single assistant bubble + four welcome quick replies |
| User turn | Right-aligned bubble, user icon, primary-tinted surface |
| Assistant turn | Left-aligned bubble, bot icon, `glass-panel` surface, `RichText` formatting |
| Thinking | Animated dot indicator; input and send disabled |
| Quick replies | Chip buttons; clicking sends immediately and clears the chip row |
| Validation retry | Assistant re-asks for a 10-digit number; stage unchanged |
| Lead created | Success summary bubble + sonner toast + `onLead` callback |
| Reset | Returns to welcome message and `initialState` |
| Compact | Reduced height for landing-page embedding; same behaviour |

Behaviour: empty/whitespace input is ignored; Enter submits; the viewport auto-scrolls smoothly on
every message and on thinking-state change.

### 5.2 `RichText`
Renders assistant strings: `**bold**` → `<strong>`, `\n` → line breaks, bullet lines preserved. No
raw HTML.

### 5.3 `site-chrome`
`Logo` (gradient sparkle mark + AIVANTA wordmark + tagline), `SiteHeader` (desktop nav with active
styling, mobile disclosure menu with `aria-expanded`/`aria-label`), `SiteFooter`, `DemoBadge`.

## 6. Responsive behaviour

| Breakpoint | Behaviour |
|-----------|-----------|
| < 640 px | Single column; nav collapses to the menu button; header CTA hidden; stat tiles stack; leads render as stacked cards; chat fills width |
| 640–1023 px | Two-column feature/problem grids; header CTA visible; demo panels stack under the chat |
| ≥ 1024 px | Demo splits `1.15fr / 0.85fr`; three-column feature grids; full nav |
| ≥ 1280 px | Content capped at `max-w-6xl` and centred |

Minimum supported width 360 px; no horizontal overflow at any breakpoint.

## 7. Accessibility

- Semantic landmarks: `<header>`, `<nav aria-label="Main">`, `<main>`, `<footer>`; one `<h1>` per route.
- All icon-only buttons carry `aria-label` (menu toggle, send, reset); decorative icons use `aria-hidden`.
- Mobile menu button exposes `aria-expanded`.
- Chat input is labelled; quick replies are real `<button>` elements and keyboard reachable.
- Focus is visible via the `--ring` token on all interactive elements; tab order follows DOM order.
- Colour is never the sole signal — lead quality shows a text label alongside its colour.
- Contrast: foreground/`muted-foreground` on the navy surfaces meets AA for body text.
- Toasts (sonner) are polite live regions; assistant replies appear in a scrollable region that
  receives focus-independent auto-scroll.
- Motion is limited to short opacity/transform transitions and the typing indicator.

## 8. Content and tone

Confident, concrete, B2B. Numbers over adjectives. Indian context: ₹ fees, EMI instalments,
`+91` numbers, JEE/NEET/CA/Foundation programmes. Every screen carrying data states that it is a
demo with fictional information.

## 9. UX acceptance criteria

- UX-1 The assistant answers a fee question in ≤ 1 s of simulated latency with a typing indicator shown throughout.
- UX-2 A visitor can complete lead capture using only quick-reply chips plus a name and phone number.
- UX-3 The captured lead appears in the `/demo` side panel immediately and on `/leads` on navigation.
- UX-4 Filtering on `/leads` updates the list without a page reload and preserves stat tiles.
- UX-5 Clearing captured leads removes only captures; the five seeded samples remain.
- UX-6 No layout breaks or horizontal scrolling between 360 px and 1920 px.
- UX-7 Every interactive control is reachable and operable by keyboard with a visible focus ring.
- UX-8 No hardcoded colour utilities exist in components; all colour comes from tokens.
- UX-9 Each route sets a unique title, description and og pair.
