# 03 — Security & Access Document (SAD)

**Product:** Aivanta AI Business Assistant v0.1
**Version:** 1.0
**Date:** 2026-08-16
**Status:** Current — describes the shipped posture, including intentional deferrals

---

## 1. Security posture summary

v0.1 is a **fully public, front-end-only demo with no backend, no database, no secrets and no
authentication**. Every page is intentionally reachable by anyone with the URL. All data displayed
is fictional demo content, and anything a visitor types stays inside their own browser.

The security model is therefore: **minimise the attack surface by having no server-side state at
all**, and gate nothing because there is nothing sensitive to gate.

## 2. Access control model

| Surface | Access | Rationale |
|---------|--------|-----------|
| `/` landing | Public | Marketing content |
| `/demo` assistant | Public | Demo, no real data |
| `/leads` dashboard | **Public — intentionally** | Contains only fictional seeded leads plus the visitor's own locally-stored demo captures |
| Any API route | None exist | No server endpoints are defined in v0.1 |

There are no roles, no user accounts, no sessions, no privileged operations, and no admin surface.
`/leads` is labelled "Demo" in the UI so it cannot be mistaken for a production CRM.

**Least privilege in v0.1** is satisfied structurally: the app holds no credentials, requests no
permissions, and cannot read or write anything outside its own browser origin's `localStorage`.

## 3. Authentication and authorization — intentionally deferred

Authentication and payments are **deliberately out of scope for v0.1** (PRD §12).

This is acceptable **only while every record on `/leads` is fictional**. The moment any of the
following becomes true, authentication becomes a release blocker:

- Real prospect names or phone numbers are captured for a real client.
- Leads are persisted server-side or shared across devices/users.
- A client is given a link to "their" dashboard.

**Required gate at that point:** enable Lovable Cloud auth, move `/leads` under an
`_authenticated` route group, store roles in a dedicated `user_roles` table with a
`SECURITY DEFINER has_role()` function (never a role column on a profile), enable RLS on every
public-schema table, and add explicit `GRANT`s per table. See TAD §12 (U2/U3).

## 4. Data handling and privacy

| Data | Origin | Where it lives | Retention | Transmitted? |
|------|--------|----------------|-----------|--------------|
| Seeded sample leads | Hardcoded in `src/lib/demo-data.ts` | App bundle | Permanent (fictional) | No |
| Visitor chat messages | Typed in the browser | React component state only | Until page reload/reset | **No** |
| Captured demo leads (name, phone, course, timeline) | Chat capture flow | `localStorage` key `aivanta.demo.leads.v1` | Until the visitor clears them or clears browser storage | **No** |

Key properties:

- **No transmission.** The assistant makes zero network calls; `generateReply` is a local pure-ish
  function with a `setTimeout` delay. Nothing typed by a visitor leaves the device.
- **No server logs of user content.** There is no server function, so no request bodies to log.
- **No cookies, no analytics, no third-party trackers.** The only third-party request is Google
  Fonts (`fonts.googleapis.com` / `fonts.gstatic.com`) for stylesheet and font files.
- **User-clearable.** The "Clear captured leads" control on `/leads` deletes all locally stored
  captures immediately.
- **DPDP/GDPR note.** Because no personal data is collected by Aivanta as a controller in v0.1
  (data never leaves the visitor's device), no consent banner, DPA or retention policy is required.
  All three become required in v0.2 if leads are persisted server-side.

**Operating rule for demos:** do not enter real third-party personal data during sales demos. Use
placeholder names and numbers.

## 5. Secrets management

- **v0.1 uses no secrets.** There are no API keys, tokens, service credentials or environment
  variables read anywhere in the codebase.
- No `.env` values are referenced; `process.env` is not read in application code.
- When v0.2 adds an LLM, the provider key must be stored as a project secret and read **only inside
  a server function handler** — never in client code, never in `import.meta.env.VITE_*`, never
  committed. Publishable/anon keys are the only client-safe keys.

## 6. Threat model

| ID | Threat | Applicability to v0.1 | Control / status |
|----|--------|-----------------------|------------------|
| T1 | Unauthorized read of real customer leads | Not applicable — no real leads exist | Accepted; blocked by design once real data appears (§3) |
| T2 | XSS via chat input | Low | Assistant text is rendered by `rich-text.tsx` which emits React text nodes and `<strong>`; no `dangerouslySetInnerHTML`; React escapes user echoes |
| T3 | Prompt injection / jailbreak | Not applicable | No model; responses come from a fixed regex/branch table and cannot be steered |
| T4 | Secret leakage | Not applicable | No secrets exist |
| T5 | Server-side injection (SQL/command) | Not applicable | No database, no server code |
| T6 | Supply-chain (npm dependency) | Present | Pinned lockfile; dependency scanning before each release; no post-install scripts added |
| T7 | localStorage tampering | Low | Parsed defensively in `try/catch`; corrupt data degrades to an empty list; only affects the tamperer's own view |
| T8 | Stored-data disclosure on a shared device | Low | Demo captures persist locally; mitigated by the visible clear action and demo-only data |
| T9 | Denial of service | Low | Static hosting; no compute endpoints to exhaust |
| T10 | Clickjacking / brand spoofing | Low | Static marketing content; no authenticated actions to frame |

## 7. Client-side security practices in force

- No `dangerouslySetInnerHTML`, no `eval`, no dynamic script injection.
- No use of `window.opener`-unsafe external links from app chrome.
- All rendering goes through React; assistant markdown is limited to bold and newlines.
- No third-party embeds, iframes or pixels.
- Input is length- and format-checked before it becomes a `Lead` (phone requires ≥ 10 digits;
  name is stripped to letters/spaces/apostrophes/hyphens and capped at 3 words).

## 8. Accepted risks (v0.1)

| ID | Accepted risk | Why acceptable | Review trigger |
|----|---------------|----------------|----------------|
| AR-1 | `/leads` is publicly readable | All records are fictional demo data | First real client lead |
| AR-2 | No authentication anywhere | No sensitive operation exists | Any persistence or per-client view |
| AR-3 | Lead data stored unencrypted in `localStorage` | Demo-only, device-local, user-clearable | Real personal data capture |
| AR-4 | Google Fonts is a third-party request | Standard practice; no PII in the request | Strict no-third-party requirement |
| AR-5 | No rate limiting | No server compute to protect | First server function |

## 9. Security acceptance criteria (v0.1)

- SEC-1 No secret, key or token appears in the repository or client bundle. ✔
- SEC-2 No network request carries visitor-entered text. ✔
- SEC-3 No `dangerouslySetInnerHTML` or equivalent raw-HTML sink exists. ✔
- SEC-4 Locally stored demo leads can be fully cleared from the UI. ✔
- SEC-5 Every page that shows lead data carries a demo/fictional-data label. ✔
- SEC-6 Documentation states explicitly that auth and payments are deferred and names the trigger that makes them mandatory. ✔

## 10. Pre-v0.2 security checklist (must be completed before real data)

1. Enable authentication; move `/leads` under `_authenticated`.
2. Create `user_roles` + `has_role()` security-definer function; no role columns on profiles.
3. Enable RLS on every table and add explicit `GRANT`s per table and role.
4. Store the LLM key as a project secret; call the provider only from a server function handler.
5. Validate all server-function input with zod.
6. Verify signatures on any `/api/public/*` webhook route.
7. Add a privacy notice and retention policy for captured leads.
8. Run a dependency and security scan before publishing.
