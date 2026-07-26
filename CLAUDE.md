# CLAUDE.md — SalamStay web guardrails

## Model policy
Fable 5 administrates, Opus 5 executes (founder-set 2026-07-25). The session runs on Fable 5 (`.claude/settings.json` sets `"model": "fable"`) — it plans, decides, specs, dispatches, and judges; it does not grind out bulk work itself. Every worker agent runs Opus 5 (`frontend-designer`, `design-reviewer`, `ss-implementer`, `ss-reviewer`, `ss-compliance-auditor`). Sole exception: `ss-scout` on Sonnet for read-only find/map/grep that never judges correctness. Audits are bounded — 2–3 agents, non-overlapping lenses, findings carry file:line + the rule broken; never reopen founder-parked items.

## Working economy (founder-mandated, 2026-07-24)
Responses focused, brief, concise; substance-first. High-level summaries unless depth is asked. Documents sized to the task. Deliver at intended scope; routine judgment calls self-made; flag a mistaken request in one sentence then proceed as asked. Finish fully. Delegate only large, genuinely independent parallel work; never to verify your own work; one agent over several.

## This repo is the design home

**`TASTE-RULES.md` is the binding craft bar** (distilled from the founder's
Airbnb reference set in `../../airbnb taste/`): elevation law, green-rarity (4
roles), ink-fill selection, underline-at-rest, the gray-fill secondary button,
type discipline, imagery law, anatomy recipes. Builders build BY it; reviewers
audit AGAINST it; it wins over generic skill advice; SalamStay honesty law wins
over it.
- `DESIGN.md` — canonical design handoff. `SCREENS.md` — 226-row registry + §7.3 audit log. `CLAUDE-DESIGN-HANDOFF.md` — mechanics + the NEVERS.
- `design-system/` — approved cards; every UI built here must match its card. Consume tokens by role from `packages/design-tokens` — never hard-code a hex/px/ms.
- `SEO-RULES.md` + `gates/semantic-seo/` — binding for every indexable page; HARD gates block merge. The claims registry (§5) is verbatim-only; scope changes are founder-only.
- `scripts/validate-screens.mjs` — deterministic card validator; runs in CI; ERRORs block.
- `LOOP-COMPLETE.md` — open founder decisions; do not resolve them unilaterally.
- **`GO-LIVE.md` — the production blocker list. This site is localhost/demo only.** Work may ship with known gaps, but nothing is deferred silently: anything knowingly left undone goes in there with a close condition, in the same commit. Read it before calling any surface "done", and never describe the site as production-ready while section A has open rows.

## Defaults
TypeScript strict; workspace imports via `@salamstay/*`; tests next to source; comments only for non-obvious WHY. Next.js pages must reproduce the semantic contract of their `gw-*` card (one H1, `main.indexable`, breadcrumb, hreflang en-PK/ur-PK where specified).

## Frontend agent rule (founder-mandated, 2026-07-25)

Frontend design/UI work is NEVER dispatched to general-purpose agents. Use the skilled agents in `.claude/agents/`: **`frontend-designer`** to build UI, **`design-reviewer`** to audit it (implementer ≠ reviewer). Both MUST load the Emil Kowalski (`emil-design-eng`) and design-taste (`design-taste-frontend`) skills before touching UI, plus the situational set (`apple-design`, `animation-vocabulary`, `pick-ui-library`, `review-animations`, `redesign-existing-projects`, `high-end-visual-design`, `minimalist-ui`) — all vendored in `.claude/skills/`. Use `find-skills` to discover new capabilities before hand-rolling one. SalamStay's own design law (approved cards, tokens, canons) wins over any skill's generic advice.
