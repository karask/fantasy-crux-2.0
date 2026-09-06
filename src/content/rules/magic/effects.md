---
type: rule
id: magic.effects
chapter: magic
title: Effects
slug: effects
order: 40
summary: Use fixed benchmarks for damage, healing, protection, movement, senses, conditions, restoration, information, control, transformation, and summoned beings.
aliases:
  - magic damage
  - magical healing
  - magic wards
  - magic summons
  - invisibility
  - sensory concealment
  - magical flight
  - magical senses
  - water breathing
  - magical blindness
  - magical sleep
  - magical conditions
  - magical restoration
  - temporary hit points
  - vitality reserve
---

Use the lowest [Intensity](/rules/magic/#building-a-shaping--magic-intensity) covering the outcome.

| Outcome                       | Effect                                                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Immediate damage              | Unmake deals `Intensity D6`; never add Damage Modifier.                                                       |
| Healing                       | Alter·Flesh restores `1D4` HP per Intensity.                                                                  |
| Armour or reduction           | Ward grants AP of twice Intensity against one defined class of harm.                                          |
| Barrier                       | AP = twice Intensity; total HP = `5 × Intensity`; Reach sets footprint.                                       |
| Vitality reserve              | Absorb up to `3 × Intensity` HP after other protection and before actual HP.                                  |
| Skill modifier                | `+1B`/`-1P` at Intensity 2; `+2B`/`-2P` at Intensity 4.                                                       |
| Sensory concealment           | I2: `-1P` to detect through one sense; I3: imperceptible through one sense; I4: every sense the cell governs. |
| Sensory impairment            | I2: `-1P` through one sense; I3: suppress one sense; I4: every sense the cell governs.                        |
| Brief hindrance               | Intensity 1 may halve Movement through the subject's next turn.                                               |
| Restraint or forced movement  | Intensity 2 restrains a human-sized subject or moves it up to 3 metres.                                       |
| Movement mode                 | I2: climb, swim, or traverse a named surface; I3: flight; I4: pass through a named mundane substance.         |
| Movement speed                | I1: +3 m; I2: ×1.5; I3: ×2; I4: ×3, for one named movement mode.                                              |
| Lost Combat Action            | Intensity 3, once; immune until the target completes a later Combat Action.                                   |
| Incapacitation                | Intensity 4; no Actions or Reactions, with a retry or defined break condition.                                |
| Full bodily or mental control | Intensity 4 and active control.                                                                               |

## Damage, armour, and wounds {#magic-damage}

Where its Form permits, Unmake deals `Intensity D6`. Projected Harm follows normal [damage rules](/rules/combat/#damage-and-wounds), including nonmagical AP. Direct Harm ignores nonmagical worn, natural, and object AP. Direct Harm against creatures retains Ward AP and named resistances; unattended objects retain magical protection only. Subsequent hazards, summons, falling objects, and mundane consequences use ordinary armour rules.

A Shaping damage outcome resolves once. Duration cannot attach damage to a target, repeat it each round, add it to every weapon hit, or retaliate when the protected subject is attacked or harmed. A [Trigger](/rules/talents/#trigger) may delay one already targeted damage outcome until an allowed observable event, then fires once. Resolve that Shaping separately from any weapon attack used as its Trigger; neither result adds to, replaces, or inherits the other's damage, defence, armour, or Critical benefits.

Mind deals no HP damage. Unmake·Spirit damage is Direct-only: oppose Persistence and deal `Intensity D6` PP to a souled target; only magical Ward AP and named resistances apply. A visible spectral bolt is cosmetic Tell, not a projectile. It causes no HP loss, Major Wound, or Bleeding. At 0 PP, a living target falls unconscious, a Spirit is banished, and possession ends. Soulless targets are invalid. Use selected targets and the Direct Range route.

## Healing and death {#magic-healing}

Healing stops at maximum HP and removes **Bleeding** and **Dying**. A living subject restored above 0 HP may act next turn; Wounded remains.

Intensity 3+ healing counts as [Surgery](/rules/adventuring/#healing-and-recovery--adventuring-surgery-recovery), unlocking recovery; after treatment, Wounded ends once HP exceeds MWL.

Curing poison or disease needs Intensity at least Potency divided by 25, and Shaping must win against Potency. After failure, that Shaper needs new treatment, discovery, full rest, or another meaningful change to retry.

Shaping cannot regenerate: it cannot distribute healing across later turns, restore HP repeatedly through Duration, or create a pool that heals future injuries. Use one immediate healing outcome instead. A creature's explicitly listed Regeneration remains a profile ability, not a Shaping benchmark.

Fatigue, deprivation, age, and unrelated conditions need separate outcomes. Returning the dead requires Intensity 5, permanent Duration, a mythic ritual, willing reachable soul, and lasting price. The subject returns at 1 HP and Wounded; restoring a destroyed body is separate.

### Vitality reserves {#magic-vitality-reserves}

A vitality reserve is finite magical protection, not additional Hit Points. It begins with `3 × Intensity` points. After resolving Parry, armour, resistance, and every other applicable damage reduction, subtract qualifying HP damage from the vitality reserve. Any excess damages actual HP. For that hit, only the damage that reaches actual HP is compared with MWL.

A reserve persists across any number of damage instances until depleted or its Duration ends. It changes neither maximum HP nor MWL and cannot be healed or replenished. A reserve absorbs HP damage only—not PP damage, a paid HP cost or sacrifice, or another effect that causes HP loss without dealing damage.

A subject can have only one vitality reserve. When a new reserve is granted, compare it with the existing reserve's remaining points and keep the larger; on a tie, the subject chooses. The discarded reserve ends. Unused points vanish when Duration ends without changing actual HP. Once depleted, the reserve ends even if its Duration remains; only a new casting or separately paid item activation can grant a fresh reserve. A vitality-reserve enchantment must be Activated or Charged, never Continuous.

The cell must explain the protection. `Alter·Flesh` might impart supernatural vigour, while `Ward·Force/Motion` might interpose a finite force shell. The reserve can absorb only HP damage that its declared method can protect against. Ward AP remains repeatable against its defined class of harm; a vitality reserve instead provides a finite, depletable pool. Neither may retaliate with damage.

### Corporeal undead {#magic-undead}

Alter·Flesh repairs corporeal undead at normal healing Intensity, restoring no soul, identity, intelligence, memory, or loyalty. Unmake·Flesh damages living and corporeal undead bodies normally.

Conjure·Flesh may animate remains as a temporary generic **Mindless, Soulless Undead** summon. Use the table below; remains collapse at 0 HP or Duration's end, while conjured matter vanishes. Lasting undead require a named profile, profile-based Intensity, Duration 5, mythic price, and vulnerable physical anchor. Intelligence grants no former identity, memories, or loyalty.

Alter·Flesh at Intensity 5 and Duration 5 can make a living subject Undead through mythic ritual and lasting price; its soul departs. Shaping-made or sustained undead are active magic anchored vulnerably to body or remains. Existing undead are not inherently Shapings.

## Modifiers and transformation {#magic-transformation}

A modifier names one skill or narrow family; identical magical modifiers do not stack. Shaping never widens critical range or grants extra Combat Actions, Movement Actions, Reactions, Dodges, PP, IP, Hero Points, Talents, skills, or memories.

A transformation changes appearance and form. AP, attacks, movement modes, senses, Size benefits, and other mechanics need additional outcomes guided by an existing profile. Concept grants permission, not capabilities.

## Movement, senses, and adaptation {#magic-movement-senses-adaptation}

The benchmark prices a capability, not its fictional method. The chosen Technique·Form must explain how it works and determines valid subjects, defence, and side effects. `Alter·Flesh` might grow adhesive pads, `Bend·Force/Motion` might hold someone against a wall, and Earth cells might reshape or create handholds; none can perform the others' method merely because the movement result is similar.

### Movement {#magic-movement}

| Intensity | Capability                                                                                                             |
| --------: | ---------------------------------------------------------------------------------------------------------------------- |
|         2 | Gain a climb or swim mode at normal Movement, or traverse one named surface such as water or walls at normal Movement. |
|         3 | Gain flight at normal Movement.                                                                                        |
|         4 | Pass through one named mundane substance at half Movement; end every Movement Action in empty space.                   |

Instead of gaining a capability, a separate speed outcome may increase one named movement mode by 3 metres at Intensity 1, multiply it by 1.5 at Intensity 2, double it at Intensity 3, or triple it at Intensity 4. Use only the strongest magical speed adjustment to that mode. Determine its magically modified speed first, then apply mundane reductions such as Fatigue, darkness, or encumbrance.

A granted mode is subject-directed: its user spends their own Movement Action and chooses where to move. Sustaining it needs Duration but neither concentration nor the Shaper's Combat Action. If the Shaper instead directs another subject's movement, that is active control: the Shaper spends their Combat Action each round, and the subject moves on its turn using its own Movement Action. When a mode ends, unsupported subjects fall and other impossible movement stops where the fiction permits.

A movement capability grants permission and the listed speed, not automatic success in dangerous conditions. Athletics may still be required for violent currents, unstable surfaces, tight passages, or similar hazards. Passing through matter grants no protection, perception, or ability to remain inside it; if the subject cannot leave the substance within the same Movement Action, it returns to the point where it entered.

### Senses {#magic-senses}

| Intensity | Capability                                                                                                                                          |
| --------: | --------------------------------------------------------------------------------------------------------------------------------------------------- |
|         1 | Low-Light Sight or an equally narrow improvement to an existing sense.                                                                              |
|         2 | Night Vision, or a narrow environmental sense that reveals specified information but does not replace sight.                                        |
|         3 | Blind Sight through one named sense, with a declared blocker; it can substitute for sight only where that sense supplies the necessary information. |
|         4 | A broad supernatural sense that can detect and locate one defined class its Form governs, limited by purchased Range and a declared blocker.        |

These benchmarks grant a usable sense; a single clue, diagnosis, location, or observation instead uses the [Scry benchmark](/rules/magic/#effects--magic-scry). A sense provides only information its method can logically perceive and uses Perception whenever noticing something remains uncertain. Apply only the best relevant sense; senses do not stack. If one Shaping directly conceals the evidence from a magical sense, oppose their original Shaping results rather than treating either as automatic.

### Breathing {#magic-breathing}

| Intensity | Capability                                         |
| --------: | -------------------------------------------------- |
|         1 | Hold breath for up to 10 minutes.                  |
|         2 | Breathe one named medium, such as air or water.    |
|         3 | Function without breathing while the effect lasts. |

Breathing water does not grant swimming, and functioning without breath does not grant protection from pressure, heat, cold, corrosion, obscurity, or contact hazards. It prevents suffocation and effects whose only route is inhalation; hazards that also burn, poison through contact, or otherwise cause harm still require their own protection.

## Sensory concealment {#magic-sensory-concealment}

Choose what is concealed, the sense or senses affected, and whether the Shaping changes perceivers or the physical world. At Intensity 2, Perception tests using one named sense to detect the subject take `-1P`. At Intensity 3, the subject is imperceptible through one named sense. At Intensity 4, it is imperceptible through every sense the cell can govern. Intensity never widens a Form's scope.

Reach follows what the Shaping directly affects: count perceiving minds for an illusion, or the concealed subjects or area for a physical change. Targeting and defence follow that method. Concealment removes direct sensory evidence only; footprints, opened doors, displaced matter, and other physical consequences remain.

When Intensity 3+ removes sight, apply the [Pitch black](/rules/adventuring/#light-and-darkness) vision and attack consequences only against the concealed subject: vision-based Perception and ranged attacks cannot succeed without another applicable sense, and Close attacks take `-3P`. The observer's surrounding illumination and Movement are unchanged.

## Sensory impairment {#magic-sensory-impairment}

Sensory impairment is a condition on a perceiver; sensory concealment instead hides a particular subject or evidence. Reach for impairment counts affected perceivers. A bodily change normally faces Resilience, while a change to perception normally faces Persistence.

At Intensity 2, tests relying on one named sense suffer `-1P`. At Intensity 3, suppress that sense completely. At Intensity 4, suppress every sense the cell can govern. Intensity never widens a Form's scope.

Suppressing sight applies the [Pitch black](/rules/adventuring/#light-and-darkness) consequences generally to the impaired subject: vision-based Perception and ranged attacks cannot succeed, Close attacks suffer `-3P`, and Movement is quartered unless another applicable sense supplies what sight would. Other suppressed senses lose only information and functions that logically require them.

Use only the strongest applicable sensory limitation. Impairment and concealment do not add their penalties together. An alternate sense perceives normally when its method can detect the evidence: optical invisibility does not hide body heat from heat-based Blind Sight.

## Conditions and restoration {#magic-conditions-restoration}

A condition name describes paid consequences; it does not grant a free package of damage, movement, control, transformation, or other effects. Choose the lowest benchmark covering the exact result, and use the declared Technique·Form to explain its method.

| Intensity | Condition benchmark                                                                                                                                                           |
| --------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|         1 | Knock a human-sized subject prone, or impose a brief hindrance such as halved Movement through its next turn.                                                                 |
|         2 | Restrain a human-sized subject, partially impair one sense, or impose the standard `-1P` modifier on one skill or narrow family.                                              |
|         3 | Suppress one named sense, remove one Combat Action once, or impose a serious tactical compulsion as limited by the control rules.                                             |
|         4 | Incapacitate through a declared state such as magical sleep or paralysis: no Actions or Reactions while it lasts, subject to a retry or an immediate defined break condition. |

Duration sustains a state but never repeats a one-use outcome. In particular, a lost Combat Action occurs once regardless of Duration, and that target remains immune until it completes a later Combat Action.

Unless a rule below or the condition itself gives an easier escape, a subject under an ongoing hostile condition may spend a Combat Action to retry its original defence against the stored Shaping result. If the condition prevents Combat Actions, retry freely at the end of each turn instead. Winning frees that subject; failure leaves the condition in place. Influence and full control use their specific escape rules. A declared break condition may replace the retry: magical sleep can make its subject unconscious and helpless but end immediately upon damage or when an adjacent character spends a Combat Action to wake it.

Conditions of the same kind do not stack; use the strongest. Incapacitation alone means no Actions or Reactions, not automatic damage, movement, control, or helplessness. If a declared condition necessarily adds helplessness or another consequence, include it when judging the Intensity and give it an appropriate retry or break condition.

### Removing conditions {#magic-condition-removal}

Identify the source before choosing a restorative Shaping:

- **Active magic:** only [Dispel](/rules/magic/#ongoing-and-magical-actions--magic-dispel) ends the Shaping. Another condition-removal outcome cannot cheaply cancel or suppress it while its source remains active.
- **Poison or disease:** use the Potency-based curing rule under [Healing and death](#magic-healing).
- **Bleeding, Dying, or Wounded:** use their specific healing rules. Restoration does not bypass Wounded's Surgery and HP requirements.
- **Fatigue:** Intensity 3 removes Fatigued or reduces Exhausted to Fatigued; Intensity 4 removes Exhausted entirely. It does not remove deprivation or another continuing cause.
- **Another nonmagical condition:** use at least the Intensity that could impose the same mechanical severity, with a cell that can genuinely reverse its cause. Restoring a suppressed mundane sense, for example, is Intensity 3.

Removing a condition does not restore HP, senses, or other losses unless those are included as paid outcomes. If exposure, restraint, deprivation, or another cause remains, the condition may return normally.

“Curse” is not a separate mechanical category. Record its exact effects and source: Dispel an active magical curse, reverse a completed permanent change with a new appropriate Shaping, and resolve an oath, debt, quest, or mythic price through its own terms rather than generic condition removal.

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

Listed defence covers Dodge, Resilience, Persistence, and possible physical Parry; damage adds no DM. Summons ignore Major Wounds and vanish at 0 HP. Capabilities beyond the profile—including flight, incorporeality, spellcasting, [invisibility](/rules/magic/#effects--magic-sensory-concealment), extra natural armour, or special senses—raise minimum Intensity or add an outcome.

Range sets generic arrival. Calling a named being must also reach its location or realm; use the higher Range.

A named being uses its profile; set Intensity by threat, reserving 5 for legendary beings. An unwilling being resists calling with Persistence. Calling grants no control: it remembers treatment and may demand terms. Binding or command is another Persistence-resisted outcome. Duration and active limits apply until Shaping ends; afterward it may stay willingly, without magical command, guaranteed service, protection, or dismissal.

Created, summoned, transformed, or compelled beings cannot summon, contribute PP, create magical resources, or pay ritual prices.
