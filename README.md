# SalamStay — Web

Next.js web app + the canonical SalamStay design system. Part of a 3-repo split
(`salamstay_app` = mobile, `salamstay_backend` = API + services).

Shariah-respectful, Pakistan-first short-stay marketplace. Six-city Day-1 beta:
Islamabad, Karachi, Lahore, Peshawar, Faisalabad, Rawalpindi.

## This repo is the design home

- `design-system/` — 226 approved screen cards + components + brand + photos (`design-system/index.html` is a browsable gallery: `sh scripts/serve-design.sh` → http://127.0.0.1:8765)
- `DESIGN.md` / `SCREENS.md` / `SEO-RULES.md` / `gates/` — the binding design, registry, SEO rulebook and QA gates
- `LOOP-COMPLETE.md` — design-phase closing report incl. the open founder-decision list
- `scripts/validate-screens.mjs` — deterministic card validator (runs in CI)

## Quickstart

Node 20.11+, pnpm 9.12+ (`corepack enable pnpm`).

```bash
pnpm install
pnpm typecheck && pnpm build && pnpm test
```

`apps/web` is a stub until Phase 0 wiring (T0-7). The indexable pages are fully specified
in `SEO-RULES.md` §3 and the `gw-*` cards — build to them, gates are HARD.

## Shared packages note

`packages/shared`, `packages/sdk-internal` and `packages/design-tokens` are duplicated
across the three repos for now. Design tokens change here first (this repo is canonical);
publish as private packages once churn justifies it.
