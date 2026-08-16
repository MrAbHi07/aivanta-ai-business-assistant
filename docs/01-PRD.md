# 01 — Product Requirements Document (PRD)

**Product:** Aivanta AI Business Assistant v0.1 — positioned as *Aivanta Admissions AI*
**Owner:** Abhishek Vishwakarma (Aivanta)
**Version:** 1.0
**Date:** 2026-08-16
**Status:** Approved — describes the shipped v0.1 implementation

---

## 1. Product summary

Aivanta Admissions AI v0.1 is a client-facing, interactive demo web app that shows how an AI
assistant handles inbound admission enquiries for a coaching institute. It combines a premium
marketing landing page, a live chat demo, and a leads dashboard so a prospective client can
experience the full value loop — question → answer → lead capture → qualification → handoff —
in under two minutes.

Brand: **AIVANTA**. Tagline: **"AI Built for Business."**
Positioning: **AI Automation & Solutions for Small Businesses.**

The demo institute is fictional (**Sunrise Academy, Indore**) and is labelled as demo data in the UI.

## 2. Goals

| # | Goal | Success signal |
|---|------|----------------|
| G1 | Convince a paying SMB client that AI can front-desk their admissions | Client completes a chat and reaches a scored lead without guidance |
| G2 | Demonstrate end-to-end value, not just a landing page | Landing → Demo → Leads journey is completable in ≤ 2 min |
| G3 | Zero running cost and zero setup risk for v0.1 | No paid APIs, no accounts, no backend required |
| G4 | Keep the architecture upgrade-ready | A real LLM can replace the mock engine without UI changes |
| G5 | Look like a premium SaaS product | Consistent dark brand system, responsive, accessible |

### Non-goals (v0.1)

- No real LLM/API calls, no API keys, no billing.
- No authentication, user accounts, roles, or payments — **intentionally deferred**.
- No server-side persistence, CRM sync, WhatsApp/Instagram channel integration, or email/SMS sending.
- No multi-tenant configuration or per-client knowledge-base editor.
- No analytics/tracking pipeline.

## 3. Users and personas

| Persona | Description | Needs from v0.1 |
|---------|-------------|-----------------|
| **P1 — Institute owner (buyer)** | Owner/director of a coaching institute, 50–500 students, non-technical | Proof that enquiries get answered instantly and turn into contactable leads |
| **P2 — Admission counsellor (end user of the real product)** | Handles calls and walk-ins | Sees prioritised, pre-qualified leads instead of raw chat logs |
| **P3 — Prospective student/parent (simulated visitor)** | Asks about courses, fees, batches, scholarships | Fast, accurate answers and an easy way to request a callback |
| **P4 — Aivanta operator (us)** | Runs the demo in a sales call | A deterministic, repeatable script that never fails live |

## 4. Scope (implemented in v0.1)

### In scope

1. **Landing page (`/`)** — hero with brand tagline, problem statement, solution pillars, embedded compact assistant preview, feature grid, 5-step workflow, use cases, CTA, footer.
2. **Live demo page (`/demo`)** — full-height assistant chat, suggested prompt scripts, real-time lead-capture panel, loaded knowledge-base summary.
3. **Leads dashboard (`/leads`)** — stat tiles (total, hot, average score, handoffs), Hot/Warm/Cold filter, lead table/cards, clear-captured-leads action, seeded sample leads.
4. **Deterministic chat engine** — FAQ intent matching, guided 4-step lead capture, scoring, human-handoff intent.
5. **Local lead store** — captured leads persist in `localStorage` for the browser session and are merged with seeded samples.
6. **Demo labelling** — a visible "Demo" badge and disclaimers that data is fictional.

### Out of scope

See Non-goals (§2).

## 5. User journeys

**J1 — Buyer evaluation (primary)**
Landing hero → reads problem/solution → tries compact chat inline → clicks "Try the assistant" → `/demo` → asks about fees → books a counselling call → sees the scored lead card → clicks through to `/leads` → sees the lead at the top of the dashboard.

**J2 — FAQ only**
`/demo` → clicks a quick reply ("What courses do you offer?") → receives course list → asks a follow-up about batches → ends without capture.

**J3 — Human handoff**
`/demo` → "Can I talk to a human counsellor?" → assistant sets handoff, asks name → phone → course → timeline → lead created with a handoff flag and +10 score bonus.

**J4 — Counsellor triage**
`/leads` → filters to Hot → reviews score, timeline, source and handoff status → clears captured demo leads to reset for the next demo.

## 6. Functional requirements

| ID | Requirement | Status |
|----|-------------|--------|
| FR-01 | Public landing page communicating brand, tagline, positioning, problem and solution | Done |
| FR-02 | Embedded compact assistant preview on the landing page | Done |
| FR-03 | Dedicated demo route with full assistant chat | Done |
| FR-04 | Assistant answers FAQs on courses, fees, EMI, batch timings, mode, scholarships, location, hours, trial classes, hostel/transport, refunds | Done |
| FR-05 | Assistant recognises a specific course from aliases and returns a course card | Done |
| FR-06 | Quick-reply chips offered contextually and clickable | Done |
| FR-07 | Guided lead capture: name → phone → course → timeline | Done |
| FR-08 | Phone validation requires ≥ 10 digits and normalises to `+91 XXXXX XXXXX` | Done |
| FR-09 | Lead scoring 5–99 from timeline, course specificity and handoff intent; bucketed Hot ≥ 80 / Warm ≥ 55 / Cold | Done |
| FR-10 | Human-handoff intent detection with counsellor name and response-time promise | Done |
| FR-11 | Captured lead surfaces live in the demo page side panel | Done |
| FR-12 | Captured lead is persisted locally and appears on the leads dashboard | Done |
| FR-13 | Leads dashboard stats, quality filter and clear-captured action | Done |
| FR-14 | Seeded sample leads always present for a populated dashboard | Done |
| FR-15 | Chat reset control returns the assistant to its welcome state | Done |
| FR-16 | Simulated model latency with a typing indicator | Done |
| FR-17 | Per-route SEO head metadata (title, description, og) | Done |
| FR-18 | Explicit "demo / fictional data" labelling | Done |

## 7. Non-functional requirements

| ID | Requirement |
|----|-------------|
| NFR-01 | Works with no backend, no API key, no network calls beyond static assets and web fonts |
| NFR-02 | Assistant reply latency simulated at 420–800 ms; UI must remain interactive |
| NFR-03 | Responsive from 360 px to 1920 px; no horizontal scroll |
| NFR-04 | WCAG 2.1 AA intent: keyboard operable, labelled controls, live-region chat, visible focus |
| NFR-05 | Hydration-safe: no SSR/client markup mismatch from `localStorage` reads |
| NFR-06 | Single, consistent semantic design-token system; no hardcoded colour utilities |
| NFR-07 | Chat engine isolated behind one async function so an LLM swap touches one module |
| NFR-08 | Type-safe TypeScript, lint-clean, prettier-formatted |

## 8. Assumptions

- A1 — Demo is shown on a modern desktop or mobile browser with JavaScript enabled.
- A2 — Prospects accept fictional institute data as representative of their own.
- A3 — A deterministic engine is preferable to an LLM for live sales reliability at v0.1.
- A4 — No personal data of real people is entered during demos; anything typed is treated as disposable.
- A5 — Client-side-only persistence is acceptable because leads are demo artifacts.

## 9. Dependencies

- TanStack Start v1 + TanStack Router, React 19, Vite, Tailwind CSS v4, shadcn/ui (Radix), lucide-react, sonner.
- Google Fonts (Sora, IBM Plex Sans) loaded via `<link>` in the root route.
- Browser `localStorage`.

## 10. Risks

| ID | Risk | Impact | Mitigation |
|----|------|--------|------------|
| R1 | Prospect asks something outside the knowledge base | Demo feels limited | Graceful fallback reply listing supported topics + callback offer |
| R2 | Mock engine mistaken for a real LLM | Expectation mismatch at contract time | Explicit "deterministic local engine" copy on `/demo` |
| R3 | `localStorage` cleared/blocked | Leads vanish between pages | Seeded sample leads keep the dashboard populated |
| R4 | Fictional data mistaken for a real institute | Credibility issue | Demo badge and "fictional data" line on every page |
| R5 | Free-text input could contain real personal data | Privacy exposure | No transmission or server storage; documented in SAD |
| R6 | LLM migration later changes response shape | Rework | Fixed `AssistantTurn` contract |

## 11. Open decisions

| ID | Decision | Owner | Target |
|----|----------|-------|--------|
| OD-1 | Which LLM provider for v0.2 (Lovable AI Gateway vs. direct provider) | Aivanta | v0.2 planning |
| OD-2 | Whether v0.2 introduces Lovable Cloud persistence + auth for the dashboard | Aivanta | v0.2 planning |
| OD-3 | Whether the knowledge base becomes client-editable or stays code-defined | Aivanta | v0.2 planning |
| OD-4 | Whether WhatsApp/Instagram channels ship before or after CRM export | Aivanta | v0.3 |
| OD-5 | Whether the demo institute is replaced per-prospect at sales time | Aivanta | Ongoing |

## 12. Deferred by design

- **Authentication / authorization** — deferred. `/leads` is intentionally public in v0.1 because it contains only fictional data. Gating is required before any real lead data exists.
- **Payments / billing** — deferred. No pricing, checkout or subscription logic exists.
- **Real AI** — deferred. v0.1 ships a deterministic local response engine.

## 13. Acceptance criteria (v0.1 release)

- AC-1 All three routes render without runtime or hydration errors.
- AC-2 A visitor can complete J1 end to end and see the lead on `/leads`.
- AC-3 Every FR in §6 marked Done is observable in the running app.
- AC-4 No network request is made to any AI or backend service.
- AC-5 Documents 01–05 exist and match the implementation.
