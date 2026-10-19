# Fantasy Crux Lite

A short, compatible version of Fantasy Crux 2.0 for conventions, one-shots and
Gamemasters who want the whole system in their heads. **Status: v03 draft for
review.** It is not on the website or the Downloads page.

- [Lite PDF, A4](output/pdf/fantasy-crux-lite-v03.pdf)
- [Review record](review/REVIEW-v03.md)
- [What Lite leaves out](MISSING.md)

## What it is

Thirteen A4 pages of rules plus the one-page Open Game License: about 6,400
words, a fifth of the full rules without the bestiary and gazetteer.

|  Page | Subject                                                               |
| ----: | --------------------------------------------------------------------- |
|     1 | Cover, what Lite is, what you need                                    |
|   2–3 | Play: tests, grades, dice, Hero Points; every common circumstance     |
|   4–5 | Characters, Improvement Points, Talents and gear                      |
|   6–7 | Combat: rounds, defence, damage, criticals; grapples, wounds, healing |
|   8–9 | Equipment; adventuring and hazards                                    |
| 10–11 | Shaping: cells, building, limits; outcomes, casting, defence          |
|    12 | Gamemaster: running tests, quick NPCs, creature rules                 |
|    13 | Creatures: 21 stat lines from the full bestiary                       |
|    14 | Open Game License 1.0a and copyright notices                          |

The system is already skill tests plus Bonus and Penalty dice. Lite leans into
that: the Circumstances page gathers the side rules into tables of dice, and
the rest of the book keeps only the procedures a table needs during play.

## Compatible with the full rules

Lite keeps every number the full rules use: characteristics, ancestry spreads
and maxima, attributes, Damage Modifier, all skill bases, every weapon and
armour profile, Parry Size, criticals, wounds, healing, travel, fatigue,
objects, Shaping limits and conjured beings. Full-rules characters, creatures
and adventures work unchanged, and every full-rules Talent can be bought at
its listed IP cost.

`render.mjs` enforces this. Before it prints anything, it compares Lite's
tables with the canonical rules in `src/content/rules/` (315 checks in v03) and
stops on any difference. Talent costs and requirements, ancestry ability costs
and the bestiary are generated from or checked against their source files.

### What Lite changes

These are presentation and scope decisions, listed so the full rules stay the
reference:

- **Character creation uses the full rules' Improvement Points.** Characters
  start with 10 IP, minus their ancestry's abilities, and can keep back skill
  points for more, as in the full rules. Shaping (20 IP) is therefore open at
  the start only to a human who trades 50 skill points.
- **A short Talent list.** Lite describes 20 Talents briefly, with their costs
  and requirements; Expertise stands for the six Talents that cancel a Penalty
  die.
- **Left out:** rituals, enchanting and enchanted items, the learned Shaping
  adjustments (Confluence, Trigger, Indirect, Selective, Veiled), Counter,
  calling beings, Spirit Combat and possession, mass combat, ships, plunder,
  epic characters, random characteristics, the other Talents, most creatures
  and most special cases. Lite points to the full rules for them;
  [MISSING.md](MISSING.md) lists everything left out.

## Format

**A4, recommended.** A5 suits a book read cover to cover; Lite is a reference a
GM consults mid-scene. A4 holds each subject on one page, keeps the weapon and
skill tables whole at 9.5–10 pt, prints at home on 14 single sheets without
imposition, and works as a convention handout. The pages use the approved
reference cards' stylesheet, so Lite matches the cards a table may already
use. An A5 edition can be made later from the same Markdown.

## Edit and rebuild

One Markdown file per page in `content/`. Frontmatter sets the title, subtitle,
running label, the section that starts the second column (`column_break`), any
full-width sections (`wide_top`, `wide_bottom`) and the full-rules `sources`.
The Creatures page lists bestiary creatures by slug, with an optional note.
`{{talent:slug}}` prints a Talent's cost and requirement from its rules file.

From the repository root:

```sh
node player-handbook/lite/render.mjs v03
python3 -B player-handbook/lite/verify.py v03
pdftoppm -r 100 -png player-handbook/lite/output/pdf/fantasy-crux-lite-v03.pdf player-handbook/lite/tmp/pdfs/lite-v03
```

The renderer fails on any rules difference, an unknown placeholder, overflow, text under 9.5 pt, a
footer gap under 4 mm, missing licence text, or an automated accessibility
violation. `verify.py` checks the PDF: complete text, A4 pages, embedded fonts
and one folio per page. Python needs pypdf and pdfplumber; the bundled
interpreter is named in `../a5/complete/README.md`. Use a new version number
for each review edition.

The Markdown is written to become a website section later: each page lists its
sources, and sections are self-contained.

## Art

The cover is `art/library/subjects/adventuring-company/styles/inked-adventure-comic-vivid.png`,
the same scene as the website's character-creation art, saved as `art/cover.jpg`.
