# Fantasy Crux character sheets

Four illustrated, blank A4 designs for creating and playing Fantasy Crux 2.0 Beta PCs.
Each PDF has seven pages, editable text fields, condition checkboxes, page
bookmarks, and an embedded copy of the complete Open Game License 1.0a.

| Design     | Illustrated treatment                                                                                | PDF                                                                      |
| ---------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Ironbound  | Forged steel, crimson pennants, chainmail and a knight's helm; right portrait, wide talent cards     | [Download](../output/pdf/fantasy-crux-character-sheet-ironbound-a4.pdf)  |
| Wayfarer   | Carved wood, ivy, teal cloth, an owl and compass; left portrait, tall talent cards                   | [Download](../output/pdf/fantasy-crux-character-sheet-wayfarer-a4.pdf)   |
| Starweaver | Silver and cobalt instruments, moons, a raven and violet crystals; central portrait, Knowledge first | [Download](../output/pdf/fantasy-crux-character-sheet-starweaver-a4.pdf) |
| Chronicle  | Brass manuscript illumination, dragons, quills, and wax seals; nameplate and wide talent cards       | [Download](../output/pdf/fantasy-crux-character-sheet-chronicle-a4.pdf)  |

All versions support every character concept. Their names describe the design,
not a character class or restriction. The same core fields appear throughout;
layout and emphasis vary.

## Pages

1. **Character and combat:** identity, blank portrait, seven characteristics with
   permanent and current values, HP, PP, armour AP, Hero Points, MWL, Damage
   Modifier, Combat Order, Movement, armour ENC, five weapon/defence rows,
   conditions and three Dying-round checkboxes.
2. **Skills:** all 26 general-skill templates, optional Shaping, extra named
   Culture/Language/Lore/Craft rows, base formulas, base scores, creation pool
   spending, IP gains, current scores and critical-range end numbers.
3. **Talents and creation:** six ability cards, prerequisites and costs,
   characteristic allocation, category pools, traded points, starting and
   converted IP, spending and completion check.
4. **Equipment and supplies:** armour, carrying limits, 16 inventory rows,
   consumables, ammunition, healing-kit uses, coins, valuables, debts, stored
   gear and transport.
5. **Shaping and enchantments:** expertise limits, active limit, PP commitments,
   available maximum PP, Practice, Tell, specialty, five exact known-cell rows,
   four ongoing-effect rows, active total, Enchantment Capacity, PP recovery,
   ritual prices and anchors.
6. **Common spells:** four large cards, each with exact cell(s), all Magnitude
   terms, PP/casting modifiers, delivery/defence and a clear outcome area.
7. **Journal and advancement:** appearance, personality, background, loyalties,
   goals, bonds, contacts, obligations, session notes, a sketch area and an IP log.

## Use and printing

- Open in a PDF reader with form support to type and save. Fields are manual;
  scores and derived values do not calculate automatically. Keep a blank master
  and save a separate copy for each PC.
- Portrait frames are intentionally empty drawing/image-placement areas.
  Draw after printing, or use a PDF editor's image-placement tool to add a
  portrait digitally. They are not image-upload form buttons.
- Print A4 at **100% / actual size**. Writing areas are white; full-colour
  illustrated borders, portrait frames and stat emblems appear throughout.
  Colour printing best preserves the four palettes.
- For a character without Shaping, pages **1-4 and 7** form the everyday pack.
  Pages **5-6** add magic. Print extra copies of the inventory, spells or journal
  page when more handwritten space is needed.
- Permanent characteristic values establish derived attributes. Temporary
  values belong in Current. Skill bases seed creation only; later characteristic
  increases do not recalculate current skill scores.
- The HP/PP icon holds current and maximum values. Shapers also record their
  available PP maximum after commitments on page 5.
- All cells for PC-entered values are blank. Printed pool sizes and brief
  formulas are rules reminders, not preselected character values.

## Rules and art sources

Mechanics follow the canonical Markdown in `src/content/rules/`, especially:

- [Character creation](../src/content/rules/characters/character-creation.md)
- [Improvement](../src/content/rules/characters/improvement.md)
- [Knowledge skills](../src/content/rules/skills/knowledge-skills.md)
- [Practical skills](../src/content/rules/skills/practical-skills.md)
- [Encumbrance](../src/content/rules/adventuring/encumbrance.md)
- [Becoming a Shaper](../src/content/rules/magic/becoming-a-shaper.md)
- [Building a Shaping](../src/content/rules/magic/building-a-shaping.md)
- [Ongoing Shapings](../src/content/rules/magic/ongoing-and-magical-actions.md)

Custom raster illustrations were generated with the built-in ImageGen tool in
**Vivid Inked Adventure Comic** style. Four continuous page surrounds, four
portrait frames, illustrated writing panels and dividers, and shared ruby-heart,
crystal-vessel, steel-breastplate and hero-medallion emblems carry the design.
Typography and form widgets remain sharp PDF content. The illustrations surround
blank writable centres; they do not replace the editable fields.

The [asset manifest](assets/illustrated-v2/manifest.json) records the exact prompts,
original generated-image paths and local filenames. All original source images
are preserved. The PDFs use the refined `*-border-v4.png` and
`resource-emblems-v3.png` assets; v2 and v3 sources document the refinement process.
Asset atlases are composed directly in PDF using clipping, without bitmap edits.

Small journal illustrations also reuse the approved **Vivid Inked Adventure
Comic** masters: `armour-field-sketch`, `adventuring-company`, `ritual-company`,
and `bridge-hill-fort` under `art/library/subjects/`. The
[production guide](../art/library/styles/inked-adventure-comic-vivid/STYLE.md)
informs the new artwork's colour and ink treatment.

Rules text is Open Game Content. Each PDF embeds the exact repository
[Open Game License 1.0a](../src/license.md) as `Open-Game-License-1.0a.md`, matching
the existing pregenerated-character PDF distribution approach.

## Rebuild and verify

Requires Python with ReportLab, pypdf and Pillow, the Noto fonts under
`/usr/share/fonts/truetype/noto`, and Poppler's `pdftoppm`.

```sh
python3 character-sheets/build_illustrated.py
python3 character-sheets/verify.py
```

`build_illustrated.py` supplies the art composition and uses `build.py` for the
shared rules and form layouts. It writes the four final PDFs to `output/pdf/`. `verify.py` checks A4
geometry, seven pages, all skill templates, empty default values, unique fields,
widget intersections, complete saved-value round trips across every field and
page, bookmarks and the licence attachment. It renders every final page plus
filled proofs of the first page, talent cards and common-spell cards. Review
records live in `character-sheets/review/`; temporary proofs live in
`tmp/pdfs/character-sheets/`.
