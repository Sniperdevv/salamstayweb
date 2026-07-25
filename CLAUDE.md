# CLAUDE.md — SalamStay web guardrails

## Model policy
Opus is the default model for the session and all dispatched agent work. Fable 5 is opt-in only (never unless the founder explicitly asks). Sonnet is the cheap tier for read-only search/bulk and mechanical fixes.

## Working economy (founder-mandated, 2026-07-24)
Responses focused, brief, concise; substance-first. High-level summaries unless depth is asked. Documents sized to the task. Deliver at intended scope; routine judgment calls self-made; flag a mistaken request in one sentence then proceed as asked. Finish fully. Delegate only large, genuinely independent parallel work; never to verify your own work; one agent over several.

## This repo is the design home
- `DESIGN.md` — canonical design handoff. `SCREENS.md` — 226-row registry + §7.3 audit log. `CLAUDE-DESIGN-HANDOFF.md` — mechanics + the NEVERS.
- `design-system/` — approved cards; every UI built here must match its card. Consume tokens by role from `packages/design-tokens` — never hard-code a hex/px/ms.
- `SEO-RULES.md` + `gates/semantic-seo/` — binding for every indexable page; HARD gates block merge. The claims registry (§5) is verbatim-only; scope changes are founder-only.
- `scripts/validate-screens.mjs` — deterministic card validator; runs in CI; ERRORs block.
- `LOOP-COMPLETE.md` — open founder decisions; do not resolve them unilaterally.

## Defaults
TypeScript strict; workspace imports via `@salamstay/*`; tests next to source; comments only for non-obvious WHY. Next.js pages must reproduce the semantic contract of their `gw-*` card (one H1, `main.indexable`, breadcrumb, hreflang en-PK/ur-PK where specified).

## Frontend agent rule (founder-mandated, 2026-07-25)

Frontend design/UI work is NEVER dispatched to general-purpose agents. Use the skilled agents in `.claude/agents/`: **`frontend-designer`** to build UI, **`design-reviewer`** to audit it (implementer ≠ reviewer). Both MUST load the Emil Kowalski (`emil-design-eng`) and design-taste (`design-taste-frontend`) skills before touching UI, plus the situational set (`apple-design`, `animation-vocabulary`, `pick-ui-library`, `review-animations`, `redesign-existing-projects`, `high-end-visual-design`, `minimalist-ui`) — all vendored in `.claude/skills/`. Use `find-skills` to discover new capabilities before hand-rolling one. SalamStay's own design law (approved cards, tokens, canons) wins over any skill's generic advice.
