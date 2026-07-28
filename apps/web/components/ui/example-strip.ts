/**
 * The honesty strip's recipe — TASTE §6's `bg.raised` info strip, payload word
 * bolded and nothing else.
 *
 * WHY THIS IS A CLASS STRING AND NOT A COMPONENT
 * ---------------------------------------------
 * Eight surfaces draw this strip and **every one of them says something
 * different**, because the thing each is being honest about differs:
 *
 *   `SampleDataStrip`        no booking store — accepting or declining saves nothing
 *   `ExampleBookingStrip`    this stay is written in, not made by anyone
 *   `ExampleAccountStrip`    no accounts; the mark below is written in
 *   `ExampleWishlistStrip`   no wishlist store; the HOMES are real, the list is not
 *   `HostSetupStrip`         no verification record, no listing record
 *   `VerificationStrip`      no NADRA connection and nowhere for a document to go
 *   `ExampleThreadStrip`     no message store
 *   `ListingSampleStrip`     no listing store
 *
 * Four separate agents each hit this independently and each reached the same
 * two conclusions: do not fork the recipe, and do not render a false sentence.
 * With only a `className` prop on the original, the only way to honour both was
 * to re-declare the component with the class string copied byte-for-byte —
 * which is what all eight did, and what left eight copies of one recipe.
 *
 * The wording is not the duplication. **The class string was.** So the string
 * moves here and the eight keep their own copy, their own name and their own
 * call sites. A ninth surface imports this and writes its own sentence.
 *
 * `ExampleAccountStrip` put it best when it declined to reuse a sibling
 * verbatim: *the wording differs because the lie differs.*
 *
 * NOT a warning register, and never a dismissible banner. Nothing is wrong —
 * the product simply does not have the store yet, and the reader is entitled to
 * know that before they read a name, a date or an amount as though it were
 * theirs.
 */
const exampleStripBody =
  "rounded-md bg-raised px-4 py-3 text-bodySm font-regular leading-relaxed text-secondary";

/**
 * The host tree's strip. `max-w-prose` — the token measure.
 */
export const exampleStrip = `max-w-prose ${exampleStripBody}`;

/**
 * The guest tree's strip, and **the measure is the only difference**.
 *
 * Found while folding the eight copies together: the five host strips use the
 * `max-w-prose` token, the three guest ones (`trip-chrome`, `account-chrome`,
 * `wishlist-chrome`) use an arbitrary `max-w-[68ch]`. Everything else about the
 * two is character-for-character the same.
 *
 * They are kept apart rather than flattened, because collapsing them would be
 * a silent visual change to three shipped surfaces made in the name of tidying
 * up — and the divergence may be deliberate: a guest strip sits in a 640
 * column, a host strip in a 1120 one.
 *
 * **It is almost certainly not deliberate**, though: `68ch` is an arbitrary
 * value where a token exists, and no file explains it. Logged as GO-LIVE A21
 * for one ruling rather than resolved by whoever happened to touch it last.
 */
export const exampleStripGuest = `max-w-[68ch] ${exampleStripBody}`;

/** The bolded payload word that opens every one of them — "Example data." */
export const exampleStripLead = "font-semibold text-primary";
