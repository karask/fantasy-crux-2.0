# Eight ready-to-play characters

Eight starting members of the **Last Wagon Company** for **Fantasy Crux 2.0 Beta**, expanding Mara, Pebb, Dori, Tamsin, and Ilen with three new companions. Read the [descriptions, personalities, backgrounds, and bonds](01-concepts.md) first, then choose a complete sheet below.

All characteristics and ages were chosen without rolling dice. Each PC uses the normal creation budgets and the **user-approved fixed starting allowance of 140 SP**. Every sheet displays every general skill, including low and untrained values, with named subjects, critical ranges, and a visible point ledger.

## Choose a character

| Complete sheet                   | Ancestry and role                           | Personality                                                                                 | Some strengths                                                                                   |
| -------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [Mara Holt](01-mara-holt.md)     | Human escort; shield protector              | Patient and practical; repairs other people's kit; can become too directive under pressure. | Close Combat 58%, Athletics 58%, Dodge 53%; Protector and Shield Cover.                          |
| [Pebb Dallow](02-pebb-dallow.md) | Goblin former forger; negotiator            | Cheerful, perceptive, exacting about paperwork; sometimes explains too much.                | Deception 61%, Influence 52%, Ranged Combat 61%; Silver Tongue and heat sense.                   |
| [Dori Ashlar](03-dori-ashlar.md) | Dwarf bridge-worker; engineer               | Deliberate and curious; listens while sketching; always wants one more measurement.         | Engineering 56%, Mechanisms 54%, Close Combat 56%; Earth Sense and Close-Quarters Knack.         |
| [Tamsin Reed](04-tamsin-reed.md) | Human healer; Flesh Shaper                  | Warm, direct, dryly funny; neglects her own exhaustion.                                     | Healing 56%, Shaping 62%, Close Combat 51%; bodily healing and diagnosis.                        |
| [Ilen Sedge](05-ilen-sedge.md)   | Human courier; runner and archer            | Curious, punctual, discreet; sometimes starts moving before the plan is settled.            | Perception 55%, Athletics 54%, Ranged Combat 59%; Quick Reflexes and Battle Awareness.           |
| [Orren Pike](06-orren-pike.md)   | Orc dockworker; rescuer and wrestler        | Courteous, literal, fond of terrible verse; takes on too much heavy work.                   | Athletics 59%, Sailing 51%, Close and Unarmed Combat 54%; Wrestler and Subdue.                   |
| [Seris Vale](07-seris-vale.md)   | Elf woodland guide; tracker                 | Watchful and wry; explains evidence plainly; distrusts convenient shortcuts.                | Natural Lore 54%, Deception 58%, Ranged Combat 60%; Tracker, Wayfinder, and Low-Light Sight.     |
| [Nera Quill](08-nera-quill.md)   | Human survey assistant; Force/Motion Shaper | Earnest and inquisitive; owns her mistakes; too eager to test a new idea.                   | Shaping 65%, Perception 50%, Mechanisms 46%; forced movement, climbing support, and force bolts. |

## What each sheet contains

**Printable example:** [Tamsin Reed - complete A4 PDF](../output/pdf/tamsin-reed-a4.pdf), two pages with her portrait, description, personality, acquired skills at their final values, Talent, spells, and equipment. Named Craft, Knowledge, Culture, and Language placeholders are omitted. Rules explanations and creation accounting are kept in the reference material. The licence is embedded as an attachment.

- Appearance, age, background, personality, loyalty, immediate goal, trusting bond, and a short roleplaying cue.
- All seven characteristics, HP, MWL, PP, Hero Points, damage modifier, Combat Order, Movement, armour, recovery, conditions, and cash.
- All 27 general-skill templates, expanded into 62 explicit nonmagical rows, plus Shaping or an explicit statement that it is unavailable. Each row shows base, pool allocation, IP increase, final percentage, and critical range.
- Required ancestry abilities and every purchased Talent, with their actual effects and prerequisites. Shapers have two exact cells, Practice, Tell, priced examples, casting limits, and universal magical actions.
- Weapons, damage including DM and applicable bonuses, requirements, ranges, shield restrictions, ready equipment, ammunition, tools, Healing Kit uses, and an itemised spending ledger.
- Exact characteristic, skill-pool, and IP accounting. No experience, extra Talents, or discounted equipment is hidden in the backgrounds.

The [shared play reference](02-play-reference.md) covers checks, actions, off-hand options, critical damage, wounds, treatment, and Hero Points. The [creation audit](03-creation-audit.md) shows the arithmetic across all eight PCs.

**One source gap remains explicit:** the rules give no ENC for provisions or coins. Both are recorded, and each sheet identifies its sum of published ENC values rather than silently inventing those missing weights. If the campaign assigns them a weight, recheck carrying capacity.

## Using the roster with The Lamp That Went Dark

The established four-PC choice remains **Mara, Pebb, Dori, and Tamsin**. Ilen is a straightforward fifth. The three new members are alternatives or additions chosen to suit the group; all helped during the flood and signed the same charter.

Everyone has Whitewater upbringing and own Language (River Crown), with fluent everyday speech. Their ancestry does not automatically teach a foreign culture or language. The shared promise is **nobody gets left behind**; none of the personal goals requires betraying another PC.

For three players, the existing **Pebb, Dori, and Tamsin** option preserves negotiation, engineering, close-combat defence, and treatment. Dori's Athletics is only 36%, so plan physical rescues with ropes, tools, and assistance. The [player brief](../adventures/the-lamp-that-went-dark/03-party-and-player-brief.md) gives the revised three-player bond.

The adventure supplies its shared rescue kit at the briefing. Those supplies are additional scene equipment and have not been copied into eight personal inventories. Encounter guidance still covers three to five PCs; the roster has been checked against creation rules, not playtested as an eight-PC encounter group.

## Editing and verification

Narrative concepts are authored in [01-concepts.md](01-concepts.md). Characteristics, allocations, purchased Talents, equipment, and magical examples are authored in [characters.json](characters.json). [build.mjs](build.mjs) reads those files and the canonical local rules, validates the builds, and generates the eight sheets and audit files:

```sh
node pregenerated-characters/build.mjs
npx prettier --write 'pregenerated-characters/**/*.{md,json,mjs}'
```

The generator verifies exact budgets, bounds, all base-skill formulas, ordinary versus converted IP, Talent prerequisites, weapon minimums, legal equipment packages, spending, ammunition capacity, and published ENC. [audit.json](audit.json) contains all 498 calculated skill rows. Regeneration overwrites the eight generated sheets and the two audit files; edit their authored sources instead.

The canonical rules remain in [src/content/rules](../src/content/rules). These are local character artifacts, outside the website's published rules collection. Rules text is Open Game Content under the accompanying [Open Game License](LICENSE.md), copied with its copyright notices from the repository's canonical licence.
