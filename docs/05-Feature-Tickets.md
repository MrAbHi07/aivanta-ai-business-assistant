# 05 — Feature Ticket List (FTL)

**Product:** Aivanta AI Business Assistant v0.1
**Version:** 1.0
**Date:** 2026-08-16
**Status:** Current — v0.1 tickets are Done unless stated

Legend — **Priority:** P0 blocker · P1 high · P2 medium · P3 nice-to-have.
**Status:** Done · In progress · Deferred · Planned.
Every ticket traces to a PRD requirement (`FR-xx` / `NFR-xx`) or an explicit deferral.

---

## Epic A — Foundation & design system

### AIV-001 — Brand design token system
- **Priority:** P0 · **Status:** Done · **Traces:** NFR-06, FSD §2
- **Scope:** OKLCH dark navy theme in `src/styles.css`; primary cyan-teal, amber signal, success/warning/destructive, surface scale, brand gradients and shadows, custom utilities (`glass-panel`, `grid-fade`, `text-gradient-brand`, `bg-hero-glow`).
- **Dependencies:** none
- **Acceptance:** Every component styles from tokens; no hardcoded colour utility anywhere; dark base renders consistently across all three routes.
- **Notes:** Tailwind v4 `@theme`; no `tailwind.config.js`.

### AIV-002 — Typography and root shell
- **Priority:** P0 · **Status:** Done · **Traces:** NFR-06, FSD §2, TAD §3
- **Scope:** Sora + IBM Plex Sans via `<link>` in `__root.tsx`; `QueryClientProvider`; `<Toaster />` mounted once; 404 and error components.
- **Dependencies:** AIV-001
- **Acceptance:** Fonts load without a CSS `@import`; toasts render; a thrown route error shows the reset UI.

### AIV-003 — Site chrome (header, footer, logo, demo badge)
- **Priority:** P0 · **Status:** Done · **Traces:** FR-01, NFR-03, NFR-04
- **Scope:** `site-chrome.tsx` — gradient logo mark, sticky blurred header, desktop nav with active state, mobile disclosure menu, footer, `DemoBadge`.
- **Dependencies:** AIV-001, AIV-002
- **Acceptance:** Nav highlights the current route; mobile menu toggles with correct `aria-expanded`; header CTA hidden below `sm`.

---

## Epic B — Knowledge base & conversation engine

### AIV-010 — Mock knowledge base
- **Priority:** P0 · **Status:** Done · **Traces:** FR-04, FR-05, FR-14
- **Scope:** `demo-data.ts` — `INSTITUTE`, four `COURSES` (JEE, NEET, Foundation, CA) with aliases/duration/fees/EMI/batches/mode/highlight, `SCHOLARSHIP`, `LOCATION_INFO`, five `SAMPLE_LEADS`.
- **Dependencies:** none
- **Acceptance:** Typed constants; every course reachable by at least three natural aliases.
- **Notes:** Clearly marked demo/mock at the top of the file; replacement point for a real CMS/DB.

### AIV-011 — Deterministic response engine
- **Priority:** P0 · **Status:** Done · **Traces:** FR-04, FR-05, FR-06, NFR-01, NFR-07
- **Scope:** `chat-engine.ts` — intent matching for courses, fees/EMI, batches, scholarships, location, hours, trial classes, hostel/transport, refunds, greetings, thanks; contextual quick replies; graceful fallback; async `generateReply` with simulated latency.
- **Dependencies:** AIV-010
- **Acceptance:** Every FR-04 topic returns a specific answer; unknown input returns the fallback with a callback offer; the function never throws.
- **Notes:** Single async entry point so an LLM swap is a one-module change (TAD §12 U1).

### AIV-012 — Lead capture state machine
- **Priority:** P0 · **Status:** Done · **Traces:** FR-07, FR-08
- **Scope:** `idle → ask_name → ask_phone → ask_course → ask_timeline → done`; name sanitisation; phone requires ≥ 10 digits and normalises to `+91 XXXXX XXXXX`; invalid phone re-prompts without advancing.
- **Dependencies:** AIV-011
- **Acceptance:** A four-answer flow always produces a `Lead`; `"abc"` as a phone re-prompts; capture takes priority over FAQ intents.

### AIV-013 — Lead scoring and qualification
- **Priority:** P1 · **Status:** Done · **Traces:** FR-09
- **Scope:** Base 30 + timeline (45/28/18/4) + 14 for a specific course + 10 for handoff, clamped 5–99; Hot ≥ 80, Warm ≥ 55, else Cold.
- **Dependencies:** AIV-012
- **Acceptance:** "This month" + named course + handoff scores Hot; "Just exploring" with no course scores Cold.

### AIV-014 — Human handoff intent
- **Priority:** P1 · **Status:** Done · **Traces:** FR-10
- **Scope:** Detect counsellor/human/callback phrasing, set `handoff`, enter capture, name the counsellor and promise a 30-minute callback for Hot leads.
- **Dependencies:** AIV-012, AIV-013
- **Acceptance:** "Can I talk to a human counsellor?" starts capture and the resulting lead has `handoff: true`.

---

## Epic C — Chat interface

### AIV-020 — AssistantChat component
- **Priority:** P0 · **Status:** Done · **Traces:** FR-03, FR-06, FR-15, FR-16, NFR-02, NFR-04
- **Scope:** Message list with role bubbles, quick-reply chips, input + send, typing indicator, reset control, auto-scroll, `compact` variant, sonner toast on capture, `onLead` callback.
- **Dependencies:** AIV-011, AIV-001
- **Acceptance:** Empty input ignored; controls disabled while thinking; reset restores the welcome state; compact mode fits the landing section.

### AIV-021 — Assistant rich-text renderer
- **Priority:** P2 · **Status:** Done · **Traces:** FR-04, SAD T2
- **Scope:** `rich-text.tsx` renders `**bold**` and newlines as React nodes.
- **Dependencies:** AIV-020
- **Acceptance:** No `dangerouslySetInnerHTML`; bold and bullet lines display correctly.

---

## Epic D — Lead persistence & dashboard

### AIV-030 — Local leads store
- **Priority:** P0 · **Status:** Done · **Traces:** FR-12, NFR-05
- **Scope:** `leads-store.ts` — `localStorage` key `aivanta.demo.leads.v1`, `addLead`, `clearCapturedLeads`, `useLeads` hook merging captures ahead of samples, `aivanta-leads-changed` + `storage` event sync, SSR guards, defensive `try/catch` parse.
- **Dependencies:** AIV-010
- **Acceptance:** A lead captured on `/demo` appears first on `/leads`; no hydration mismatch; corrupt storage degrades to an empty capture list.

### AIV-031 — Leads dashboard
- **Priority:** P0 · **Status:** Done · **Traces:** FR-13, FR-14, FR-18
- **Scope:** Stat tiles (total, hot, average score, handoffs), All/Hot/Warm/Cold filter, lead list with quality badges and handoff indicator, clear-captured action, demo labelling.
- **Dependencies:** AIV-030
- **Acceptance:** Filters update instantly; clearing removes captures only; five seeded samples always present.

---

## Epic E — Pages & conversion

### AIV-040 — Landing page
- **Priority:** P0 · **Status:** Done · **Traces:** FR-01, FR-02
- **Scope:** Hero, problem, solution, embedded compact assistant, six-feature grid, five-step workflow, use cases, CTA band, footer.
- **Dependencies:** AIV-003, AIV-020
- **Acceptance:** All sections render responsively; both CTAs route correctly; inline chat is fully interactive.

### AIV-041 — Demo page
- **Priority:** P0 · **Status:** Done · **Traces:** FR-03, FR-11, FR-18
- **Scope:** Demo badge and institute line, H1/intro, full chat, "Try asking" scripts, live lead-capture panel with dashboard link, knowledge-base summary with the deterministic-engine note.
- **Dependencies:** AIV-020, AIV-030
- **Acceptance:** Lead panel switches from empty state to populated within the same turn a lead is created.

### AIV-042 — SEO head metadata
- **Priority:** P1 · **Status:** Done · **Traces:** FR-17
- **Scope:** Unique title, description, `og:title`, `og:description` on `/`, `/demo`, `/leads`.
- **Dependencies:** AIV-040, AIV-041, AIV-031
- **Acceptance:** Each route has a distinct title under 60 characters and a description under 160; no placeholder titles.
- **Notes:** `og:image`/`twitter:image` intentionally omitted — no absolute hosted hero image exists yet.

---

## Epic F — Documentation & governance

### AIV-050 — Five source-of-truth documents
- **Priority:** P0 · **Status:** Done · **Traces:** Aivanta Project Delivery Standard
- **Scope:** `docs/01-PRD.md`, `02-TAD.md`, `03-Security-Access.md`, `04-Frontend-Specification.md`, `05-Feature-Tickets.md`, plus `docs/README.md` index.
- **Dependencies:** all v0.1 epics
- **Acceptance:** All five exist, are versioned/dated/statused, describe the current implementation, and cross-reference consistently.

### AIV-051 — Documentation/implementation consistency review
- **Priority:** P0 · **Status:** Done · **Traces:** AIV-050
- **Scope:** Read every route, component and lib module and reconcile the documents with the code.
- **Acceptance:** No document claims a capability the code lacks; discrepancies recorded in `docs/README.md`.

---

## Deferred / planned (not implemented in v0.1)

| ID | Ticket | Priority | Status | Traces | Notes |
|----|--------|----------|--------|--------|-------|
| AIV-100 | Real LLM integration behind `generateReply` via a server function | P1 | Deferred | PRD §12, TAD U1, OD-1 | Provider key as a project secret, read inside the handler only |
| AIV-101 | Server-side lead persistence (Lovable Cloud) | P1 | Deferred | TAD U2, OD-2 | Requires RLS + explicit GRANTs |
| AIV-102 | Authentication and route gating for `/leads` | P0 *(when real data exists)* | Deferred | PRD §12, SAD §3, SAD §10 | Blocker before any real lead is captured |
| AIV-103 | Role-based access (`user_roles` + `has_role()`) | P1 | Deferred | SAD §3 | Never store roles on a profile table |
| AIV-104 | Payments / subscription billing | P3 | Deferred | PRD §12 | No pricing logic in v0.1 |
| AIV-105 | WhatsApp / Instagram channel webhooks | P2 | Planned | OD-4 | `src/routes/api/public/*` with signature verification |
| AIV-106 | CRM export / email + SMS notifications | P2 | Planned | OD-4 | — |
| AIV-107 | Client-editable knowledge base | P2 | Planned | OD-3 | Replaces `demo-data.ts` constants |
| AIV-108 | Multi-tenant per-client demo configuration | P3 | Planned | OD-5 | — |
| AIV-109 | Analytics and conversion instrumentation | P3 | Planned | — | Requires a privacy notice |
| AIV-110 | Automated test suite (engine unit tests + E2E journey) | P2 | Planned | NFR-08 | No tests exist in v0.1 |
| AIV-111 | Social preview image + `og:image`/`twitter:image` | P3 | Planned | FR-17 | Blocked on a hosted absolute image URL |
