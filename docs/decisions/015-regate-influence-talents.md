# ADR-015: Regate Silver Tongue and add Commanding Presence

## Status

Accepted

## Date

2026-08-20

## Context

Silver Tongue was the catalogue's only 76%-gated social Talent, and its 3 IP bought a once-per-scene reroll of a failed Influence test. Two problems followed. The gate sat a full skill tier above every other single-skill utility Talent, so a social character reached it long after martial and survival characters reached their equivalents. The reroll also read as a different kind of benefit from the rest of the skill catalogue, where Tracker, Wayfinder, and the Expertise Talents all trade in residual Penalty dice.

Influence names four applications — persuade, bargain, command, intimidate — and Silver Tongue's fiction covered only the first two: it required time to talk rather than press and explicitly excluded Influence used as a threat. Nothing supported the press half. Rally spends an Action to hand allies a Bonus die and Tactician governs mass combat, so neither helps a command or intimidation test.

## Decision

- **Regate Silver Tongue to Influence 51% and price it at 2 IP.** After ordinary Bonus and Penalty cancellation, but before the final dice cap, remove up to 1 remaining Penalty die from Influence tests to persuade or bargain. It keeps its existing fiction limits: time to talk rather than press, a willing audience, and never Influence used as a threat. The once-per-scene reroll is withdrawn.
- **Add Commanding Presence, 2 IP, Influence 51%, passive.** The same removal for Influence tests to command or threaten, bounded by a target who can make the character out and who has something to lose. It states that it applies to the Intimidate Combat Action but never alters the enemy's condition modifiers, which sit on the target's resisting Persistence roll rather than the character's Influence roll.
- **The catalogue moves to 52 Talents.**

## Consequences

- Influence is fully covered at 51% for 4 IP across two Talents. Deception costs 10 IP for the same coverage through five Expertise picks, so Influence is now the cheapest skill to de-penalise; the fiction conditions each Talent carries, which the Expertise Talents do not, are what pays for the difference. Watch this in play.
- Neither Talent touches the Intimidate action's condition table, so the combat surrender and rout procedure is unchanged.
- This is a bounded exception to ADR-012's preference for one shared choose-a-specialty Talent per skill. Influence divides on fiction rather than on a specialty menu — talking versus pressing — and Silver Tongue's exclusion clause already drew that line. Two named Talents keep the established name and let each carry its own conditions, where an `Influence Expertise (Intimidation)` pick could not.
- The frozen title list, the audit assessments and published counts, and the browser filter expectations are updated together.

## Alternatives considered

### Keep the reroll and only lower the gate

Rejected: the mismatch with every other skill Talent's benefit was the second half of the complaint, and a reroll at 51% is worth more than the same reroll at 76% because more tests fail.

### Rename to Influence Expertise and follow the choose-one-application pattern

Rejected: it matches ADR-012 exactly but retires a distinctive name for a menu pick, and `Silver Tongue (Intimidation)` reads against the name's fiction.

### Extend Silver Tongue to every Influence test at 3 IP

Viable, and the simplest to read, but it would be the broadest single-skill penalty remover in the catalogue and would leave the persuade/press distinction unexpressed.
