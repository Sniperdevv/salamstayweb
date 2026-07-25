import { PinIcon } from "@/components/icons";
import { Panel } from "./panel";

/**
 * Where the map view goes, and why it is not here yet.
 *
 * GW-005 panel 3 draws the map: a substrate, three price pins and a cluster.
 * Every one of those pins carries a nightly figure, and the card's own note
 * says the rule out loud — "the map never introduces a figure the listing page
 * does not show". No nightly price is published yet; the listing cards on this
 * page draw a skeleton where the number goes. A map here would therefore be a
 * drawing of a city we have not surveyed, dotted with prices we have not set.
 *
 * §12 gives exactly two honest options for data that does not exist: suppress
 * it, or ship a placeholder that says so. A greyed rectangle with fake roads
 * is neither — it is a screenshot of a product feature, which is the oldest
 * tell in the book. So the block says the true sentence in the space the map
 * will occupy, and the space is the point: the reader learns the view exists
 * and is not being hidden from them.
 *
 * It sits BELOW the grid, never above it. The page's job is inventory first;
 * a note about a missing feature does not get to push nine homes down a screen.
 */
export function MapNote() {
  return (
    <Panel
      icon={<PinIcon className="size-5" />}
      title="Map coming with live inventory"
      body="A pin has to carry a nightly price, and pricing is not published yet. Until it is, every card names the sector it sits in."
    />
  );
}

export default MapNote;
