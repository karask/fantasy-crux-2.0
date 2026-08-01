# Cartoon style exploration 04

Three art-only cartoon directions for Fantasy Crux. None is integrated into the
website.

Each candidate uses the same consistency protocol:

1. Generate a 2x2 anchor board containing the recurring adult female warrior,
   brown bear, four-legged/two-winged dragon, and medieval village.
2. Generate four independent full-size images by style transfer.
3. Use the matching image in
   `../calibration/revision-01/more-naturalistic/` for content, anatomy, pose,
   camera, framing, equipment, and scene layout only.
4. Use the candidate's `anchor.png` for linework, shape language, color
   construction, edge hierarchy, texture, and material rendering only.
5. Reject anatomy or style-consistency failures before saving the set.

## 1. Animated Fantasy Feature

Clean tapered contours, restrained appealing exaggeration, crisp three-to-five
shape cel construction, vivid natural colors, and sparse atmospheric backgrounds.
This is the clearest and most immediately readable option at small website sizes.

## 2. Storybook Gouache Cartoon

Rounded expressive proportions, chunky opaque gouache patches, broken
graphite/colored-pencil contours, visible dry-brush scumble, and gently muted
colors. This is softer and more tactile while remaining clearly cartooned.

## 3. Folk Cut-Paper Fantasy

Angular layered paper silhouettes, flattened depth, minimal modeling, fibrous
printed texture, and restrained stamped material motifs. This is the most graphic
and distinctive option, with the strongest departure from conventional fantasy
illustration.

See each candidate's `provenance.json` for its exact prompts, generation
identifiers, source-image roles, SHA-256 hashes, and per-image QA.
