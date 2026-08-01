---
type: rule
id: magic.effects
chapter: magic
title: Effects
slug: effects
order: 40
summary: Use fixed benchmarks for damage, healing, protection, information, control, transformation, and summoned beings.
aliases:
  - magic damage
  - magical healing
  - magic wards
  - magic summons
---

Use the lowest [Intensity](/rules/magic/#building-a-shaping--magic-intensity) that produces the outcome.

| Outcome                       | Effect                                                                              |
| ----------------------------- | ----------------------------------------------------------------------------------- |
| Direct damage                 | Unmake deals `Intensity D6`; never add Damage Modifier.                             |
| Healing                       | Alter·Flesh restores HP equal to Intensity.                                         |
| Armour or reduction           | Ward grants AP equal to Intensity against one defined class of harm.                |
| Barrier                       | AP = Intensity; total HP = `5 × Intensity`; Reach sets footprint.                   |
| Skill modifier                | `+1B`/`-1P` at Intensity 2; `+2B`/`-2P` at Intensity 4.                             |
| Characteristic modifier       | ±1 at Intensity 3; ±2 at Intensity 4, within normal limits.                         |
| Brief hindrance               | Intensity 1 may halve Movement until the end of the affected subject's next turn.   |
| Restraint or forced movement  | Intensity 2 restrains a human-sized subject or moves it up to 3 metres.             |
| Flight                        | Intensity 3 moves a willing subject at normal Movement while actively controlled.   |
| Lost Combat Action            | Intensity 3, once; immunity lasts until the target completes a later Combat Action. |
| Full bodily or mental control | Intensity 4 and active control.                                                     |

## Damage, armour, and wounds {#magic-damage}

Physical magic follows normal [damage rules](/rules/combat/#damage-and-wounds); **Piercing** ignores mundane armour. Mind deals no HP. Unmake·Spirit deals `Intensity D6` PP to any souled target and ignores AP. At 0 PP, a living target falls unconscious; a Spirit is banished and possession ends. Soulless targets are invalid.

## Healing and death {#magic-healing}

Healing cannot exceed maximum HP and removes **Bleeding** and **Dying**. A living subject raised above 0 HP may act on their next turn in Combat Order. Wounded remains.

At Intensity 3+, healing counts as [Surgery](/rules/adventuring/#healing-and-recovery--adventuring-surgery-recovery): natural recovery is unlocked, and Wounded ends after treatment once HP exceeds MWL.

Curing poison or disease needs a minimum Intensity of Potency divided by 25. Oppose Shaping with Potency; the Shaper must succeed and win. After failure, that Shaper needs new treatment, discovery, full rest, or another meaningful change before retrying.

Healing does not remove Fatigue, deprivation, age, or unrelated conditions without another paid outcome. Returning the dead requires Intensity 5, permanent Duration, a mythic ritual, a willing reachable soul, and a lasting price. The subject returns at 1 HP and Wounded; a destroyed body must be restored separately.

### Corporeal undead {#magic-undead}

Alter·Flesh repairs a corporeal undead body at normal healing Intensity. It restores no soul, identity, intelligence, memory, or loyalty. Unmake·Flesh damages living bodies and corporeal undead normally.

Conjure·Flesh may animate remains as a temporary generic **Mindless, Soulless Undead** summon. Use the table below; remains collapse at 0 HP or Duration's end, while conjured matter vanishes. A lasting undead instead needs its named profile, profile-based Intensity, Duration 5, a mythic price, and a vulnerable physical anchor. Intelligence grants no former identity, memories, or loyalty.

Alter·Flesh at Intensity 5 and Duration 5 can turn a living subject into Undead through a mythic ritual and lasting price; its soul departs. A Shaping-made or sustained undead is active magic; its body or remains is its vulnerable Dispel anchor. Existing undead are not Shapings merely for being undead.

## Modifiers and transformation {#magic-transformation}

A modifier names one skill or narrow family. Identical magical modifiers do not stack. Shaping never expands critical range or grants extra Combat Actions, Movement Actions, Reactions, Dodges, PP, IP, Hero Points, Talents, skills, or memories.

Temporary characteristic changes affect direct tests and physical thresholds, never prerequisites or derived values: base skills, HP, MWL, PP, DM, Combat Order, and active capacity. Permanent changes recalculate normally; permanent POW loss lowers maximum PP and active capacity, forcing dismissals until legal.

A transformation changes appearance and form. AP, attacks, movement modes, senses, Size benefits, and other mechanics are additional outcomes guided by an existing profile. Concept grants permission, not free capabilities.

## Restraint, influence, and control {#magic-control}

Intensity 1 may colour emotion or plant a plausible suggestion. Intensity 2 may compel one limited, reasonable action, but cannot spend or deny an Action in combat, create an immediate tactical disadvantage, or work against the subject's interests. Those effects require Intensity 3, which may also remove one Combat Action. Intensity 4 permits full control.

A compelled combat act occurs on the subject's next turn and spends its corresponding Action; it never grants an extra Action.

A restrained subject may spend a Combat Action to retry its original defence against the stored result. Full control grants another Persistence test against serious self-harm, defining betrayal, or violation of a central belief; certain death always grants one. Success ends that control for the subject.

Directing an actively controlled subject spends the Shaper's Combat Action. It obeys on its own turn in Combat Order, using the corresponding Action and gaining no extra one. Without maintenance, a creature regains control; magically controlled movement stops where the fiction permits.

## Wards and barriers {#magic-wards}

A Ward grants one benefit: AP or reduction equal to Intensity; `+1B` at Intensity 2 or `+2B` at Intensity 4 to one defence; or denial priced as restraint and resisted on each crossing attempt.

Ward AP never adds to worn armour against the same damage. If both apply, use the higher AP; if worn armour cannot protect against the source, use Ward AP alone. Same-kind magical protection never stacks.

A solid barrier blocks movement and line of effect until destroyed. It cannot appear through occupied space. Placement trapping an unwilling subject is hostile restraint; the defender chooses Dodge or Resilience. A Form unable to create a solid structure cannot use barrier statistics.

## Scry {#magic-scry}

| Intensity | Information within purchased Range                                                   |
| --------: | ------------------------------------------------------------------------------------ |
|         1 | Detect a defined presence or reveal one immediate clue.                              |
|         2 | Locate, diagnose, communicate, or see through ordinary concealment.                  |
|         3 | Observe a distant scene, read surface thoughts, or reveal deeply hidden information. |
|         4 | Reach guarded memory, obscured history, motives, or uncertain possible futures.      |

Scry gives evidence, not omniscience or knowledge absent from every accessible mind, place, spirit, trace, or pattern. Possible futures change when acted upon. Live observation, communication, or thought-reading requires concentration; a static sense or single fact does not.

## Summons and named beings {#magic-summons}

A Shaper may have only one combat-capable summon or actively controlled subject at a time. Reach does not bypass this limit.

A generic combat summon acts immediately after its Shaper. It may move, communicate, and defend uncommanded. A consequential action costs the Shaper's Combat Action and the summon's corresponding Action. It has Movement 15, one Movement Action, and one base Reaction.

| Intensity |  HP |  AP | Attack/defence | Damage |
| --------: | --: | --: | -------------: | -----: |
|         1 |   3 |   0 |            25% |  `1D3` |
|         2 |   6 |   1 |            40% |  `1D6` |
|         3 |  10 |   2 |            55% |  `1D8` |
|         4 |  14 |   3 |            70% |  `2D6` |

Listed defence covers Dodge, Resilience, Persistence, and a physically possible Parry; damage adds no DM. Summons ignore Major Wounds and vanish at 0 HP. Each useful capability beyond the profile—including flight, incorporeality, spellcasting, invisibility, additional natural armour, or special senses—raises minimum Intensity or adds an outcome.

For a created generic summon, Range sets its arrival point. Calling an existing named being must also reach its current location or realm; use the higher Range.

A named being uses its own profile; set Intensity from its actual threat, with Intensity 5 reserved for legendary beings. An unwilling being resists the call with Persistence. Calling grants no control: it remembers treatment and may demand terms. Binding or command is another outcome and allows Persistence. Duration and active limits apply until the Shaping ends; afterward the being may remain by its own choice, without magical command, guaranteed service, protection, or dismissal.

Created, summoned, transformed, or compelled beings cannot summon, contribute PP, create magical resources, or pay ritual prices.
