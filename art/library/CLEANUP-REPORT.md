# Art library cleanup report

Date: 2026-08-01

## Outcome

The art tree now has one live source of truth under `art/library/`. Vivid Inked
Adventure Comic remains the only active and website-published style. The four
inactive systems retain a detailed rendering brief and one visual anchor each.

| Inventory                  |    Before |     After |    Change |
| -------------------------- | --------: | --------: | --------: |
| Art files                  |       214 |       186 |       -28 |
| Art storage                | 389.0 MiB | 292.5 MiB | -96.5 MiB |
| Full-resolution PNGs       |       129 |        95 |       -34 |
| Exact duplicate PNG groups |        11 |         0 |       -11 |
| Website image files        |       180 |       180 | unchanged |
| Website image storage      |  19.0 MiB |  19.0 MiB | unchanged |

## Retained and moved

- Moved all 57 currently published Vivid Ink creature sources into
  `subjects/creatures/styles/inked-adventure-comic-vivid/` and normalized each
  approved filename to its creature slug.
- Preserved the corrected Merfolk, Orc, Skeleton, and Wyvern sources already
  represented by the website exports.
- Promoted `ward-against-flame` straight-staff v3 and `encounter-scale` crisp v2
  after deterministic downscaled-pixel comparison showed they match the
  approved website images.
- Moved selected homepage Variant A into `subjects/home-hero/` with its complete
  content, pose, alt-text, constraint, master, and export records.
- Retained all 28 chapter masters, their content briefs, the intentional warrior
  cutout, five masks, four cast profiles, and three dedicated cast anchors.
- Retained five detailed style briefs and exactly one visual anchor per style.
- Moved 44 Markdown, JSON, and HTML prompt/provenance records into the
  metadata-only archive. Historical raster paths are explicitly non-live.
- Preserved every creature rule profile, statistic block, ability, alt text, and
  pose brief, including the corrected Beastman, Holy Warrior, Pixie, and Dryad.

## Removed

- Removed accepted review copies that duplicated canonical masters and the
  rejected Consequences at the Gate and accidental Fire Shaping iterations.
- Removed superseded Ward, Encounter, bridge-reference, and storm-reference
  rasters after canonical reconciliation.
- Removed unselected homepage variants B-H and its duplicate cross-style Vivid
  image.
- Removed obsolete production, calibration, alternate-style creature,
  exploration, stress-test, art-direction, and style-study raster trees while
  retaining their textual provenance where it existed.
- Removed the stale `art/creatures`, `art/style-studies`, `art/art-direction`,
  and live `art/production` entry points.

## Canonical interfaces

- `catalog.json` indexes all styles, subjects, masters, hashes, dimensions, cast
  anchors, and website derivatives.
- `subjects/creatures/pose-registry.json` is the authoring registry for creature
  poses and masters.
- `subjects/creatures/content-manifest.json` and
  `src/assets/images/creatures/manifest.json` are generated from the canonical
  registry.
- `npm run art:build` regenerates metadata only; it never overwrites artwork.
- `npm run art:validate` performs the read-only path, hash, dimension, count,
  duplicate, source-agreement, and publication checks.

## Verification

- Art validation: passed for five styles, one homepage subject, 28 chapter
  subjects, 57 creature masters, and every derivative.
- Unit tests: 62 passed across eight files.
- Production build: passed; 173 Markdown records and 14 required outputs
  validated.
- HTML validation: passed.
- Link and asset validation: 1,101 references passed across 14 pages.
- Browser and accessibility suite: 56 passed at 320, 390, 768, and 1,440 px,
  including no-JavaScript and automated accessibility checks.
- Cleanup-owned live files pass Prettier. The repository-wide formatting gate
  still reports the pre-existing backlog in unrelated rules, ADRs, and support
  files; those files were intentionally not reformatted during this cleanup.

No Git history rewrite, Git LFS migration, commit, or push was performed.
