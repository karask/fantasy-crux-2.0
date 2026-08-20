# ADR-012: Retire Committed Strike and Deadeye, add skill Expertise Talents

## Status

Accepted

## Date

2026-08-20

## Context

Exact-probability review showed that the `+1B` on Committed Strike and Deadeye nearly doubles the chance of an armour-ignoring Critical at their 76% prerequisites (7% to about 13.3%), on top of `+2` flat damage. Committed Strike prices that with a real melee gamble, but a backline archer often pays nothing meaningful for Deadeye's Reaction forfeit. A weapon-specific `+1B`-only variant at 4 and 5 IP was considered and rejected: it kept the Critical spike while pricing the pair below Weapon Expertise, Favoured Weapon, and Mighty Shot in attractiveness.

Separately, Weapon Expertise carried only the `training` tag among filterable tags, so the Talent browser's Offence and Defence filters missed a Talent that modifies attacks, Parries, Active Guard, and Opportunity Attacks. The catalogue also had no non-combat counterpart to its penalty-removal pattern beyond Tracker.

## Decision

- **Retire Committed Strike (3 IP) and Deadeye (4 IP).** They may return in a reworked form. Their slugs join the Talent chapter's legacy anchors, following the Sure Hand precedent, and the audit lists them as `Retire` rows outside the current catalogue.
- **Add Athletics Expertise, Deception Expertise, and Terrain Expertise, 2 IP each**, priced to the Tracker precedent: choose one Athletics application, one Deception application, or one terrain, and after ordinary cancellation but before the dice cap remove up to one remaining Penalty die from matching tests, never creating Bonus dice. Each may be bought again for a different choice. One shared choose-a-specialty Talent per skill was preferred over individually named sub-category Talents, which would multiply entries carrying one identical mechanic; a sub-category earns its own named Talent only when it brings a distinct mechanic, as Cutpurse and Silent Step already do. The catalogue moves to 51 Talents.
- **Retag Weapon Expertise** from `close, ranged, training` to `close, defence, offence, ranged`, so it appears under the Offence, Defence, and Ranged filters rather than the General bucket.

## Consequences

- The catalogue becomes 51 Talents; the frozen title list, chapter legacy anchors, audit assessments, and browser filter expectations are updated together.
- Old `#committed-strike` and `#deadeye` bookmarks continue to resolve to the Talent chapter.
- Reliability-focused martial play routes through Weapon Expertise, Favoured Weapon, and Signature Weapon instead of Bonus-die attack riders.

## Alternatives considered

### Weapon-specific +1B variants at 4 and 5 IP

Rejected: three simultaneous nerfs made both Talents strictly less attractive than their passive siblings at equal or lower cost, while retaining the Critical-range spike that motivated the change.

### Keep the pair with the +2 damage but no +1B

Viable but deferred; retiring cleanly preserves room to redesign the action-versus-defence trade later without a lingering interim version.
