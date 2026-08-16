# 02 — Technical Architecture Document (TAD)

**Product:** Aivanta AI Business Assistant v0.1
**Version:** 1.0
**Date:** 2026-08-16
**Status:** Current — reflects the shipped implementation

---

## 1. Architectural summary

v0.1 is a **client-rendered-after-SSR, front-end-only application**. TanStack Start provides
routing and server-side rendering of static marketing/demo content; all interactive behaviour —
the assistant engine and lead store — executes in the browser. There is **no database, no server
function, no external API, and no authentication layer**.

```text
                     ┌──────────────────────────────────────────┐
   Browser           │  TanStack Start app (SSR + hydration)    │
   ─────────         │                                          │
   Visitor  ────────▶│  /        landing (index.tsx)            │
                     │  /demo    demo page (demo.tsx)           │
                     │  /leads   dashboard (leads.tsx)          │
                     └───────────────┬──────────────────────────┘
                                     │ imports
                     ┌───────────────▼──────────────────────────┐
                     │ components/assistant-chat.tsx  (UI state)│
                     └───────────────┬──────────────────────────┘
                                     │ generateReply(text, state)
                     ┌───────────────▼──────────────────────────┐
                     │ lib/chat-engine.ts   (deterministic)     │
                     │  • intent match  • capture FSM  • score  │
                     └──────┬───────────────────────┬───────────┘
                            │ reads                 │ emits Lead
                     ┌──────▼─────────┐      ┌──────▼───────────┐
                     │ lib/demo-data  │      │ lib/leads-store  │
                     │ (mock KB)      │      │ (localStorage)   │
                     └────────────────┘      └──────┬───────────┘
                                                    │ custom event
                                             ┌──────▼───────────┐
                                             │ /leads dashboard │
                                             └──────────────────┘
```

## 2. Tech stack

| Layer | Choice | Version (package.json) |
|-------|--------|------------------------|
| Framework | TanStack Start | 1.168.x |
| Router | TanStack Router (file-based, `src/routes`) | 1.170.x |
| UI runtime | React | 19.2 |
| Build | Vite | 8.x |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite`, tokens in `src/styles.css` | 4.2 |
| Components | shadcn/ui on Radix primitives | current |
| Icons | lucide-react | 0.575 |
| Toasts | sonner (`@/components/ui/sonner`) | 2.0 |
| Data layer | `@tanstack/react-query` (provider mounted; no remote queries in v0.1) | 5.101 |
| Validation | zod (available, unused in v0.1 — no external input boundary) | 3.24 |
| Language | TypeScript strict | 5.8 |
| Runtime target | Edge worker for SSR; browser for all logic | — |

## 3. Module map

| Path | Responsibility |
|------|----------------|
| `src/router.tsx` | Creates the router with a `QueryClient` in context |
| `src/routes/__root.tsx` | Root shell: head links (Google Fonts), `QueryClientProvider`, `<Toaster />`, 404 and error components, error reporting hook |
| `src/routes/index.tsx` | Landing page; embeds `AssistantChat` in `compact` mode |
| `src/routes/demo.tsx` | Full demo; owns the "last captured lead" panel state |
| `src/routes/leads.tsx` | Dashboard: stats, quality filter, list, clear action |
| `src/components/assistant-chat.tsx` | Chat UI: message list, input, quick replies, typing state, reset, calls the engine, pushes leads to the store and `onLead` callback |
| `src/components/rich-text.tsx` | Minimal renderer for `**bold**` and newlines in assistant text |
| `src/components/site-chrome.tsx` | `Logo`, `SiteHeader` (responsive nav), `SiteFooter`, `DemoBadge` |
| `src/lib/chat-engine.ts` | Deterministic response engine + capture state machine + scoring |
| `src/lib/demo-data.ts` | Mock knowledge base (`INSTITUTE`, `COURSES`, `SCHOLARSHIP`, `LOCATION_INFO`) and `SAMPLE_LEADS` |
| `src/lib/leads-store.ts` | `localStorage` persistence, `addLead`, `clearCapturedLeads`, `useLeads` hook |
| `src/styles.css` | Tailwind v4 theme: colour/gradient/shadow tokens and custom utilities |

## 4. Data model (client-side types)

```ts
Course { id, name, aliases[], duration, fees, emi, batches[], mode, highlight }

Lead {
  id: string            // "LD-####"
  name, phone: string   // phone normalised "+91 XXXXX XXXXX"
  courseId, courseName: string
  timeline: "This month" | "Next 3 months" | "Just exploring" | free text
  score: number         // 5..99
  quality: "Hot" | "Warm" | "Cold"
  source: string        // "Website chat" for captured leads
  createdAt: string     // ISO
  handoff: boolean
}

ChatMessage { id, role: "user"|"assistant", content, quickReplies?, createdAt }
ChatState   { stage: CaptureStage, draft: {name?,phone?,courseId?,timeline?}, handoff }
AssistantTurn { reply, quickReplies?, state, lead? }
```

## 5. Conversation engine design

`generateReply(userText, state): Promise<AssistantTurn>` is the single entry point and is
intentionally async so a network-backed LLM call can replace its body verbatim.

**Priority order per turn**

1. If `stage` is an active capture step (`ask_name` → `ask_phone` → `ask_course` → `ask_timeline`), advance the state machine.
2. Else if handoff intent (`human|counsel|call me|talk to|agent|…`) → set `handoff`, enter capture at `ask_name`.
3. Else if booking intent (`book|enrol|admission|apply|register|callback|…`) → enter capture at `ask_name`.
4. Else attempt FAQ intent match (course-specific first, then fees, scholarships, location, hours, trial, hostel, refunds, greetings, thanks).
5. Else fallback reply listing supported topics + callback offer.

**Capture FSM**

```text
idle ──book/human──▶ ask_name ──▶ ask_phone ──(valid 10+ digits)──▶ ask_course ──▶ ask_timeline ──▶ done
                                     └─(invalid)─▶ ask_phone (retry)
```

**Scoring** — base 30; timeline bonus (this-month +45, 3-months +28, exploring +4, otherwise +18);
+14 if a specific course is identified; +10 if handoff requested; clamped to 5–99.
Buckets: ≥ 80 Hot, ≥ 55 Warm, else Cold.

**Latency simulation** — `420 + random*380` ms before each reply.

## 6. Data flow: lead capture

1. `AssistantChat` appends the user message and sets `thinking`.
2. `generateReply` returns `{ reply, quickReplies?, state, lead? }`.
3. Component stores the new `ChatState`, appends the assistant message.
4. If `lead` present → `addLead(lead)` (localStorage write) → `onLead(lead)` callback → success toast.
5. `addLead` dispatches a `aivanta-leads-changed` window event.
6. `useLeads` on `/leads` listens to that event plus `storage`, re-reads and merges `captured` before `SAMPLE_LEADS`.

## 7. Rendering and hydration

- Routes are SSR-rendered by TanStack Start, then hydrated.
- `leads-store` guards every `window` access with `typeof window === "undefined"` and reads storage
  only inside `useEffect`, so first client render matches the server output (empty captured list),
  then updates. This satisfies NFR-05.
- Message ids come from a module-level counter seeded during client interaction only; the initial
  welcome message uses a fixed id `m0` to avoid SSR/client divergence.

## 8. Styling architecture

- Tailwind v4 with `@theme` tokens in `src/styles.css`: `--primary` (cyan-teal), `--signal` (amber),
  `--success`, `--warning`, `--destructive`, `--surface`, `--surface-2`, chart and sidebar scales,
  all in OKLCH on a deep navy dark base.
- Brand composites: `--gradient-hero`, `--gradient-brand`, `--shadow-elegant`, `--shadow-card`.
- Custom utilities: `bg-hero-glow`, `text-gradient-brand`, `bg-gradient-brand`, `shadow-elegant`,
  `shadow-card`, `glass-panel`, `grid-fade`.
- Typography: Sora (display, `--font-display`) + IBM Plex Sans (body), loaded via `<link>` in the
  root route head — never `@import` in CSS (Tailwind v4 Lightning CSS constraint).

## 9. Error handling

- Root route defines `NotFoundComponent` (404) and `ErrorComponent` with a reset action.
- `src/lib/lovable-error-reporting.ts` / `error-capture.ts` forward runtime errors to the preview host.
- The chat engine cannot throw on unknown input — the fallback branch always returns a valid turn.

## 10. Build, environments, deployment

- `bun run dev` (Vite dev server, port 8080), `bun run build`, `bun run build:dev`.
- No environment variables and no secrets are required or read anywhere in v0.1.
- SSR bundle targets an edge worker runtime; no Node-only packages are used.

## 11. Performance

- No client data fetching; the only network cost is the app bundle plus Google Fonts.
- Chat state is local component state; the leads list is small and computed with `useMemo`.
- Auto-scroll uses a single ref-driven `scrollTo` per message change.

## 12. Upgrade path (not implemented in v0.1)

| Step | Change | Blast radius |
|------|--------|--------------|
| U1 — Real LLM | Replace the body of `generateReply` with a `createServerFn` call that proxies an LLM; keep `AssistantTurn` | `chat-engine.ts` + one new `*.functions.ts` |
| U2 — Persistence | Enable Lovable Cloud; replace `leads-store` internals with table reads/writes | `leads-store.ts` only (hook API preserved) |
| U3 — Auth | Add an `_authenticated` route group and move `/leads` under it | route file move + gate |
| U4 — Channels | Webhook routes under `src/routes/api/public/*` with signature verification | new files |

## 13. Architecture decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| AD-1 | Deterministic engine over LLM for v0.1 | Zero cost, zero latency risk, repeatable in live sales demos |
| AD-2 | `localStorage` over a database | No backend needed; demo leads are disposable |
| AD-3 | Single async engine entry point | Makes the LLM swap a one-module change |
| AD-4 | Knowledge base as typed constants | Type safety and easy replacement by CMS/DB later |
| AD-5 | Dark-first custom token system, no default AI palette | Premium, ownable brand identity |
| AD-6 | React Query provider mounted but unused for data | Ready for U1/U2 without re-wiring the root |
