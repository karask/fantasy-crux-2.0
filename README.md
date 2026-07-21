# Fantasy Crux Lite

Fantasy Crux Lite is the compact, mundane-rules edition of Fantasy Crux. Its canonical source is portable Markdown, rendered as the responsive **Cold Iron** static website. The current rules cover character creation, skills, equipment, combat, adventuring, and 17 optional Talents.

Magic is deliberately unfinished. The website exposes an empty Magic chapter containing only “Magic rules are in development.” The candidate systems in `freeform-magic/` are preserved for a later phase.

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

- `src/content/rules/` — canonical Markdown rules and Talent records
- `src/_includes/` — Nunjucks page layouts
- `src/assets/` — the Cold Iron CSS, progressive-enhancement JavaScript, and brand mark
- `src/lib/` — content schema and executable rules contracts
- `tests/` — unit/content contracts and real-browser checks
- `tex/` and `fantasy-crux.tex` — preserved legacy full-rule sources; not generated from Markdown
- `freeform-magic/` — preserved candidate magic systems; not published

Individual rules and Talents are the search units. Chapter hubs, Quick Reference, Search, and Magic are excluded from the Pagefind index. Core reading and navigation work without JavaScript; search, Talent filters, and collapsible examples are enhancements.

The default build targets an origin root. To deploy under a subpath, set `FANTASY_CRUX_PATH_PREFIX` to that path before building; the HTML, assets, and search loader are path-prefix aware.

## Editing rules

Add or change rules in `src/content/rules/`. Keep frontmatter within the strict schemas in `src/lib/content-schema.mjs`; the validator rejects unknown keys, malformed IDs, duplicate IDs, and duplicate URLs. Markdown may use headings, lists, tables, definition lists, footnotes, and explicit heading IDs, but not raw HTML or MDX.

Run `npm run check` before treating a change as complete. The content contract also protects the 17-Talent catalogue, the empty Magic placeholder, the no-image phase boundary, and the 12,000-word visible-copy ceiling.

The rationale for the Markdown-first static architecture is recorded in [ADR-001](docs/decisions/001-markdown-first-static-rules.md).

## Later phases

1. Select and refine one magic system from `freeform-magic/`, then replace the placeholder chapter.
2. Establish an illustration style through dedicated visual studies before adding rules artwork.

Neither phase is part of the current build.
