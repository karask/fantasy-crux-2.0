# Fantasy Crux Lite

A short, compatible version of Fantasy Crux 2.0 for conventions, one-shots and
Gamemasters who want the whole system in their heads. **Status: v01 draft for
review.** It is not on the website or the Downloads page.

- [Lite PDF, A4](output/pdf/fantasy-crux-lite-v01.pdf)
- [Review record](review/REVIEW-v01.md)

## What it is

Twelve A4 pages of rules plus the one-page Open Game License: about 5,900 words,
a fifth of the full rules without the bestiary and gazetteer.

|  Page | Subject                                                               |
| ----: | --------------------------------------------------------------------- |
|     1 | Cover, what Lite is, what you need                                    |
|   2–3 | Play: tests, grades, dice, Hero Points; every common circumstance     |
|   4–5 | Characters, edges, starting gear and growth                           |
|   6–7 | Combat: rounds, defence, damage, criticals; grapples, wounds, healing |
|   8–9 | Equipment; adventuring and hazards                                    |
| 10–11 | Shaping: cells, building, limits; outcomes, casting, defence          |
|    12 | Gamemaster: running tests, quick NPCs, morale, ten creatures          |
|    13 | Open Game License 1.0a and copyright notices                          |

The system is already skill tests plus Bonus and Penalty dice. Lite leans into
that: the Circumstances page gathers the side rules into tables of dice, and
the rest of the book keeps only the procedures a table needs during play.

## Compatible with the full rules

Lite keeps every number the full rules use: characteristics, ancestry spreads
and maxima, attributes, Damage Modifier, all skill bases, every weapon and
armour profile, Parry Size, criticals, wounds, healing, travel, fatigue,
objects, Shaping limits and conjured beings. Full-rules characters, creatures
and adventures work unchanged, and full-rules Talents can be bought at their
listed IP cost.

`render.mjs` enforces this. Before it prints anything, it compares Lite's
tables with the canonical rules in `src/content/rules/` (282 checks in v01) and
stops on any difference. The bestiary is generated from the creature profiles.

### What Lite changes

These are presentation and scope decisions, listed so the full rules stay the
reference:

- **Edges replace starting Talents.** Characters choose two edges, three for a
  human. The 20 edges are full-rules Talents in one line each, without their
  prerequisites; Expertise stands for the six Talents that cancel a Penalty
  die. A new edge costs 3 IP, close to the Talents' average cost.
- **Ancestry abilities come free.** In the full rules, nonhumans pay for them
  from their 10 starting IP; in Lite, humans get the extra edge instead.
- **Starting as a Shaper** stays as costly as in the full rules: only a human
  can, using all three edges and 50 fewer skill points. That mirrors the full
  rules, where only a human can raise the 20 IP at creation.
- **No starting IP or point trading.** Growth after play uses the full rules'
  IP costs.
- **Left out:** rituals, enchanting and enchanted items, the learned Shaping
  adjustments (Confluence, Trigger, Indirect, Selective, Veiled), Counter,
  calling beings, Spirit Combat and possession, mass combat, ships, plunder,
  epic characters, random characteristics, and most special cases. Lite points
  to the full rules for them.

## Format

**A4, recommended.** A5 suits a book read cover to cover; Lite is a reference a
GM consults mid-scene. A4 holds each subject on one page, keeps the weapon and
skill tables whole at 9.5–10 pt, prints at home on 13 single sheets without
imposition, and works as a convention handout. The pages use the approved
reference cards' stylesheet, so Lite matches the cards a table may already
use. An A5 edition can be made later from the same Markdown.

## Edit and rebuild

One Markdown file per page in `content/`. Frontmatter sets the title, subtitle,
running label, the section that starts the second column (`column_break`), any
full-width sections (`wide_top`, `wide_bottom`) and the full-rules `sources`.
The Gamemaster page lists bestiary creatures by slug, with an optional note.

From the repository root:

```sh
node player-handbook/lite/render.mjs v01
python3 -B player-handbook/lite/verify.py v01
pdftoppm -r 100 -png player-handbook/lite/output/pdf/fantasy-crux-lite-v01.pdf player-handbook/lite/tmp/pdfs/lite-v01
```

The renderer fails on any rules difference, overflow, text under 9.5 pt, a
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
