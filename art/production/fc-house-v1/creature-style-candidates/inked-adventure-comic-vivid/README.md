# Inked Adventure Comic — Canonical Vivid Creature Set

This folder contains the canonical vivid-color reference set for all 57 Fantasy Crux creature entries. It is not integrated into the website.

## Direction

The approved **Inked Adventure Comic** rendering language is unchanged:

> Hand-inked Western fantasy adventure comic: expressive variable-weight brush contours, simplified believable anatomy, bold silhouette design, flat opaque colors, two or three hard-edged shadow shapes, sparse dry-brush texture, and selective line detail at faces and focal materials. Mature, handmade, and readable; no painterly blending, no glossy 3D.

This candidate varies only the color treatment:

> More vivid than the approved anchor while remaining disciplined and readable. Use clear saturated local colors and strong warm/cool separation. Draw selectively from jewel-toned teal, cobalt, jade, vermilion, amber, violet, and warm cream according to the actual subject and environment. Keep shadows chromatic instead of muddy grey-brown. Preserve believable material colors. No neon, psychedelic rainbow, uniform palette across every subject, oversaturation that destroys value hierarchy, or washed-out sepia.

## Generation method

Built-in image generation was used once per asset with two references:

1. The corresponding image in `../more-naturalistic/` supplied creature identity, anatomy, pose, action, camera, framing, equipment, and environment.
2. `../../approved/inked-adventure-comic/style-anchor.png` supplied style only.

The shared transfer prompt was:

> Use case: style-transfer
> Asset type: square creature illustration for a Fantasy Crux tabletop RPG candidate art set
> Input images: Image 1 is the approved creature content blueprint. Preserve its creature identity, age, anatomy, limb count, proportions, pose, action, camera angle, framing, equipment, environment layout, and narrative intent. Do not preserve its painterly medium or muted palette. Image 2 is the approved Inked Adventure Comic style anchor. Inherit only its line language, shape simplification, shadow construction, texture density, and material rendering. Do not copy any subject, pose, object, composition, weather, or mood from Image 2.
> Style/medium: Hand-inked Western fantasy adventure comic: expressive variable-weight black brush contours, simplified believable anatomy, bold silhouette design, flat opaque color shapes, two or three hard-edged shadow shapes, sparse dry-brush texture, and selective hatching or line detail only at faces and focal materials. Mature handmade print-comic finish; no painterly blending and no glossy 3D.
> Color treatment: More vivid than the approved anchor while remaining disciplined and readable. Use clear saturated local colors and strong warm/cool separation. Draw selectively from jewel-toned teal, cobalt, jade, vermilion, amber, violet, and warm cream according to the actual subject and environment. Keep shadows chromatic instead of muddy grey-brown. Preserve believable material colors. No neon, psychedelic rainbow, uniform palette across every subject, oversaturation that destroys value hierarchy, or washed-out sepia.
> Composition/framing: square; keep Image 1's complete subject safely inside the frame and preserve its distinctive action and camera.
> Constraints: retain the rules-aware characterization already encoded in Image 1. Correct anatomy and limb counts; no added gear, powers, creatures, text, logo, watermark, decorative border, incidental fire, or dramatic rim light.

Each asset also received a creature-specific request and rules focus based on its current description and characteristics.

## QA

- 57 individual square PNG files
- Current creature profiles, statistics, and established pose briefs retained
- Anatomy, limb counts, action readability, and style consistency visually reviewed
- Original approved Inked Adventure Comic art left unchanged
- Website asset and content trees left unchanged

See `manifest.json` for per-asset source profiles, source blueprints, dimensions, hashes, and pose briefs.
