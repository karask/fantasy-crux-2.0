# Fantasy Crux player handbook

An independent editorial workspace for an **A5-format player handbook, printed
on A4 sheets cut in half and spiral bound**, plus A4 player reference cards.
It covers the core rules needed to play pregenerated characters.
The canonical website rules remain the source of truth.

The initial 23 rules drafts and cover remain available as content modules.
Their numbers are stable draft IDs, **not the final A5 pagination**. The current
handbook has **24 pages**, including its cover and two licence pages. Spiral
binding does not require a multiple of four.

## Current deliveries

The [complete A5 spiral handbook](a5/complete/README.md) contains **cover + 21
rules/reference pages + two licence pages**. It uses six A4 duplex sheets for
cut-and-stack printing. Editable page chunks, page images, the reading PDF and
the print PDF are in `a5/complete/`.

- [Complete reading PDF](a5/complete/output/pdf/fantasy-crux-player-handbook-v03-reading.pdf)
- [Complete A4 print PDF](a5/complete/output/pdf/fantasy-crux-player-handbook-v03-a4-cut-stack.pdf)
- [Approved three-page A4 player reference](reference-cards/output/pdf/fantasy-crux-player-reference-cards-v05.pdf)
- [Approved three-page A4 Shaping reference](shaping-reference-cards/README.md)
- [Final page/content map](a5/complete/CONTENT-MAP.md)

The 15 mm mirrored binding allowance and 11-point rules text remain. Check the
allowance against the actual punch before binding. The full edition is ready
for review; it has not been physically printed or punched here.

These editions include the paid Reaction to defend against an initial grapple.
Earlier handbook v01-v02 and reference v01-v04 PDFs/HTML/review records are
superseded historical snapshots, not current rules or published downloads.

## Preserved design prototypes

The preserved design candidate is a **two-page A5 ranged-combat spread**: Take the Shot
on the left, Cover & Defence on the right. It brings draft modules 14, 15, and 16
onto two smaller pages. Complete cover is a sentence, not a dedicated illustration.
The v02 spiral candidate keeps 11-point body text and reserves a mirrored
15 mm binding margin. This working allowance must be checked against the actual
punch or print shop's template. Its two pages are included in the complete edition.

- [A5 spread and print-proof guide](a5/README.md)
- [Current two-page preview](a5/review/ranged-spread-v02.png)
- [A5 reading PDF](a5/output/pdf/ranged-spread-v02-reading.pdf)
- [One-sheet A4 cut-and-stack spiral proof](a5/output/pdf/a4-cut-stack-v02.pdf)

Superseded v01 exports may remain in local generated-output folders for
comparison. They are not published; do not use the old folding proof for the
new cut-and-stack workflow.

The first A4 Terrain Cover prototype remains intact for comparison:

- [Page 15 review image](review/15-terrain-cover-v01.png)
- [Page 15 print-sized image](review/15-terrain-cover-v01-print.png)
- [Editable page text](pages/15-terrain-cover.md)
- [Prototype art brief and prompt](art/15-terrain-cover/BRIEF.md)
- [Visual direction](design/STYLE.md)
- [Verification and review notes](review/REVIEW.md)

## Content inventory (draft IDs, not final folios)

|  Page | Draft                                                                | Teaching question                                  |
| ----: | -------------------------------------------------------------------- | -------------------------------------------------- |
| Cover | [Player Handbook](cover.md)                                          | What is this booklet for?                          |
|    01 | [Read Your Character](pages/01-read-your-character.md)               | What do the numbers on my pregen mean?             |
|    02 | [Make a Skill Roll](pages/02-make-a-skill-roll.md)                   | How do I roll and recognise my result?             |
|    03 | [Bonus & Penalty Dice](pages/03-bonus-and-penalty-dice.md)           | Which dice do I roll and which result do I keep?   |
|    04 | [Competing & Helping](pages/04-competing-and-helping.md)             | How do we compete or work together?                |
|    05 | [Skills at a Glance](pages/05-skills-at-a-glance.md)                 | Which skill fits my approach?                      |
|    06 | [The Combat Round](pages/06-the-combat-round.md)                     | When do I act and what can I spend?                |
|    07 | [Attack, Dodge & Parry](pages/07-attack-dodge-and-parry.md)          | How do ordinary attacks and defences work?         |
|    08 | [Damage & Critical Hits](pages/08-damage-and-critical-hits.md)       | How much damage reaches my HP?                     |
|    09 | [Wounds & Dying](pages/09-wounds-and-dying.md)                       | What happens when I am badly hurt?                 |
|    10 | [Healing & Recovery](pages/10-healing-and-recovery.md)               | How do I save someone and help them recover?       |
|    11 | [Hero Points](pages/11-hero-points.md)                               | When can I change my fortunes?                     |
|    12 | [Off-Hand Options](pages/12-off-hand-options.md)                     | What can I do with my other hand?                  |
|    13 | [Grappling](pages/13-grappling.md)                                   | How do I hold someone or break free?               |
|    14 | [Ranged Attacks](pages/14-ranged-attacks.md)                         | How do range and aiming affect my shot?            |
|    15 | [Terrain Cover](pages/15-terrain-cover.md)                           | How does an obstacle protect the target?           |
|    16 | [Defending Against Missiles](pages/16-defending-against-missiles.md) | Can I Dodge or Parry that projectile?              |
|    17 | [Difficult Shots](pages/17-difficult-shots.md)                       | Which circumstances change my ranged test?         |
|    18 | [Movement & Charges](pages/18-movement-and-charges.md)               | What do speed, withdrawal, and a Charge cost?      |
|    19 | [Intimidate](pages/19-intimidate.md)                                 | Can I make the enemy surrender or flee?            |
|    20 | [Fighting Position](pages/20-fighting-position.md)                   | How do position and awareness affect melee?        |
|    21 | [Close Weapons](pages/21-close-weapons.md)                           | What are my weapon's properties?                   |
|    22 | [Ranged Weapons](pages/22-ranged-weapons.md)                         | What can I shoot or throw, and how do I reload?    |
|    23 | [Armour](pages/23-armour.md)                                         | What protection and burden does my armour provide? |

## Editing a page

Each numbered Markdown file has small editorial frontmatter: page, title,
section, teaching objective, suggested layout, and canonical source paths.
The body above `## Editorial notes` is the complete player-facing draft.
Everything below that heading is production guidance and must not appear in the
handbook. Examples in the player copy are deliberate teaching content.

Change copy here without modifying the main rules. Recheck its listed sources
when a mechanic changes. These drafts were first checked against repository
revision `1c2737102ed4217e71b98163efc8f8c69b9f82fc` on 6 September 2026.
Source references describe the rules being abridged, not permission to import
every subject from those files.

The complete A5 composition reads new condensed text from `a5/complete/content/`
and the existing ranged pair from `a5/content/`. Each
file records which source modules it covers. Edit the A5 typography and layout
in `a5/complete/`; keep the original modules for completeness checks and future reflow.
The older `render.mjs` and `design/page.css` reproduce only the preserved A4
prototype. Number new review versions instead of overwriting an approved design.

## Boundaries

Only weapons and armour use tables in the player copy. Skills use 24 brief
descriptions; procedures and comparisons use illustrated steps or callouts.
Ammunition is a short note on the ranged-weapon page.

Excluded: creation procedures and formulas, improvement, Power Points, Talents,
Shaping and other magic, creature profiles and abilities, GM material, gazetteer,
general gear/economy, mounted combat, light/darkness, encumbrance/fatigue systems,
travel, environmental hazards, poison/disease procedures, and attacking objects.
The common meaning of a skill may mention an excluded hazard without teaching
that hazard's subsystem. Descriptive character fields and spending Hero Points
are extracted from the creation chapter because they are used during play.

Ordinary Active Guard remains included. The passive **Shield Cover Talent** is
excluded. Pregenerated sheets must carry any special abilities needed to play
those characters; this booklet does not describe them. An orc can illustrate an
ordinary opponent without adding creature rules.

## Review and reproduction

From the repository root, using the existing installed dependencies:

```sh
node player-handbook/validate.mjs
node player-handbook/a5/complete/render.mjs v03
python3 -B player-handbook/a5/complete/assemble.py v03
node player-handbook/reference-cards/render.mjs v05
python3 -B player-handbook/a5/test_cut_stack.py
```

Rendering uses the existing Playwright/Chrome installation and local fonts.
The spiral-proof script uses ReportLab, pypdf, and pdfplumber; the bundled Python runtime is
documented in the A5 guide. The A5 PDFs retain selectable text and embedded fonts.
The self-contained HTML includes the font copyright notices and licence text.

The complete edition is ready for review of annotation clarity, actual-size
readability, density, and punch-safe margins. Its A4 PDF is the **complete
six-sheet print file**, not the old one-sheet proof. Follow the stack and cut
instructions in the complete guide; do not fold the sheets.

The repository's existing [licence](LICENSE.md) accompanies this workspace and
must accompany the eventual distributed handbook. If bound into the booklet,
legal pages count towards its physical page total. Keep all copyright notices.
