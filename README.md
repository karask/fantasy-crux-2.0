# Fantasy Crux 2.0 Beta

Fantasy Crux 2.0 Beta is a fantasy RPG rules set. Its canonical source is portable Markdown, rendered as the responsive **Cold Iron** static website. The current playtest rules cover character creation, skills, equipment, combat, adventuring, 51 optional Talents, freeform Shaping magic, Gamemaster tools, and a 57-profile bestiary.

A more compact "Lite" edition is planned separately; this repository is the full 2.0 Beta ruleset.

Shaping is the canonical Magic system and is published as seven searchable sections of the single-page Magic chapter. The alternative Magic 2.0 system remains preserved in `freeform-magic/FC-magic-potential-2.md` as an unpublished design document.

The rules text is Open Game Content. The copy of the Open Game License that Section 10 requires lives in [`src/license.md`](src/license.md), publishes at `/license/`, and is linked from the footer of every page.

## Quick start

Requires Node.js 24.16 and npm 11.13. The complete browser test suite also requires Google Chrome.

```shell
npm install
npm run dev
```

Eleventy serves the development site. For the production output:

```shell
npm run build
npm run preview
```

## Commands

| Command                    | Purpose                                                                                         |
| -------------------------- | ----------------------------------------------------------------------------------------------- |
| `npm run dev`              | Run Eleventy and keep the Pagefind index current in watch mode                                  |
| `npm run build`            | Validate content, build the site and Pagefind index, then assert required routes                |
| `npm run check`            | Run `check:deploy` plus the formatting check                                                    |
| `npm run check:deploy`     | Run Markdown, unit, build, HTML, link, and real-browser checks; the pre-push gate               |
| `npm run check:ci`         | Run every check except the real-browser suite, in about ten seconds; what GitHub runs           |
| `npm run hooks:install`    | Point git at `.githooks/`; `npm install` already does this                                      |
| `npm run test:unit`        | Test schema and locked rules/content contracts                                                  |
| `npm run test:browser`     | Rebuild, then test Chrome at 320, 390, 768, and 1440 pixels, including JS-off and accessibility |
| `npm run validate:content` | Validate strict frontmatter, stable IDs, and unique routes                                      |

## Project structure

- `src/content/rules/` — canonical Markdown rules, Talent, and creature records
- `src/license.md` — the Open Game License and its copyright notices; deliberately outside the rules tree because it is legal text, not a rules chapter
- `src/_includes/` — Nunjucks page layouts
- `src/assets/` — the Cold Iron CSS, progressive-enhancement JavaScript, and brand mark
- `src/lib/` — content schema and executable rules contracts
- `tests/` — unit/content contracts and real-browser checks
- `art/library/` — canonical artwork, Vivid Ink production guidance, source manifests, and the illustration programme
- `art/archive/` — historical art prompts and provenance retained for reference, not used by the website build
- `art/review/` — temporary workspace for candidates awaiting an explicit approval decision
- `tex/` — retained reference material for Disciplines, Battle, and the Folk, Arcane, Divine, and Shamanism magic systems. These chapters are not part of the 2.0 Beta conversion backlog, but may be consulted later. Everything already published was removed; recover it with `git show 040db44:tex/<file>` if a comparison with the original is ever needed
- `freeform-magic/` — preserved Magic 2.0 alternative; not published
- `freeform-creatures/` — preserved conversion source used to verify the published bestiary's traceability
- `potential-worlds/` — unpublished, noncanonical setting candidates; compare them in the [candidate-world index](potential-worlds/README.md)

Each chapter is one page: its rules, Talents, Shaping, and creature sections are inlined and addressed by anchor, such as `/rules/combat/#active-guard` or `/rules/creatures/#vampire`. Individual rule sections are still the search units: each result links to the best-matching heading inside its rule, names that heading, and cites the rule it belongs to. Because Pagefind scores whole chapter pages, results are reordered by each rule's own strongest match. Chapter introductions and Search are excluded from the Pagefind index. Core reading and navigation work without JavaScript; search, the Talent and creature filters, and collapsible examples are enhancements.

The default build targets an origin root. To deploy under a subpath, set `FANTASY_CRUX_PATH_PREFIX` to that path before building; the HTML, assets, and search loader are path-prefix aware.

## Editing rules

Add or change rules in `src/content/rules/`. Keep frontmatter within the strict schemas in `src/lib/content-schema.mjs`; the validator rejects unknown keys, malformed IDs, duplicate IDs, and duplicate URLs. Markdown may use headings, lists, tables, definition lists, footnotes, and explicit heading IDs, but not raw HTML or MDX.

Creature profiles keep their stat block in frontmatter — category, tags, characteristics, derived attributes, skills, attacks, and Talents — so the layout can render stat grids and the contracts can check the formulas against typed values. Only abilities are Markdown body. Add a thumbnail by setting `image` on a profile; without one the layout draws a placeholder frame.

Creature Plunder Ratings were converted from the original LaTeX creature chapter, which the compendium never carried; the approved table is frozen in `tests/unit/creature-and-shaping-contract.test.mjs`. Most characteristics also carry `characteristicDice`, the die each average was generated from (`4D6` under `STR 14`), for rolling a specific individual or a varied group instead of reusing the average member; a characteristic with nothing to roll is simply omitted. Nine dice formulas in the original LaTeX do not arithmetically match their own stated average — see [ADR-005](docs/decisions/005-restore-creature-characteristic-dice.md) for the list — and ship as authored rather than silently corrected.

Run `npm run check` before treating a change as complete. A `pre-push` hook in `.githooks/` runs `npm run check:deploy` for you and refuses a push that fails it; `npm install` enables the hook by setting `core.hooksPath`, and `git push --no-verify` bypasses it. GitHub runs only `npm run check:ci` on the deploy path — see [ADR-009](docs/decisions/009-run-browser-checks-before-push.md). The content contract also protects the 51-Talent catalogue, the seven-section Shaping chapter, the 57 approved creature profiles and their traceability to `freeform-creatures/`, the approved plunder ratings and characteristic dice, the complete Open Game License, the preserved Magic 2.0 alternative, and the no-image phase boundary for rules prose. Keep rules concise and easy to scan, but prefer clarity and complete procedures over any numeric word or character limit; none is enforced.

Run `npm run audit:talents` to verify that the generated probability and pricing audit still matches the published Talent catalogue and creature armour profiles.

The rationale for the Markdown-first static architecture is recorded in [ADR-001](docs/decisions/001-markdown-first-static-rules.md); the selection and publication of Shaping is recorded in [ADR-002](docs/decisions/002-publish-shaping-magic.md); publishing the bestiary is recorded in [ADR-003](docs/decisions/003-publish-creature-compendium.md); the Gamemaster tools and licence are recorded in [ADR-004](docs/decisions/004-publish-gamemaster-tools-and-license.md); restoring characteristic dice ranges is recorded in [ADR-005](docs/decisions/005-restore-creature-characteristic-dice.md); replacing the original Grounded Painterly study with the published Vivid Ink illustration system is recorded in [ADR-014](docs/decisions/014-adopt-vivid-ink-production-art.md); replacing numeric copy ceilings with editorial review is recorded in [ADR-008](docs/decisions/008-replace-copy-ceilings-with-editorial-review.md); moving the real-browser checks off the deploy path is recorded in [ADR-009](docs/decisions/009-run-browser-checks-before-push.md); choosing Bonus and Penalty dice by outcome is recorded in [ADR-010](docs/decisions/010-choose-modifier-dice-by-outcome.md); the probability-based Talent rebalance is recorded in [ADR-011](docs/decisions/011-rebalance-talents-and-advancement.md); retiring Committed Strike and Deadeye in favour of the skill Expertise Talents is recorded in [ADR-012](docs/decisions/012-retire-committed-strike-and-deadeye.md); and the minimum `01` critical range is recorded in [ADR-013](docs/decisions/013-minimum-critical-range.md).

## Art direction

**Vivid Inked Adventure Comic** is the active and website-published illustration style. The [canonical art library](art/library/README.md) contains its production guide, visual anchor, subject briefs, recurring cast references, and approved masters. Four inactive rendering systems retain a detailed guide and one visual anchor each so they can be recreated without being mistaken for production sources.

The published programme comprises one homepage scene, 28 chapter illustrations, and portraits for all 57 creature profiles. Source masters live in `art/library/`; optimized files under `src/assets/images/` are generated website derivatives. The production decision is recorded in [ADR-014](docs/decisions/014-adopt-vivid-ink-production-art.md), which supersedes the earlier Grounded Painterly study decision in [ADR-006](docs/decisions/006-adopt-grounded-painterly-fantasy-art-direction.md).

## Ongoing work

- Refine Shaping through playtesting while preserving its stable rule IDs and URLs.
- Evaluate the unpublished setting candidates separately from the canonical rules.
