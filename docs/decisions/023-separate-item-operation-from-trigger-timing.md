# ADR-023: Separate item operation from Trigger timing

## Status

Accepted

## Date

2026-09-06

## Context

Enchanted items treated Triggered as an item kind beside Continuous and
Consumable. Trigger already described when a Shaping resolves, while the item
kind also attempted to describe who paid for a use and whether it could be
reused. A Trigger fired once, but the old item text charged the bearer each time
it fired, leaving arming, targeting, expiry, and repeat use unclear. Consumables
and charges also named the same prepaid resource model twice.

## Decision

Use three item kinds based on operation and payment:

- Continuous effects operate while worn or held and commit bearer maximum PP.
- Activated effects are reusable and cost the bearer full Magnitude PP per use.
- Charged effects expend one use prepaid by the maker. Potions and scrolls are
  one-charge Charged items.

Trigger is an optional timing adjustment for an Activated or Charged effect,
not an item kind. Activation arms one use instead of resolving it immediately.
The item's observable event is fixed when made; its target and permitted
use-specific choices are fixed when armed. Arming spends the PP or charge even
if the event never occurs before the wait expires. The event then fires that use
once without another Action.

For Enchantment Capacity, a Continuous or Activated effect counts its full
Magnitude once, while each unused Charged use counts its full Magnitude
separately. Using a charge frees that charge's capacity; using an Activated
effect does not end its reusable enchantment.

## Consequences

- Timing and resource models can be combined without overlapping item kinds.
- A potion is simply a one-charge item, while a wand may hold several charges.
- An unused Trigger cannot preserve the PP or charge spent to arm it.
- Depletable protection can be renewed only by another paid Activated use or
  another stored charge, never by Continuous operation.
