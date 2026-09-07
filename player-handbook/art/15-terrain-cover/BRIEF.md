# Terrain Cover — prototype artwork

Status: production candidate for user review; not approved.

## Intended lesson

The three scenes show partial cover (attack −1P), substantial cover (attack −2P),
and complete cover (attack prevented). A large main scene establishes who is
shooting and who is protected. Two smaller scenes vary the target's exposure.
The source rule is `src/content/rules/combat/ranged-combat.md`, heading Cover.

The master contains no lettering. The renderer places the exact player copy from
`pages/15-terrain-cover.md` over and beside crops of the illustration. It retains
the source master intact. The output is one complete A4-proportioned page image.

## Reference roles

The following local references were inspected before writing the generation
prompt. They guide style and character identity, not the new scene's geometry:

- `art/library/styles/inked-adventure-comic-vivid/anchor.png`: rendering reference.
- `art/library/cast/corin-scout/anchor.png` and `PROFILE.md`: the archer's identity,
  clothing, proportions, and colours.
- `art/library/subjects/ranged-from-cover/styles/inked-adventure-comic-vivid.png`:
  ink, stone, and equipment treatment. Its original archer is himself in cover,
  so its composition cannot demonstrate the intended rule unchanged.

The soldier is an incidental adult human in a steel helmet, mail, and muted red
surcoat. No shield is shown, so it cannot be mistaken for the source of cover.

## Generation

Use the **built-in image-generation tool**, single generation for the three-scene
master. The exact initial request is saved in [prompt-v01.txt](prompt-v01.txt).
Any targeted correction must be saved as an additional prompt and the previous
master retained. Do not use a paid API/CLI fallback without the user's request.

The upper 60% is the partial-cover scene. The two lower scenes share the remaining
40%. Cropping and annotation positions are set after inspecting the returned
master; those percentages are a generation target, not a claim about an unseen
output's exact boundaries.

## Visual acceptance

- The shooter is in the open, the obstacle is in front of the target.
- A low wall exposes the torso; substantial cover exposes a small head/shoulder
  area; complete cover blocks the entire target from the archer's viewpoint.
- The reader may see the third target from an explanatory side viewpoint; the
  archer's line remains blocked by a solid wall.
- The correct modifier belongs beside the attacker's roll, not the defender.
- Bows, strings, nocked arrows, hands, helmets, and walls are physically coherent.
- Colour, cast, and ink style remain consistent across all three scenes.
- The finished page contains all authoritative player copy, no unrelated rules,
  and legible text at A4 size.

## Generated master and provenance

- Tool: built-in image generation, one call, 6 September 2026.
- Exact prompt: [prompt-v01.txt](prompt-v01.txt). The new image request used the
  written style and cast descriptions derived from the inspected references.
- Saved master: [illustration-v01.png](illustration-v01.png), native **1254 × 1254**.
- Original tool output: `/home/kos/.codex/generated_images/01a077c8-3747-7962-bbdb-371bcdf9db15/exec-7742c7da-2ab3-4f1c-a7a8-8dbeca55b13c.png`.
- The original remains in place; the project has its own copy.
- Observed panel geometry: the large scene occupies approximately the top half,
  and two square comparisons occupy the bottom half. The composition uses these
  observed boundaries, not the requested 60/40 ratio.
- Complete cover is shown by hiding the soldier entirely behind an opaque wall.
  The model did not expose the far-side figure to the reader. This clearly
  communicates the rule; the caption explains the hidden target. No image edit
  or invented exposed head is needed.

## Composition and QA

The page is typeset with the existing fonts over the intact master, cropped
through CSS viewports. Badge and leader positions are in
`design/terrain-cover.njk` and `design/page.css`. The archer badge's leader points
to the cloak/shoulder, avoiding the face and bow grip. The wall leader identifies
the obstacle rather than the soldier.

The review image is 1240 × 1754 and the print composition is 2480 × 3508. The
latter doubles the typography resolution but does not add native artwork detail.
Both retain the same A4 layout. Automated checks cover canvas dimensions, loaded
fonts/images, full source-copy presence, overflowing text, footer clearance, and
WCAG A/AA accessibility of the editable HTML.

Visual inspection confirms decreasing exposure, readable badges and captions,
matching cast/colours, intact bows within the instructional crop, and a clear
distinction between an attack penalty and damage. Approval of this direction is
reserved for the user; no other handbook page has been illustrated.
