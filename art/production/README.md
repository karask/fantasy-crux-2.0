# Fantasy Crux illustration production

This directory records the repeatable production system for approximately
eighty Fantasy Crux illustrations. It is intentionally separate from the
legacy style studies: those images document earlier exploration, while this
system records exact prompts, reference roles, candidates, review decisions,
and approved deliverables.

## Current gate

`FC-HOUSE-V1` is locked for production as **Inked Adventure Comic**. Its
approved master anchors live under
`fc-house-v1/approved/inked-adventure-comic/`. New game art uses that style
anchor plus the closest approved category anchor, each with an explicit
style-only role.

The first matrix tests three adjacent interpretations of semi-realistic,
mildly cartoon-like fantasy illustration:

1. **More graphic** - chunkier silhouettes and fewer value groups.
2. **Balanced** - broad readable forms with mixed edges and selective detail.
3. **More naturalistic** - subtler simplification and softer modelling.

The original prose-only pass was rejected because all three rows converged on
detailed painterly naturalism. Revision 01 preserves each original tile as the
content and composition source, explicitly rejects its rendering style, and
changes only the lane-specific rendering block. All revision prompts retain
natural local colour and neutral daylight, with no fire, magic, dramatic sky,
or cinematic rim light.

Exploration 02 adds five deliberately different media:

1. **Inked adventure comic** - expressive black contours and flat opaque
   colour.
2. **Watercolor storybook** - transparent washes and soft inkless edges.
3. **Hand-colored woodcut** - carved line rhythms and translucent print colour.
4. **Illuminated chronicle** - parchment, mineral pigment, and manuscript line.
5. **Painted miniature diorama** - physical sculpting, matte model paint, and
   built scenic bases.

Each new direction first generated one four-subject anchor. Four independent
sentinels then used the same source images for content and composition only,
plus that direction's anchor for style only. The prompt explicitly excludes
the anchor's objects, layout, palette, lighting, and mood. All five rows passed
the cross-subject consistency and anatomy gate.

The user shortlisted **Inked Adventure Comic** and **More Naturalistic**.
Finalist Stress Test 01 applies both styles to the same six neutral composition
references: an interior, non-fire magic, an item, a humanoid monster, a group
scene, and night weather. This isolates the rendering decision from differences
in subject layout. Both finalist rows passed their content, anatomy, framing,
and cross-subject consistency checks. Inked Adventure Comic was selected;
More Naturalistic and every earlier exploration remain stored as references.

## Source of truth

[`manifest.json`](manifest.json) is the machine-checked root index. Calibration
prompts remain embedded there. Exploration 02 has a compact manifest plus one
provenance file per style so its 25 outputs and exact prompts remain reviewable.
Together they store:

- the exact style block for each calibration lane;
- the exact verbatim prompt for every generated image;
- the stable output path and review status;
- the generation workflow and exposed version information;
- production defaults and the five-axis style rubric.

After a row is selected, freeze its revision style block as `FC-HOUSE-V1`; do
not rewrite it per subject. Palette, light, weather, mood, scene content,
anatomy, and composition belong in separate prompt fields.

## Reference roles after calibration

Production prompts will attach:

1. the approved multi-subject style board for rendering only;
2. the nearest fixed category anchor;
3. an identity reference only for a recurring person, creature, or location.

No ordinary production image becomes a new global style reference. A tool or
model change requires rerunning the four calibration sentinels before work
continues.

## Review rule

Score brushwork, edge handling, shape simplification, detail density, and
material rendering from 1-5. Every axis must score at least 4. Correct anatomy,
safe composition, requested scene lighting, absence of reference leakage, and
readability at both 96 px and 132 px are hard gates rather than averaged
scores.

Review proposed finals in contact sheets of six. One targeted correction is
allowed; regenerate rather than extending the style prompt when two or more
style axes miss the target.

## Files

- `fc-house-v1/calibration/<lane>/<subject>.png` - original rejected calibration
  images.
- `fc-house-v1/calibration/revision-01/<lane>/<subject>.png` - revised
  calibration images awaiting row selection.
- `fc-house-v1/exploration-02/manifest.json` - index for the five alternative
  style systems.
- `fc-house-v1/exploration-02/<style>/provenance.json` - exact anchor and
  sentinel prompts, generation IDs, reference roles, output paths, and QA.
- `fc-house-v1/exploration-02/contact-sheet.html` - full-size, 132 px, and
  anchor comparisons for the five new rows.
- `fc-house-v1/finalist-stress-test-01/manifest.json` - the exact neutral
  composition prompts, finalist prompts, reference roles, generation IDs, and
  QA notes.
- `fc-house-v1/finalist-stress-test-01/comparison.html` - paired comparison of
  the two finalists across all six stress-test subjects.
- `fc-house-v1/approved/inked-adventure-comic/` - locked production style
  anchor and approved cross-subject category anchors.
- `fc-house-v1/contact-sheets/` - full-size and thumbnail comparisons.
- Future approved masters remain lossless in this tree.
- Website creature exports live under `src/assets/images/creatures/` as
  `<slug>.webp` at 640 px and `<slug>-320.webp` at 320 px.
