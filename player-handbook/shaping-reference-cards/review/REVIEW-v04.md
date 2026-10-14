# Shaping reference cards v04

14 October 2026. Brings the cards in line with the October rule changes.

## Changes

- **Card 1:** the Ward example grants 4 AP against physical harm, matching the
  new Ward classes.
- **Card 2:** Ward protects against physical or elemental harm, and covering
  both costs +1 Intensity; the higher of Ward or worn AP applies. An unwilling
  subject under active control moves at most 3 m a round. Each subject gains HP
  from one healing Shaping before its next full rest, stabilising alone is
  unlimited, and healing below Intensity 3 restores HP without ending Wounded.
  The duplicate "Duration cannot repeat healing" line was dropped; card 1 keeps it.
- **Card 3:** summons follow one standing order, act right after the Shaper on
  their own turn, and change orders for the Shaper's Movement Action within
  15 m and line of effect. Active control still costs the Combat Action.

Created fire and one-use enchanted items are outside the cards' scope.

## Verification

- Rendered with the bundled Chromium; no clipped or overflowing text, minimum
  type 9.5 pt. Footer gaps: **6.68, 8.00 and 6.42 mm**.
- `verify.py v04`: three A4 pages with complete selectable text, embedded fonts
  and one footer number each.
- All three pages rasterised and visually inspected.
- Markdown lint, unit tests, website build, HTML validation and local link
  checks pass.

The Downloads entry now selects v04. Publication approval is given by merging
the pull request that carries this version.
