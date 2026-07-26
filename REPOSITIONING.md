# REPOSITIONING — 2026-07-26

**Founder decision.** SalamStay is no longer a religious product. Read this before touching any
copy, content model or card. It supersedes every earlier document where they conflict, including
`SEO-RULES.md` §5, the design corpus, and anything in `design-system/`.

`MISSION.md` has already been rewritten and is the reference for the new positioning.

---

## What SalamStay is now

The home-sharing platform **for Pakistan**, built on two things global platforms do not offer here:

1. **NADRA-verified identity on both sides of every booking.**
2. **The practical facts about the property** — load-shedding pattern, backup-power runtime, water
   supply, sui gas, Wi-Fi speed, safe parking. *This is now the lead differentiator, not a footnote.*

It is not marketed to a faith. It makes **no claim about Shariah compliance**.

## What is retired

Remove from the product — not softened, removed. It is not modelled, not filtered on, not badged,
not marketed:

- **Qibla direction** · **prayer space / prayer mat** · **wudu facilities** · **distance to nearest
  masjid** · **halal kitchen** · Iftar/Sehri hosting · Eid-week policy · mahram-only restriction
- The **"Shariah-respectful"** positioning line and every variant of it
- Framing the product for "Muslim families", "the Muslim world", or "faith-conscious travellers"

A host may still write whatever they like in their own listing prose. **We do not model it.**

## What survives, and on what grounds

| Kept | Now justified as |
|---|---|
| **Nikah Nama upload** | One of several NADRA documents establishing a relationship, alongside FRC and B-Form. Identity verification, **not observance**. |
| **FRC / B-Form** | Same — NADRA records that establish who is travelling together. |
| **No alcohol** | A **house rule**, presented at the exact weight of "no smoking" or "no parties". Default on; a host who allows it must opt in and disclose. |
| ~~**Women-only stays, women-hosted**~~ | **🚫 RETIRED 2026-07-26, founder-ruled: *"we do not have such policy."*** The "women-hosted" half was never verifiable — SalamStay has no host-gender field and the wizard is ruled never to ask for one. §5 slot 5 is struck. Whether a HOST may still set `Women guests only` as a house rule is a separate, open question. |
| **Family-only listings** | A host restriction on who may book. |

Why documents are asked for at all: **a stranger is handing you the keys to their home, and both
sides should know who the other is** — the same reason a hotel takes ID. Where a document is
genuinely required it is by the host's house rules or a local regulation such as cantonment
registration. Otherwise the check is a CNIC and nothing more.

## The money structure: keep the mechanism, drop the vocabulary

The founder ruled: **the legal and financial structure is unchanged.** `ARCHITECTURE.md` stands —
the Meezan custody account, the written agreement, the advisor engagement, the SBP legal opinion,
the `MeezanEscrowAdapter`, the commission line in the chart of accounts. **Do not touch any of it.**

What changes is **what a guest reads**:

| Was | Becomes |
|---|---|
| `amanah` / "held in amanah — a trust" | **"held in trust until you check in"** |
| `wakala` / "Service fee (wakala)" | **"Service fee"** |
| "SalamStay acts as your booking agent (*wakala*)" | "SalamStay acts as your booking agent" |

Everything else in those sentences is unchanged and still true: funds are held and released after
check-in, SalamStay does not hold customer money in its own name, the fee is a flat disclosed
commission and not interest or a markup. **Never make a guest look up a word to understand where
their money is.** This also closes the parked GA-059 amanah-wording decision.

## `/shariah-policy` becomes `/verification`

The page **is not deleted** — it carries the party-to-document matrix that the checkout derives its
rules from, and `gw-022` / `gw-023` both read it. Deleting it would leave the Nikah Nama upload as
an unexplained demand for a marriage certificate.

It is **repositioned and renamed to `/verification`**: keep the matrix, keep the house-rules
content, strip the Shariah framing, the religious rationale and the title. Nothing is indexed yet
and no redirect infrastructure exists, so a rename is safe — update the footer, the sitemap, the
registry and every inbound link.

## The §5 claims registry changes — founder-approved

Claims are byte-exact law, so these are rewritten deliberately, not paraphrased ad hoc:

- **Claim 6** (`Halal-kitchen, prayer-space, and Qibla direction shown on listings`) — **retired.**
  Nothing replaces it in that slot.
- **Claims 2, 3** (Nikah Nama, FRC) — kept, reframed in surrounding copy as verification.
- **Claims 4, 5** (no-alcohol, women-only) — kept as written.
- **Claims 1, 7, 8, 9** — unaffected.

Claim 7 (`Listings show load-shedding hours and backup power`) is now the **flagship** claim and
should lead where a claim leads.

## The attribute lexicon shrinks

`AttributeIcon` in `lib/content/stays.ts` is a closed set of seven. Three go: `halal-kitchen`,
`prayer-space`, `qibla-marked`. Four remain: `no-alcohol`, `backup-power`, `women-only`,
`family-friendly`.

**Every stay fixture carries exactly two attributes** and 54 named homes are defined across
`featured-stays.ts` and the city content files. Many currently use a retired value and must be
reassigned from the surviving four. `backup-power` is now the most useful and the most on-message.

## Scope of this pass

**In:** `apps/web` in full, the seven `gw-021`…`gw-027` checkout cards, `SEO-RULES.md`,
`REPOSITIONING.md`, `MISSION.md` (done).

**Out, logged as a separate programme:** the 226-card app design corpus in
`design-system/cards/screens/ga-*` and `ha-*`. Re-authoring it is weeks of work on a surface nobody
is building. It will contradict this document until swept — that is known and accepted, and a
`GO-LIVE.md` row records it.

## Standing rules unchanged

Honesty law, `TASTE-RULES.md`, tokens by role, `.num` on every digit run, no invented stats or
ratings, dignity-through-normalcy tone. **Removing the religious framing does not license a colder
product** — the tone stays calm, plain and non-judgemental. A guest uploading a marriage certificate
should feel the same respect they did yesterday; only the reason given changes.
