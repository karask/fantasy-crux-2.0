# Watercolor Storybook Creature Candidate Set

This directory is the complete art-only Watercolor Storybook candidate set for all 57 Fantasy Crux creature profiles. It is intentionally not wired into the website.

## Style lock

Traditional fantasy storybook watercolor: believable but gently exaggerated forms, transparent layered washes on cold-press paper, soft color blooms and granulation, mostly soft edges with a few crisp inkless focal edges, large uncluttered shapes, and minimal colored-pencil accents only at faces and key materials. Mature and lyrical; no opaque digital painting, no cel shading, no glossy rendering.

## Color treatment

Use natural local colors appropriate to each subject and environment, with restrained-to-moderate saturation and luminous transparent pigment. Let paper white and wash transparency create light. Reserve the strongest chroma for small focal accents.

This does **not** mean uniformly pale or desaturated. Watercolor can carry clear, lively color; the distinction is that chroma comes from transparent pigment and subject-appropriate accents rather than the dense, globally vivid palette now used by the canonical Inked Adventure Comic set.

Avoid muddy grey-brown, washed-out sepia, artificial global desaturation, dense jewel-toned comic color, neon, and a forced shared palette across subjects.

## Reference policy

Every image was generated with two references:

1. Its matching image in `../more-naturalistic/` as the approved content blueprint for creature identity, anatomy, pose, action, camera, framing, equipment, environment layout, and narrative intent.
2. `../../exploration-02/watercolor-storybook/anchor.png` as the approved style-only anchor for watercolor medium, brushwork, edge language, shape simplification, detail density, paper behavior, and material handling.

The transfer prompt explicitly prohibited inheriting the anchor's subject, composition, palette, lighting, weather, or mood.

## Shared transfer prompt

> Use case: style-transfer
> Asset type: square creature illustration for a Fantasy Crux tabletop RPG watercolor candidate set
> Input images: Image 1 is the approved creature content blueprint. Preserve its creature identity, age, anatomy, limb count, proportions, pose, action, camera angle, framing, equipment, environment layout, and narrative intent. Do not preserve its painterly medium, opaque rendering, or palette treatment. Image 2 is the approved Watercolor Storybook style anchor. Inherit only its traditional watercolor medium, brushwork, edge language, shape simplification, detail density, paper behavior, and material handling. Do not copy any subject, object, pose, composition, weather, palette, lighting, or mood from Image 2.
> Style/medium: Traditional fantasy storybook watercolor: believable but gently exaggerated forms, transparent layered washes on cold-press paper, soft color blooms and granulation, mostly soft edges with a few crisp inkless focal edges, large uncluttered shapes, and minimal colored-pencil accents only at faces and key materials. Mature and lyrical; no opaque digital painting, no cel shading, no glossy rendering.
> Color treatment: Natural local colors appropriate to the actual subject and environment, with restrained-to-moderate saturation and luminous transparent pigment. Let paper white and wash transparency create light. Reserve the strongest chroma for small focal accents. Avoid muddy grey-brown, washed-out sepia, artificial global desaturation, dense jewel-toned comic color, neon, and a forced shared palette across subjects.
> Composition/framing: square; preserve Image 1's distinctive action and camera, with the complete subject safely inside the frame.
> Constraints: retain the rules-aware characterization encoded in Image 1; correct anatomy and limb counts; no enclosing black ink outlines, added gear, powers, creatures, text, logo, watermark, decorative border, incidental fire, dramatic sky, or rim light.

Each request appended the creature name plus its statistics-, anatomy-, and action-specific focus.

## Production and QA rules

- One principal creature per square image.
- Profile description and characteristics inform visual characterization.
- The approved varied poses and cameras from the naturalistic set are preserved.
- Anatomy and limb plans are checked, with explicit constraints for hybrids, snakes, spiders, octopuses, spirits, and undead.
- No text, logo, watermark, decorative border, unrelated powers, or inherited incidental fire.
- Website assets and creature content are unchanged.

## Fixed interpretations

- `elemental.png`: a large stone elemental.
- `holy-steed.png` and `holy-warrior.png`: servants of a road-and-protection deity; the steed is a sacred iron horse.
- `passion.png`: fear is the embodied passion.
- `guardian.png`: bound to an old bronze burial mask and expressed through a wolf-like spirit.
- `healing.png`: a heron-like healing spirit.
- `magic.png`: a constellation-like magic spirit expressed through an astrolabe.

`manifest.json` maps every authoritative creature profile to its image, source blueprint, current characteristics, pose brief, dimensions, and SHA-256 hash.
