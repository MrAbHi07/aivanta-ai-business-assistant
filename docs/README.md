# Aivanta Admissions AI v0.1 — Project Documentation

Source-of-truth artifacts for this project. Keep them synchronized with the implementation;
update the relevant document and ticket whenever requirements or architecture change.

| # | Document | Purpose |
|---|----------|---------|
| 01 | [01-PRD.md](./01-PRD.md) | Product goals, personas, scope, journeys, requirements, risks, open decisions |
| 02 | [02-TAD.md](./02-TAD.md) | Architecture, data flow, tech stack, module map, upgrade path |
| 03 | [03-Security-Access.md](./03-Security-Access.md) | Access model, data handling, secrets, threat model, accepted risks |
| 04 | [04-Frontend-Specification.md](./04-Frontend-Specification.md) | IA, routes, components, states, responsiveness, accessibility, tokens |
| 05 | [05-Feature-Tickets.md](./05-Feature-Tickets.md) | Tickets with priority, status, scope, dependencies, acceptance criteria |

**Version:** 1.0 · **Date:** 2026-08-16 · **Status:** Current for v0.1

## Current state at a glance

- Three public routes: `/`, `/demo`, `/leads`.
- AI is a **deterministic local engine** (`src/lib/chat-engine.ts`) — no LLM, no API keys.
- Leads persist in browser `localStorage` only, merged with five seeded fictional samples.
- **Authentication and payments are intentionally deferred** (PRD §12, SAD §3).

## Consistency review (2026-08-16)

Documents were written after reading every route, component and lib module. Findings:

1. **React Query is mounted but unused for data** — recorded explicitly in TAD §2/AD-6 rather than implying a data layer exists.
2. **zod is a dependency but unused** — noted in TAD §2; there is no external input boundary in v0.1.
3. **`og:image` / `twitter:image` are absent on all routes** — correct per platform rules (no absolute hosted image); tracked as AIV-111 instead of being claimed as done.
4. **No test suite exists** — NFR-08 covers types/lint only; testing tracked as AIV-110 (Planned), not asserted as implemented.
5. **`/leads` is publicly accessible** — documented as an intentional accepted risk (SAD AR-1) with the explicit trigger that makes auth a release blocker.
6. **A `.dark` class block exists in `styles.css` while the app is dark by default** — treated as a no-op override; no light theme is claimed anywhere in the FSD.

No document asserts a capability the code does not have.
