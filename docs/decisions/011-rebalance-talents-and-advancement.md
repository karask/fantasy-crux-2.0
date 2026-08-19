# ADR-011: Rebalance Talents and advancement from exact probabilities

## Status

Accepted

## Date

2026-08-19

## Context

The Talent catalogue had grown by local comparison rather than one shared pricing method. Several options were clear and well priced, but others depended on incomplete base procedures. Grappling let either participant release freely, making escape and Wrestler largely irrelevant. Point-Blank Shot contradicted the core engagement penalty. Sure Hand either repeated the instruction not to roll routine work or bypassed an undefined difficulty. Enchanter had no production limit. Player Mastery also served as the conversion for creature skills above 100%, although the two uses no longer wanted the same design.

Two executable contracts had drifted from the canonical prose. Skill improvement granted only `+1%` above 75% in code, rather than the published `+3%`, and two-hour Power Point recovery rounded upward instead of using the core rounding rule. Both materially changed the opportunity cost of Talents and Shaping.

The audit therefore needed exact probabilities, explicit action and resource costs, and complete base procedures before prices could be compared. Its reproducible calculations and catalogue findings live in [the Talent balance audit](../design/talent-balance-audit.md).

## Decision

### Price by marginal value

Use these normal bands. A prerequisite controls access; it is not a discount.

- **2 IP:** narrow permission or conditional reliability.
- **3 IP:** a reusable technique or passive benefit in one domain.
- **4 IP:** a broad, reliable, or encounter-shaping benefit, including a substantially bounded action multiplier.
- **5 IP:** a peak capstone or less-bounded action multiplier.
- **10 IP:** access to a bounded campaign subsystem.
- **20 IP:** access to a full character subsystem.

Check each Talent for frequency, breadth, persistence, party reach, action or Reaction cost, and multiplicative combinations. Validate the result against exact D100 and damage probabilities and against a whole character's advancement budget. Award **3–5 IP per adventure** as the practical pace: 3 for modest progress, 4 for a completed adventure, and 5 for a major achievement.

The complete catalogue was reviewed under this method. Rapid Shot rises from 3 to 4 IP. Point-Blank Shot rises from 2 to 3 IP and ignores one engaged enemy's whole `-2P`, not one die from every enemy. Rally remains 4 IP but benefits two allies. Off-Hand Mastery remains 5 IP, and Favoured Weapon and Signature Weapon remain 3 and 4 IP. Sure Hand is retired. All other prices remain unchanged.

### Make Grapple useful without Wrestler

A grapple has one controller and one held participant. Establishing it requires an adjacent opposed test and a committed usable limb. The controller alone may release freely; the held participant spends a Combat Action and wins an opposed Unarmed Combat test to escape. Both participants lose Movement, suffer `-1P`, and have restricted attacks and Parries.

A second limb may be committed before establishment and grants `+1B` on the participant's grapple contests. Helpers use ordinary combined Assistance and never become a second controller. Size, anatomy, and footing use bounded situational modifiers or make the attempt impossible. A target who wins establishment with a successful weapon Parry deals the attacker 1 HP ignoring AP. Wrestler remains a 2 IP extension for damaging holds, forced drops, and throws; it is useful but no longer required for a base grapple to matter.

### Separate player expertise from creature scale

The immutable `talent.mastery` record becomes **Weapon Expertise**, a 4 IP Talent requiring the relevant Close or Ranged Combat skill at 76%. Choose one exact weapon type. Once per character per round, declare one eligible attack, Parry, Active Guard, or Opportunity Attack before rolling; after cancellation and before the cap, remove one remaining Penalty die. Rapid Shot and every off-hand-generated test are excluded. The Talent never creates a Bonus die and may be bought again only for another weapon type.

Creatures instead use **Exceptional Skill (skill) I–III**. Its ranks preserve the published conversion—101–125 becomes I, 126–150 becomes II, and 151+ becomes III—and remove that many remaining Penalty dice after cancellation. Published ranks are migrated without recomputation, including the Dragon's Multiattack interaction.

The canonical Talent fragment is `#weapon-expertise`. The old `#mastery` and `#mastery--effect` fragments remain invisible compatibility anchors. Retiring Sure Hand leaves compatible `#sure-hand` and `#sure-hand--effect` fragments at the Talent chapter without publishing a migration card.

### Keep Shaping investment visible

Shaping remains a 20 IP subsystem. A starting Shaper declares and reserves the purchase before allocating skills, then may place up to 30 Knowledge points into the `INT + POW` Shaping skill. The character still has to assemble and pay all 20 IP.

Additional outcomes remain a Magnitude cost, not another Talent. Price every outcome at its own lowest applicable Intensity, sum those Intensities, and count shared Range, Duration, and Reach once. Each Projected outcome uses its own Intensity for Impact Size; Backlash uses the Shaping's highest outcome Intensity. Direct Harm and the existing Selective, Indirect, Trigger, and Veiled adjustments remain unchanged.

Enchanter remains 10 IP but gains Enchantment Capacity equal to permanent, unmodified POW. Bound Magnitude moves out of both PP commitment and active total. Every extant bound Shaping and unused charge or consumable counts its full final Magnitude against its original creator. Transfers and helpers do not reset attribution; every creation, restoration, or increase must fit. Capacity returns only when the enchantment permanently ends or a charge is used.

### Complete the procedures that Talents modify

Uncertain travel receives one Natural Lore navigation test per day or material route change, allowing Wayfinder to downgrade a Fumble. Cutpurse now compresses a defined one-minute ordinary attempt. Weak Point requires ten minutes, access, quiet, and Engineering. Alchemical fire and smeared poison receive complete attack, application, expiry, and repeated-exposure rules.

Ambusher excludes Shaping; Iron Fist and Master Brawler do not overwrite listed natural weapons; Subdue uses listed damage and Damage Modifier rather than Talent damage; Steady Casting removes one total named-source Penalty die; Disarm cannot release fixed or impossible items. Talent metadata now separates purchase prerequisites from equipment needed to use the Talent.

Define a scene and a common reroll timing. A test can be rerolled at most once, after its result but before consequences, costs, or Backlash, and the new result stands. A character cannot choose an option that forfeits an Action or Reaction already used incompatibly.

Finally, align the executable contracts with canonical advancement: 1 IP grants `+5%` at 0–50%, `+3%` at 51–99%, and nothing at 100%. Each complete two-hour PP recovery period uses normal rounding; eight hours still restores all PP.

## Consequences

- The player catalogue contains 50 Talents with a documented pricing baseline.
- Base Grapple creates an action and positioning tradeoff; Wrestler adds outcomes instead of repairing the core action.
- Weapon Expertise expresses high-skill reliability without erasing the explicit prices on Rapid Shot or off-hand options.
- Creature competence remains unchanged while no longer defining a broad player Talent.
- A starting Shaper can be playable immediately only by sacrificing Knowledge points as well as the 20 IP access cost.
- Enchanter is a finite production subsystem rather than an unlimited downtime factory.
- Old Talent bookmarks continue to resolve, while search and new links use canonical names.

This decision supersedes ADR-002 only where that record names an 8 IP Shaping reservation, ADR-003 only where it shares Mastery between players and creatures, and ADR-007 only where it records the then-current 49-Talent count. Their other decisions remain in force.

## Alternatives considered

### Reprice only the obvious outliers

Rejected because several apparent price problems were actually missing or contradictory base procedures. Pricing an undefined effect would only hide the problem.

### Make Wrestler necessary to maintain a grapple

Rejected because a core combat option should exchange actions and position meaningfully without a Talent. Wrestler should add advanced outcomes.

### Keep broad player Mastery

Rejected because one purchase applied to every use of a skill, overlapped cheaper source-specific Talents, and was also carrying a separate creature-conversion purpose.

### Add a Talent for multiple Shaping outcomes

Rejected because each outcome already pays its own Intensity and quickly pushes combinations into overreach or ritual play. A second gate would charge twice for the same flexibility.

### Lower the 20 IP Shaping access cost

Rejected because dedication is intentional. Allowing Knowledge allocation makes that investment playable without reducing it.
