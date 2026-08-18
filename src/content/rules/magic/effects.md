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

Use the lowest [Intensity](/rules/magic/#building-a-shaping--magic-intensity) covering the outcome.

| Outcome                       | Effect                                                                       |
| ----------------------------- | ---------------------------------------------------------------------------- |
| Immediate damage              | Unmake deals `Intensity D6`; never add Damage Modifier.                      |
| Healing                       | Alter·Flesh restores `1D4` HP per Intensity.                                 |
| Armour or reduction           | Ward grants AP of twice Intensity against one defined class of harm.         |
| Barrier                       | AP = twice Intensity; total HP = `5 × Intensity`; Reach sets footprint.      |
| Skill modifier                | `+1B`/`-1P` at Intensity 2; `+2B`/`-2P` at Intensity 4.                      |
| Characteristic modifier       | ±1 per Intensity within normal limits; attributes do not change.             |
| Brief hindrance               | Intensity 1 may halve Movement through the subject's next turn.              |
| Restraint or forced movement  | Intensity 2 restrains a human-sized subject or moves it up to 3 metres.      |
| Flight                        | Intensity 3 moves a willing subject at normal Movement under active control. |
| Lost Combat Action            | Intensity 3, once; immune until the target completes a later Combat Action.  |
| Full bodily or mental control | Intensity 4 and active control.                                              |

## Damage, armour, and wounds {#magic-damage}

Where its Form permits, Unmake deals `Intensity D6`. Projected Harm follows normal [damage rules](/rules/combat/#damage-and-wounds), including nonmagical AP. Direct Harm ignores nonmagical worn, natural, and object AP. Direct Harm against creatures retains Ward AP and named resistances; unattended objects retain magical protection only. Subsequent hazards, summons, falling objects, and mundane consequences use ordinary armour rules.

Mind deals no HP. Unmake·Spirit damage is Direct-only: oppose Persistence and deal `Intensity D6` PP to a souled target; only magical Ward AP and named resistances apply. A visible spectral bolt is cosmetic Tell, not a projectile. It causes no HP loss, Major Wound, or Bleeding. At 0 PP, a living target falls unconscious, a Spirit is banished, and possession ends. Soulless targets are invalid. Use selected targets and the Direct Range route.

## Healing and death {#magic-healing}

Healing stops at maximum HP and removes **Bleeding** and **Dying**. A living subject restored above 0 HP may act next turn; Wounded remains.

Intensity 3+ healing counts as [Surgery](/rules/adventuring/#healing-and-recovery--adventuring-surgery-recovery), unlocking recovery; after treatment, Wounded ends once HP exceeds MWL.

Curing poison or disease needs Intensity at least Potency divided by 25, and Shaping must win against Potency. After failure, that Shaper needs new treatment, discovery, full rest, or another meaningful change to retry.

Fatigue, deprivation, age, and unrelated conditions need separate outcomes. Returning the dead requires Intensity 5, permanent Duration, a mythic ritual, willing reachable soul, and lasting price. The subject returns at 1 HP and Wounded; restoring a destroyed body is separate.

### Corporeal undead {#magic-undead}

Alter·Flesh repairs corporeal undead at normal healing Intensity, restoring no soul, identity, intelligence, memory, or loyalty. Unmake·Flesh damages living and corporeal undead bodies normally.

Conjure·Flesh may animate remains as a temporary generic **Mindless, Soulless Undead** summon. Use the table below; remains collapse at 0 HP or Duration's end, while conjured matter vanishes. Lasting undead require a named profile, profile-based Intensity, Duration 5, mythic price, and vulnerable physical anchor. Intelligence grants no former identity, memories, or loyalty.

Alter·Flesh at Intensity 5 and Duration 5 can make a living subject Undead through mythic ritual and lasting price; its soul departs. Shaping-made or sustained undead are active magic anchored vulnerably to body or remains. Existing undead are not inherently Shapings.

## Modifiers and transformation {#magic-transformation}

A modifier names one skill or narrow family; identical magical modifiers do not stack. Shaping never widens critical range or grants extra Combat Actions, Movement Actions, Reactions, Dodges, PP, IP, Hero Points, Talents, skills, or memories.

Temporary characteristic changes affect direct tests and physical thresholds, never prerequisites or derived values: base skills, HP, MWL, PP, DM, Combat Order, or active capacity. Permanent changes recalculate; permanent POW loss lowers maximum PP and active capacity, forcing dismissals until legal.

A transformation changes appearance and form. AP, attacks, movement modes, senses, Size benefits, and other mechanics need additional outcomes guided by an existing profile. Concept grants permission, not capabilities.

## Restraint, influence, and control {#magic-control}

Intensity 1 may colour emotion or plant a plausible suggestion. Intensity 2 may compel one limited, reasonable action, but cannot spend or deny a combat Action, cause immediate tactical disadvantage, or oppose the subject's interests. Those need Intensity 3, which may also remove one Combat Action. Intensity 4 permits full control.

A compelled combat act occurs on the subject's next turn, spending its Action and granting no extra one.

A restrained subject may spend a Combat Action to retry its original defence against the stored result. Full control grants another Persistence defence against the stored Shaping result before serious self-harm, defining betrayal, or a central belief's violation; winning frees that subject, and certain death always grants one.

Directing active control spends the Shaper's Combat Action. The subject obeys on its own turn, spends the corresponding Action, and gains none. Without maintenance it regains control; magical movement stops where fiction permits.

## Wards and barriers {#magic-wards}

A Ward grants one benefit: AP or reduction equal to twice Intensity; `+1B` at Intensity 2 or `+2B` at Intensity 4 to one defence; or denial priced as restraint, with each crossing opposing the appropriate defence against the stored Shaping result.

Ward AP never adds to worn armour against one damage source: use the higher, or Ward AP alone when worn armour cannot protect. Same-kind magical protection never stacks.

A solid barrier blocks movement and line of effect until destroyed and cannot appear through occupied space. Trapping an unwilling subject is hostile restraint: the defender chooses Dodge or Resilience. Forms unable to make solid structures cannot use barrier statistics.

## Scry {#magic-scry}

| Intensity | Information within purchased Range                                                   |
| --------: | ------------------------------------------------------------------------------------ |
|         1 | Detect a defined presence or reveal one immediate clue.                              |
|         2 | Locate, diagnose, communicate, or see through ordinary concealment.                  |
|         3 | Observe a distant scene, read surface thoughts, or reveal deeply hidden information. |
|         4 | Reach guarded memory, obscured history, motives, or uncertain possible futures.      |

Scry gives evidence, not omniscience or knowledge absent from accessible minds, places, spirits, traces, or patterns. Possible futures change when acted upon. Live observation, communication, or thought-reading needs concentration; static senses and facts do not.

## Summons and named beings {#magic-summons}

Only one combat-capable summon or actively controlled subject; Reach cannot bypass this.

A generic combat summon acts immediately after its Shaper. It moves, communicates, and defends uncommanded; consequential acts cost the Shaper's Combat Action and the summon's corresponding Action. It has Movement 15, one Movement Action, and one base Reaction.

| Intensity |  HP |  AP | Attack/defence | Damage |
| --------: | --: | --: | -------------: | -----: |
|         1 |   3 |   0 |            25% |  `1D3` |
|         2 |   6 |   1 |            40% |  `1D6` |
|         3 |  10 |   2 |            55% |  `1D8` |
|         4 |  14 |   3 |            70% |  `2D6` |

Listed defence covers Dodge, Resilience, Persistence, and possible physical Parry; damage adds no DM. Summons ignore Major Wounds and vanish at 0 HP. Capabilities beyond the profile—including flight, incorporeality, spellcasting, invisibility, extra natural armour, or special senses—raise minimum Intensity or add an outcome.

Range sets generic arrival. Calling a named being must also reach its location or realm; use the higher Range.

A named being uses its profile; set Intensity by threat, reserving 5 for legendary beings. An unwilling being resists calling with Persistence. Calling grants no control: it remembers treatment and may demand terms. Binding or command is another Persistence-resisted outcome. Duration and active limits apply until Shaping ends; afterward it may stay willingly, without magical command, guaranteed service, protection, or dismissal.

Created, summoned, transformed, or compelled beings cannot summon, contribute PP, create magical resources, or pay ritual prices.
