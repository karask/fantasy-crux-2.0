# Handbook v06 review

Date: 25 November 2026. Status: **ready for user review**, not published and not
physically print-and-punch tested. v05 is preserved unchanged.

## What changed since v05

v05 had left some website rules to the Gamemaster. At the author's request, v06
adds them to the handbook, worded from the website rules. No mechanic changed.

| Page | Rule added                                                                                                                                                                                | Website source                          |
| ---: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
|   19 | Mounted combat: +1B to the rider, -1P to the foe's Reactions, the height and weapon-Size exceptions, the mount's Movement and lance DM, Riding caps weapon skill, mounts unused to battle | `combat/position-and-mounted-combat.md` |
|   20 | Grappling: a successful weapon Parry that wins deals 1 HP ignoring AP; a second committed limb gives +1B                                                                                  | `combat/grappling.md`                   |
|   23 | Ranged modifiers: high wind -1P, fierce wind -3P, hurricane fails; a prone attacker -2P (replaces "check with the GM")                                                                    | `combat/ranged-combat.md`               |
|   24 | New page: Intimidate in full, with the group roll, the enemy-condition modifier table and the language note                                                                               | `combat/rounds-and-actions.md`          |
|   25 | Talk, Trade & Go Unnoticed keeps persuasion, trade and stealth; Intimidate moved to page 24                                                                                               |                                         |

Darkness in melee was already covered by the Light page (-1P, -2P, Close attacks
-3P in pitch black).

The new page moves every later page by one: 67 player pages plus two licence
pages, 69 in all, on 18 A4 sheets (the back of the last leaf is blank).
Cross-references are resolved automatically.

## Checks

`render.mjs v06`, `verify.mjs v06`, `assemble.py v06` and `test_cut_stack.py` pass:
no overflow, footer gap at least 2 mm, 11 pt body and 10 pt tables, binding
clearance, all player text present in the PDF, full licence, every cut-and-stack
slot. Pages 19 to 26 were inspected visually.
