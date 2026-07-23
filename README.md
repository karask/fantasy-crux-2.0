# Fantasy Crux Lite

Fantasy Crux Lite is the compact rules edition of Fantasy Crux. Its canonical source is portable Markdown, rendered as the responsive **Cold Iron** static website. The current rules cover character creation, skills, equipment, combat, adventuring, 17 optional Talents, freeform Shaping magic, Gamemaster tools, and a 57-profile bestiary.

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
| `npm run check`            | Run formatting, Markdown, unit, build, HTML, link, and real-browser checks                      |
| `npm run test:unit`        | Test schema and locked rules/content contracts                                                  |
| `npm run test:browser`     | Rebuild, then test Chrome at 320, 390, 768, and 1440 pixels, including JS-off and accessibility |
| `npm run validate:content` | Validate strict frontmatter, stable IDs, and unique routes                                      |

## Project structure

- `src/content/rules/` — canonical Markdown rules, Talent, and creature records
- `src/license.md` — the Open Game License and its copyright notices; deliberately outside the rules tree so it is neither a chapter nor part of the visible-copy budget
- `src/_includes/` — Nunjucks page layouts
- `src/assets/` — the Cold Iron CSS, progressive-enhancement JavaScript, and brand mark
- `src/lib/` — content schema and executable rules contracts
- `tests/` — unit/content contracts and real-browser checks
- `tex/` — the LaTeX chapters with no Lite form yet: Disciplines, Battle, and the Folk, Arcane, Divine, and Shamanism magic systems. Everything already published was removed; recover it with `git show 040db44:tex/<file>` if a conversion ever needs checking against the original
- `freeform-magic/` — preserved Magic 2.0 alternative; not published
- `freeform-creatures/` — preserved drafting source for the published bestiary

Each chapter is one page: its rules, Talents, Shaping, and creature sections are inlined and addressed by anchor, such as `/rules/combat/#active-guard` or `/rules/creatures/#vampire`. Individual rule sections are still the search units, and results link to the matching anchor. Chapter introductions, Quick Reference, and Search are excluded from the Pagefind index. Core reading and navigation work without JavaScript; search, the Talent and creature filters, and collapsible examples are enhancements.

The default build targets an origin root. To deploy under a subpath, set `FANTASY_CRUX_PATH_PREFIX` to that path before building; the HTML, assets, and search loader are path-prefix aware.

## Editing rules

Add or change rules in `src/content/rules/`. Keep frontmatter within the strict schemas in `src/lib/content-schema.mjs`; the validator rejects unknown keys, malformed IDs, duplicate IDs, and duplicate URLs. Markdown may use headings, lists, tables, definition lists, footnotes, and explicit heading IDs, but not raw HTML or MDX.

Creature profiles keep their stat block in frontmatter — category, tags, characteristics, derived attributes, skills, attacks, and Talents — so the layout can render stat grids and the contracts can check the Lite formulas against typed values. Only abilities are Markdown body. Add a thumbnail by setting `image` on a profile; without one the layout draws a placeholder frame.

Creature Plunder Ratings were converted from the original LaTeX creature chapter, which the compendium never carried; the approved table is frozen in `tests/unit/creature-and-shaping-contract.test.mjs`.

Run `npm run check` before treating a change as complete. The content contract also protects the 17-Talent catalogue, the seven-section Shaping chapter, the 57 approved creature profiles and their traceability to `freeform-creatures/`, the approved plunder ratings, the completeness of the Open Game License, the preserved Magic 2.0 alternative, the no-image phase boundary for rules prose, and the visible-copy ceilings: 16,250 words of rules, 4,500 of bestiary, and 4,000 of Gamemaster tools.

The rationale for the Markdown-first static architecture is recorded in [ADR-001](docs/decisions/001-markdown-first-static-rules.md); the selection and publication of Shaping is recorded in [ADR-002](docs/decisions/002-publish-shaping-magic.md); publishing the bestiary is recorded in [ADR-003](docs/decisions/003-publish-creature-compendium.md); the Gamemaster tools and licence are recorded in [ADR-004](docs/decisions/004-publish-gamemaster-tools-and-license.md).

## Later phases

1. Refine Shaping through playtesting while preserving its stable rule IDs and URLs.
2. Establish an illustration style through dedicated visual studies, then fill the creature portrait frames.

Rules artwork beyond creature thumbnails remains outside the current build.
