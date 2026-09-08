# Creation audit

All eight builds pass the checks in [build.mjs](build.mjs), using [characters.json](characters.json) and the canonical local Markdown rules. Run `node pregenerated-characters/build.mjs` from the repository root to regenerate and recheck. Source baseline: `1c27371`; the script reads the current local rules when run.

## Character and resource totals

| PC          | Characteristic total | HP / MWL | PP  | Active M | DM   | Order | Move | Capacity / listed ENC | Spent / cash left        |
| ----------- | -------------------- | -------- | --- | -------- | ---- | ----- | ---- | --------------------- | ------------------------ |
| Mara Holt   | 86                   | 14 / 7   | 10  | 11       | +1D4 | 9     | 15 m | 29 / 18               | 66 SP / 74 SP            |
| Pebb Dallow | 86                   | 9 / 5    | 12  | 15       | +0   | 13    | 15 m | 16 / 13               | 132 SP 5 CP / 7 SP 5 CP  |
| Dori Ashlar | 86                   | 12 / 6   | 11  | 16       | +0   | 12    | 12 m | 22 / 20               | 133 SP / 7 SP            |
| Tamsin Reed | 86                   | 11 / 6   | 16  | 16       | +0   | 11    | 15 m | 19 / 16               | 113 SP 5 CP / 26 SP 5 CP |
| Ilen Sedge  | 86                   | 11 / 6   | 12  | 13       | +0   | 14    | 15 m | 23 / 16               | 115 SP / 25 SP           |
| Orren Pike  | 86                   | 14 / 7   | 10  | 9        | +1D6 | 8     | 15 m | 32 / 19               | 122 SP / 18 SP           |
| Seris Vale  | 86                   | 10 / 5   | 14  | 14       | +0   | 12    | 15 m | 22 / 16               | 112 SP / 28 SP           |
| Nerin Quill  | 86                   | 10 / 5   | 17  | 18       | +0   | 13    | 15 m | 18 / 16               | 113 SP 5 CP / 26 SP 5 CP |

## IP totals

| PC          | Ordinary | Converted | Required ancestry | Talents | Skill IP | Unspent |
| ----------- | -------- | --------- | ----------------- | ------- | -------- | ------- |
| Mara Holt   | 10       | 0         | 0                 | 10      | 0        | 0       |
| Pebb Dallow | 10       | 0         | 5                 | 4       | 1        | 0       |
| Dori Ashlar | 10       | 0         | 7                 | 2       | 1        | 0       |
| Tamsin Reed | 10       | 10        | 0                 | 20      | 0        | 0       |
| Ilen Sedge  | 10       | 0         | 0                 | 10      | 0        | 0       |
| Orren Pike  | 10       | 0         | 4                 | 5       | 1        | 0       |
| Seris Vale  | 10       | 0         | 5                 | 4       | 1        | 0       |
| Nerin Quill  | 10       | 10        | 0                 | 20      | 0        | 0       |

Both Shapers reserve 20 IP before Knowledge allocation. Each converts 15 Resistance, 15 Combat, and 20 Practical points into 3 + 3 + 4 IP, then spends the ordinary 10 IP as well. Knowledge remains 50; 30 goes to Shaping and 20 to own Lore. Neither has spare IP or an unbought magical Talent. Nonhumans pay mandatory ancestry costs from the ordinary 10 IP. All skill improvements use ordinary IP; no converted IP raises a skill. No characteristic is improved with IP.

## Completeness and bounds

Every sheet displays all 27 canonical general-skill templates, expanded into 62 nonmagical rows, including all nine gazetteer cultures and languages, all common Lore fields, the roster's additional Lore subjects, Craft subjects, and explicit bases for another named subject. Shapers add their Shaping row; non-Shapers explicitly show it as unavailable. These are subject-specific bases, not free training or shared specialist skills.

All category pools are spent exactly. No skill receives more than 30 total points above its base even when an ordinary-IP improvement is included; no skill exceeds 100%. Each skill improved with IP is improved once and gains +5 at 0–50% or +3 at 51–99%. All Talent prerequisites and ancestry costs are checked. All weapons meet STR and DEX minimums. Characteristic, HP, MWL, Combat Order, DM, PP recovery, Active Magnitude, money, ammunition, and published ENC calculations are generated from fixed inputs. Critical ranges use floor(skill / 10), minimum 01.

## Explicit decisions and source gaps

- **User-approved exception:** fixed 140 SP per character replaces the money roll. Characteristics and ages are chosen, not rolled; the only dice printed on sheets describe future play. Purchases use the ordinary equipment lists and start fully paid.
- **Nonhuman Movement:** the Dwarf profile supplies 12 m; the Goblin, Orc, and Elf profiles supply 15 m. Only Movement is taken from those profiles; PCs use player creation budgets, paid ancestry abilities, and calculated player skills.
- **Unspecified ENC:** the free 14 days of provisions and remaining coins are recorded, but the rules give neither a numerical ENC nor an explicit negligible-item mark for them. The sheets label their load as the sum of published ENC values and identify this gap; they do not assign a new weight or claim a fully specified total. A later campaign ruling on food or coin weight requires rechecking loads.
- **Equipment details:** mundane clothing and cosmetic appearance do not create extra priced gear. Tamsin's Practice uses a washed part of her issued rope. Spell examples are priced uses of known cells, not free additional cells or items.
- **Starting status:** full HP and PP, 2 Hero Points, no conditions, active effects, enchantments, committed PP, ammunition expenditure, or used Healing Kits. Prior company errands grant no advancement. Briefing rescue supplies remain shared adventure equipment and are not duplicated on personal sheets.
- **No playtest claim:** this is an arithmetic and rules check. The adventure remains written for three to five players, selecting from this roster; it has not been balanced or playtested for all eight at once.

Machine-readable results, including every skill calculation, are in [audit.json](audit.json).
