import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import {
  BankTransferIcon,
  CardIcon,
  CashIcon,
  GlobeIcon,
  WalletPhoneIcon,
} from "@/components/booking/pay-glyphs";
import { btnSecondary, inlineAction } from "@/components/ui";
import { EmptyState } from "@/components/ui/empty-state";
import { PAYMENT_RAILS, type PaymentRail } from "@/lib/booking/booking";
import { RAIL_NAME } from "@/lib/booking/rails";
import { pageMetadata } from "@/lib/seo/metadata";

import {
  AccountBackLink,
  AccountPageHead,
  AccountSection,
  ExampleAccountStrip,
} from "../../account-chrome";
import { SAVED_PAYMENT_METHODS } from "../settings-model";

/**
 * GA-062 — `/account/settings/payment`, at web width.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  NO PAYMENT INSTRUMENT IS RENDERED ON THIS PAGE. NOT EVEN A MASKED ONE.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * `ga-062` draws three saved methods — `HBL debit card · Visa · •••• 8842 · exp
 * 09/28`, `EasyPaisa wallet · 0345 ••• 1190`, `Bank account · Raast · Meezan
 * Bank · •••• 5567` — and `ga-123` puts the first one's tail in the settings
 * hub's hint. A masked tail is not a redaction of data that exists; here it is a
 * whole invented instrument, and it asserts the strongest thing a page can
 * assert about a stranger: that their money is reachable from this account.
 * `GUEST-SHELL.md` §14 rules exactly this class of thing a fabrication until the
 * record exists, and TASTE §12 forbids substituting a dash for it — *"suppress
 * the row or ship a skeleton"*.
 *
 * So the page suppresses. `SAVED_PAYMENT_METHODS` is an empty array in
 * `../settings-model.ts` and the hub's hint is derived from its length, so the
 * two cannot disagree; §12's empty state stands where the list would.
 *
 * WHAT REPLACES THE LIST, AND WHY IT IS TRUE
 * -------------------------------------------
 * A guest arriving here wants two answers, and both of them are facts about the
 * PRODUCT rather than about a person, so both can be given:
 *
 *  1. **What can I pay with?** The six rails, read from `PAYMENT_RAILS` and
 *     `RAIL_NAME` — the modules the checkout's own Confirm step renders from.
 *     Not retyped: `lib/booking/rails.ts` exists precisely because *"a second
 *     copy of `Card (HBL)` is a second copy that will drift, and the two screens
 *     disagreeing about what a guest's payment method is called is the kind of
 *     small wrongness that reads as carelessness on the screen that charges."*
 *     The glyphs are the Confirm step's own map, from `pay-glyphs.tsx`.
 *  2. **Where do my details go?** Answered in the words the shipped Privacy
 *     Policy already uses at `/legal/privacy` — *"The rail you chose … and
 *     Meezan Bank, which holds the custody account"* — and linked, so the answer
 *     has somewhere to be checked.
 *
 * `ga-062`'s tokenisation line ("SalamStay never sees your full card or account
 * number") is deliberately NOT carried forward. It may well be true of the
 * architecture, but no shipped SalamStay document states it, and a security
 * guarantee that appears first on a settings page is a claim the product has not
 * made anywhere it can be held to. The privacy policy's sentence is used
 * instead, because that one has been published.
 *
 * ALSO ABSENT: `Add a payment method` routing to `/account/settings/payment/add`
 * (`ga-052`'s rail manager). There is nothing to add a method to, the add flow
 * is unbuilt, and §12's *"never a dead end"* asks the one action to name the
 * exact next step — which here is booking a stay, since a rail is chosen at
 * checkout and there is no earlier moment. The per-row `⋯` menu, the set-default
 * chip and the Undo toast go with the rows they belonged to.
 *
 * NO CLIENT STATE, so no `step.tsx` sibling: this page owns its `metadata`
 * directly. The other two settings children split because they hold state; this
 * one does not, and splitting it anyway would add a boundary for nothing.
 *
 * GREEN (§8): none in the body. The empty state's action is TASTE §5's gray-fill
 * secondary rather than a green pill, keeping the whole `/account` tree at two
 * chrome roles — see `personal/step.tsx` for the argument.
 *
 * ROUTE CONTRACT (§2): `noindex, follow`; no canonical, no hreflang, no JSON-LD,
 * no breadcrumb; `<main class="co-main">` from the layout. Title `Payment
 * methods — SalamStay`, `<h1>` `Payment methods` (G43).
 */
export const metadata: Metadata = pageMetadata("/account/settings/payment");

/** The Confirm step's own rail → glyph map (`app/book/[slug]/confirm/step.tsx`). */
const RAIL_GLYPH: Readonly<Record<PaymentRail, ReactNode>> = {
  jazzcash: <WalletPhoneIcon className="size-5" />,
  "hbl-card": <CardIcon className="size-5" />,
  easypaisa: <WalletPhoneIcon className="size-5" />,
  raast: <BankTransferIcon className="size-5" />,
  "overseas-card": <GlobeIcon className="size-5" />,
  "cash-on-arrival": <CashIcon className="size-5" />,
};

export default function PaymentMethodsPage() {
  return (
    <>
      <AccountBackLink href="/account/settings">Settings</AccountBackLink>

      <AccountPageHead
        className="mt-5"
        title="Payment methods"
        sub="The cards, wallets and bank accounts you keep for a shorter checkout next time."
      />

      <ExampleAccountStrip className="mt-6">
        No card, wallet or account number appears anywhere on this page, and none is stored.
      </ExampleAccountStrip>

      {/*
        §12's four-part recipe, from the shared component: glyph in a `bg.raised`
        disc, a plain heading with no apology, one factual sentence about what
        this surface will hold, and exactly one action naming the next step.
        `heading="h2"` because the `.pagehead` above already carries the `<h1>`.

        `SAVED_PAYMENT_METHODS` is empty and the branch is written out rather
        than assumed, so that the day a real wallet arrives the filled state is a
        missing `else`, not a rewrite.
      */}
      {SAVED_PAYMENT_METHODS.length === 0 ? (
        <EmptyState
          glyph={<CardIcon className="size-7" />}
          title="Nothing saved yet"
          body="When you pay for a stay you can keep the method you used, so the next checkout is shorter."
          action={
            <Link href="/" className={`${btnSecondary} no-underline`}>
              Find a place to stay
            </Link>
          }
        />
      ) : null}

      <AccountSection
        id="rails"
        heading="What you can pay with"
        sub="You choose one of these at checkout. Nothing is kept until you do."
        className="mt-2"
      >
        {/*
          Content blocks: no box, no plate, no bordered group. TASTE §1 puts a
          block of icon + label in the "carries NEITHER" column, and these are
          statements about the product rather than controls to choose between —
          the choosing happens on the Confirm step, which draws them as real
          radio rows.
        */}
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {PAYMENT_RAILS.map((rail) => (
            <li key={rail} className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex size-10 flex-none items-center justify-center rounded-full border border-hairline bg-raised text-secondary"
              >
                {RAIL_GLYPH[rail]}
              </span>
              <span className="min-w-0 text-bodyMd font-medium text-primary">
                {RAIL_NAME[rail]}
              </span>
            </li>
          ))}
        </ul>
      </AccountSection>

      <AccountSection id="where" heading="Where your details go" className="mt-8">
        <p className="mt-3 max-w-[62ch] text-bodyMd font-regular leading-relaxed text-secondary">
          Payment details are taken to charge in Pakistani Rupees and to hold the money in trust
          until you check in. They go to the rail you chose, and to Meezan Bank, which holds the
          custody account.{" "}
          <Link href="/legal/privacy" className={`${inlineAction} font-medium`}>
            The same row in the Privacy Policy
          </Link>
          .
        </p>
      </AccountSection>
    </>
  );
}
