# ClaimMe

An evidence-first companion for understanding Indian health-insurance claims. Follow status changes, inspect documents, explore policy wording, understand deductions, and prepare supported questions.

**Current status:** complete frontend demonstration with synthetic records. No live authentication, insurer integration, OCR, AI inference, document upload, or grievance submission service is connected. Do not enter real personal, medical, financial or insurance information.

## Product principles

Understand → Verify → Explain → Act. ClaimMe assists; the insurer decides. Explanations preserve sources, uncertainty and the distinction between documents, policy rules, interpretations and decisions. Additional review does not establish wrongdoing.

## Getting started

Use Node.js 24 and npm. Run `npm install`, then `npm run dev`. Open http://127.0.0.1:3200. Production: `npm run build` followed by `npm start`.

## Architecture

Next.js App Router, React, TypeScript and Tailwind. Shared domain modules contain typed fixtures, immutable historical snapshots, settlement arithmetic in integer paise, correction events, draft export and a browser-backed repository interface. Motion handles restrained DOM entry motion; React Three Fiber provides opt-in 3D exploration; XYFlow presents evidence relationships. Essential content and controls remain available in HTML.

The public site links to onboarding and the demo workspace. The documented claim CM-1024 includes evidence comparison, replay, policy context, settlement, messages, dispute preparation and activity. Other claims are explicitly limited synthetic summaries. Settings supports local preference changes, consent acknowledgement, JSON export and reset.

## Data and integration boundaries

Demo changes use `claimme-demo-v2` in localStorage. Version-one data is migrated where safe; malformed data falls back to defaults. Storage failures are surfaced. Selected files are used only for transient filename/type/size preview, never read or uploaded. Local storage is not an encrypted vault. Reset clears this origin's demo state; bundled synthetic source material remains available.

Account forms validate without transmitting credentials. Policy Ask uses authored fixture responses with source references and an unavailable-answer state. Draft export includes a synthetic evidence index and history, not real attachments; nothing is submitted externally. Regulatory deadlines are intentionally absent pending authoritative verification.

## Development and testing

`npm run format`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`. `npm run check` runs the latter four. Test scenarios cover settlement boundaries, temporal claim states, preserved corrections, supported grievance assertions and repository recovery/migration/reset. Browser verification and limitations are recorded in `design-qa.md`.

Read `AGENT.md` before substantial changes. Keep secrets, customer documents, private planning, runtime memory and local reference material out of version control. Prefer modular feature components and source-grounded behavior over placeholder pages.

## Disclaimer

Illustrative educational interface. Not an insurer, claim adjudicator, coverage guarantee, fraud detector or legal-advice service. Real-world use requires validated contracts, current applicable rules, backend security, authorized integrations and professional product review.
