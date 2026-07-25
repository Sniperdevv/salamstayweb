# scripts — design-card machine guard

## `validate-screens.mjs`
Zero-dependency deterministic validator for SalamStay design cards (Node ≥18, sub-second).

```bash
node scripts/validate-screens.mjs <file...>   # validate specific card(s)
node scripts/validate-screens.mjs --all       # sweep design-system/cards/**/*.html
node scripts/validate-screens.mjs --json ...   # machine-readable findings
```

Exit **0** = no ERROR findings (WARN-only is advisory, non-blocking). Exit **1** = ≥1 ERROR.
Each finding: `{ file, rule, line, message, severity }` where severity ∈ `ERROR | WARN`.

### Rules
| ID | Severity | Checks |
|----|----------|--------|
| R1  | ERROR | Line 1 is exactly `<!-- @dsCard group="..." -->` |
| R2  | ERROR | Balanced/closed structural tags (div, section, li, a, …) — catches truncation & broken nesting |
| R3  | ERROR | Exactly one `<h1>` (comment/style stripped) |
| R4  | ERROR | Both `:root{` and a `.dark` selector are present (light + dark tokens) |
| R5  | ERROR | No off-palette hex — whitelist = every hex in `<style>` blocks (tokens + doc-chrome) + white/black |
| R6  | ERROR | No dead links (`href="#"` / `href="javascript:"`) outside an `aria-hidden="true"` subtree |
| R7  | ERROR | No `<button>` nested inside an `<a>` |
| R8  | WARN  | Ornament lexicon (`crescent\|arabesque\|minaret\|dome`) — human adjudicates (negations not auto-excluded) |
| R9  | ERROR | No forbidden marketing claims (`N,NNN+`, `#1 in Pakistan`, `number one`, `best in Pakistan`, `largest`, `guaranteed`, `lowest price`) |
| R10 | ERROR | Files in `cards/screens/` match `^(ga\|gw\|ha)-\d{3}-[a-z0-9-]+\.html$` |
| R11 | ERROR | No external `src=`/`href=` hosts except `fonts.googleapis.com` / `fonts.gstatic.com` |
| R12 | WARN  | File < 4KB — suspiciously small, possible truncation |

Comments are stripped before analysis (offsets preserved, so line numbers stay accurate); `<style>`/`<script>`
bodies are blanked for the structural rules (R2/R3/R6/R7).

### Automatic guard (PostToolUse hook)
`.claude/settings.json` wires a `PostToolUse` hook (matcher `Write|Edit`): on any save whose `file_path`
matches `design-system/cards/*.html`, it runs the validator and — on an ERROR — exits **2**, blocking the save
and surfacing the findings inline to the working Claude. Non-card writes exit 0 instantly.

### Status rule & extension policy
A card with any **ERROR** finding must be fixed before its **Status can flip to `designed`** (see
`CLAUDE-DESIGN-HANDOFF.md` §7.8). Run `--all` at each 10-screen self-audit. **Tighten-only:** add or harden
rules over time; never loosen a rule to make a card pass — fix the card instead.
