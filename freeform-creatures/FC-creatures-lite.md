# Fantasy Crux Lite Creatures

This unpublished reference converts the original creature chapter to the current Lite rules. It is not part of the website yet.

## Reading a profile

Characteristics and attributes are fixed ready-to-play values. HP is `ceil((SIZ + CON) / 2)`, MWL is `ceil(HP / 2)`, PP normally equals POW, and Combat Order is `round((DEX + INT) / 2)` minus worn-armour ENC. Unlisted skills use their normal Lite base values.

An attack lists its skill, base damage, and Size. Add DM once to close, unarmed, and thrown damage; bows, slings, and crossbows never add it. Natural weapons are Light at SIZ 1–5, Medium at 6–20, Heavy at 21–40, and Huge at 41+; ordinary fists and kicks remain Light.

**Paralysed** creatures remain conscious and make passive resistance tests, but cannot take Actions or Reactions or move voluntarily.

## Creature tags

- **Living**: a biological living creature. It follows the normal Major Wound, Bleeding, Dying, and 0-PP rules.
- **Corporeal**: has a material body and can be affected by physical attacks.
- **Incorporeal**: has no physical characteristics, HP, MWL, AP, or DM. Mundane physical attacks cannot harm it.
- **Spirit**: a soul-being valid for Spirit effects and Spirit Combat. Spirits are not automatically Undead.
- **Construct**: a made, nonliving creature. It is Soulless; a programmed Construct is Mindless, while a free-willed one is not.
- **Elemental**: a nonliving, Corporeal, Mindless, Soulless magical substance or force, not a Spirit.
- **Undead**: a Corporeal, Soulless dead body. Ghoul, Mummy, and Vampire are intelligent; Skeleton and Zombie are Mindless.
- **Soulless**: has no soul, cannot enter Spirit Combat or be possessed, and is invalid for Spirit effects. It may still have a Mind.
- **Mindless**: has no thoughts or identity and is invalid for Mind effects. Animals are not Mindless.
- **Anchored**: bound to a named place, object, or body. The profile states the boundary and consequence.

Flesh affects biological matter, living or dead: people, beasts, plants, bone, corpses, flesh constructs, and corporeal undead. Mind affects every non-Mindless creature, including a Soulless one. Spirit never affects Soulless creatures.

A nonliving Corporeal Construct, Elemental, or Undead does not breathe, eat, sleep, or suffer poison, disease, suffocation, starvation, thirst, or ordinary fatigue unless its profile says otherwise. It becomes Wounded after a Major Wound but never Bleeding or Dying; at 0 HP it is disabled or destroyed. It remains active at 0 PP. At 0 PP, a Living creature falls unconscious and a Spirit is banished from the scene, ending any possession.

Nymphs are Corporeal Spirits with Anchors. Destruction of a nymph's body returns its spirit to the anchor; unless its profile says otherwise, it reforms there after `2D6` days.

## Creature Talents

**Mastery (skill) I–III** preserves exceptional creature competence without a skill over 100%. Rating 101–125 becomes Mastery I, 126–150 becomes II, and 151+ becomes III. After ordinary Bonus/Penalty cancellation, but before the final dice cap, remove up to the rank in remaining Penalty dice from that skill's test. Mastery never creates Bonus dice, raises the skill above 100%, or expands its critical range.

## Multiattack

A listed **Multiattack** spends one Combat Action. Make the first attack normally and each later attack at `-1P`; each penalty is independent, not cumulative. Attacks may choose the same or different targets, resolve separately, and each permits its own Reaction. The creature retains its base Reaction. Multiattack cannot be a Reaction or combine with Charge, Flurry, an off-hand attack, Rapid Shot, or another extra-attack source. Dodge remains limited to the base Reaction, once per round.

## Senses

**Night Vision** treats natural surface night as Illuminated; it does not help underground, in sealed or supernatural darkness, or against obscurity. **Night Sight** treats Partial Darkness as Illuminated and Darkness as Partial Darkness; Pitch Black is unchanged. **Blind Sight (sense)** ignores illumination only for targets that the named sense accurately perceives; it grants no colour, writing, fine visual detail, or eye contact, and its stated barriers still block it. Use only the best sense; senses do not stack.

An Incorporeal Spirit is invisible unless it manifests. Manifesting or fading spends its Combat Action and changes only visibility. Every Spirit has **Spirit Sense**, detecting other Spirits within POW metres regardless of manifestation; physical and magical barriers may block it when appropriate.

## Spirit Combat and possession

Only a creature with Spirit Combat may initiate it. Spend a Combat Action at Close range; no Reaction is spent. Oppose Spirit Combat with the defender's Spirit Combat or Persistence. The winner deals its listed PP damage, ignoring AP; a defender using Persistence deals `1D4` PP instead. Criticals affect result grade only. Soulless creatures are invalid targets. A Spirit reduced to 0 PP is banished from the scene and any possession ends.

For hostile possession, a capable Spirit must personally reduce a Living target to 0 PP, then spend a later Combat Action while both remain Close and the target remains at 0 PP; no new roll is made. Possession suspends only PP unconsciousness and restores no PP. Host and Spirit act at the host's existing Combat Order and share one Combat Action, Movement Action, and Reaction; the Spirit cannot act separately. If either has spent one of these that round, it is spent for their shared turn: possession refreshes nothing. Spirit Combat and Spirit magic may target the possessor. Ending possession reinstates normal 0-PP unconsciousness. A profile states who chooses the shared actions and any further effect.

## Elemental shells

A nymph's Elemental transformation is a physical overlay. Use the named Medium Elemental's SIZ, Movement, Combat Order, AP, damage, Attack, Dodge, Resilience, Engulf, Elemental Nature, Elemental Sense, and Camouflage. Retain the nymph's own tags, INT, POW, CHA, HP, MWL, current PP, Persistence, other skills, and Shaping; it does not gain Mindless or Soulless. Current HP carries unchanged between forms, so transforming or reverting never heals. If the shell reaches 0 HP, it dissolves and the nymph's Spirit returns to its anchor.

## Animals

### Giant Ant

**Tags:** Living, Corporeal.

A pony-sized colony predator protected by heavy chitin.

**Characteristics:** STR 14; CON 17; DEX 13; SIZ 7; INT 2; POW 6; CHA 5.

**Derived:** HP 12; MWL 6; PP 6; Movement 15 m; Combat Order 8; AP 5 chitin; DM +0.

**Skills:** Dodge 39%; Persistence 18%; Resilience 51%; Unarmed Combat 50%.

**Attacks:** Bite — Unarmed Combat 50%, `1D6 + DM`, Medium.

**Talents:** None.

**Abilities:** None.

### Bear

**Tags:** Living, Corporeal.

A massive, powerful omnivore with a thick hide.

**Characteristics:** STR 25; CON 13; DEX 11; SIZ 25; INT 5; POW 11; CHA 5.

**Derived:** HP 19; MWL 10; PP 11; Movement 23 m; Combat Order 8; AP 3 hide; DM +2D6.

**Skills:** Dodge 33%; Persistence 33%; Resilience 39%; Unarmed Combat 60%.

**Attacks:** Bite — Unarmed Combat 60%, `1D8 + DM`, Heavy; Claw — Unarmed Combat 60%, `1D6 + DM`, Heavy.

**Talents:** None.

**Abilities:** None.

### Bull

**Tags:** Living, Corporeal.

A territorial herd animal capable of devastating charges.

**Characteristics:** STR 20; CON 15; DEX 7; SIZ 15; INT 4; POW 7; CHA 4.

**Derived:** HP 15; MWL 8; PP 7; Movement 15 m; Combat Order 6; AP 2 hide; DM +1D6.

**Skills:** Dodge 21%; Persistence 21%; Resilience 45%; Unarmed Combat 40%.

**Attacks:** Horns — Unarmed Combat 40%, `1D8 + DM`, Medium; Trample — Unarmed Combat 40%, `1D8 + DM`, Medium.

**Talents:** None.

**Abilities:** **Horn Charge:** Use Horns for a normal Charge attack and add the Charge's `+1D6` damage.

### Crocodile

**Tags:** Living, Corporeal.

A heavily armoured ambush predator equally dangerous in water and at the shore.

**Characteristics:** STR 30; CON 19; DEX 11; SIZ 14; INT 3; POW 11; CHA 3.

**Derived:** HP 17; MWL 9; PP 11; Movement 7 m land, 23 m swim; Combat Order 7; AP 5 hide; DM +1D6.

**Skills:** Dodge 33%; Persistence 33%; Resilience 57%; Unarmed Combat 50%.

**Attacks:** Bite — Unarmed Combat 50%, `1D8 + DM`, Medium.

**Talents:** None.

**Abilities:** None.

### Dog

**Tags:** Living, Corporeal.

A domestic or feral canine that relies on speed and its bite.

**Characteristics:** STR 13; CON 11; DEX 13; SIZ 3; INT 5; POW 9; CHA 5.

**Derived:** HP 7; MWL 4; PP 9; Movement 23 m; Combat Order 9; AP 0; DM +0.

**Skills:** Dodge 39%; Persistence 27%; Resilience 33%; Unarmed Combat 40%.

**Attacks:** Bite — Unarmed Combat 40%, `1D6 + DM`, Light.

**Talents:** None.

**Abilities:** None.

### Elephant

**Tags:** Living, Corporeal.

An immense herd animal whose bulk makes its tusks and feet lethal.

**Characteristics:** STR 45; CON 24; DEX 11; SIZ 48; INT 6; POW 13; CHA 5.

**Derived:** HP 36; MWL 18; PP 13; Movement 23 m; Combat Order 9; AP 3 hide; DM +5D6.

**Skills:** Dodge 33%; Persistence 39%; Resilience 72%; Unarmed Combat 45%.

**Attacks:** Trample — Unarmed Combat 45%, `1D12 + DM`, Huge; Tusk — Unarmed Combat 45%, `1D10 + DM`, Huge.

**Talents:** None.

**Abilities:** None.

### Hawk

**Tags:** Living, Corporeal.

A small, agile bird of prey.

**Characteristics:** STR 2; CON 4; DEX 27; SIZ 2; INT 4; POW 7; CHA 4.

**Derived:** HP 3; MWL 2; PP 7; Movement 15 m ground, 30 m fly; Combat Order 16; AP 0; DM -1D6.

**Skills:** Dodge 81%; Persistence 21%; Resilience 12%; Unarmed Combat 50%.

**Attacks:** Claw — Unarmed Combat 50%, `1D6 + DM`, Light; Bite — Unarmed Combat 50%, `1D4 + DM`, Light.

**Talents:** None.

**Abilities:** None.

### Giant Hawk

**Tags:** Living, Corporeal.

A massive raptor capable of hunting prey as large as a horse.

**Characteristics:** STR 39; CON 33; DEX 18; SIZ 39; INT 4; POW 11; CHA 4.

**Derived:** HP 36; MWL 18; PP 11; Movement 23 m ground, 30 m fly; Combat Order 11; AP 3 feathers; DM +4D6.

**Skills:** Dodge 54%; Persistence 33%; Resilience 99%; Unarmed Combat 80%.

**Attacks:** Claw — Unarmed Combat 80%, `1D8 + DM`, Heavy; Bite — Unarmed Combat 80%, `1D6 + DM`, Heavy.

**Talents:** None.

**Abilities:** None.

### Horse

**Tags:** Living, Corporeal.

A swift riding and draft animal whose kick can shatter bone.

**Characteristics:** STR 25; CON 17; DEX 10; SIZ 25; INT 4; POW 11; CHA 5.

**Derived:** HP 21; MWL 11; PP 11; Movement 30 m; Combat Order 7; AP 2 hide; DM +2D6.

**Skills:** Dodge 30%; Persistence 33%; Resilience 51%; Unarmed Combat 40%.

**Attacks:** Kick — Unarmed Combat 40%, `1D6 + DM`, Light.

**Talents:** None.

**Abilities:** None.

### Lion

**Tags:** Living, Corporeal.

A powerful feline predator armed with jaws and claws.

**Characteristics:** STR 24; CON 11; DEX 17; SIZ 19; INT 5; POW 11; CHA 5.

**Derived:** HP 15; MWL 8; PP 11; Movement 23 m; Combat Order 11; AP 2 hide; DM +1D6.

**Skills:** Dodge 51%; Persistence 33%; Resilience 33%; Unarmed Combat 60%.

**Attacks:** Bite — Unarmed Combat 60%, `1D8 + DM`, Medium; Claw — Unarmed Combat 60%, `1D6 + DM`, Medium.

**Talents:** None.

**Abilities:** None.

### Giant Lizard

**Tags:** Living, Corporeal.

A large reptilian predator with powerful jaws and a battering tail.

**Characteristics:** STR 19; CON 11; DEX 15; SIZ 19; INT 3; POW 11; CHA 3.

**Derived:** HP 15; MWL 8; PP 11; Movement 15 m; Combat Order 9; AP 2 hide; DM +1D6.

**Skills:** Dodge 45%; Persistence 33%; Resilience 33%; Unarmed Combat 35%.

**Attacks:** Bite — Unarmed Combat 35%, `1D6 + DM`, Medium; Tail — Unarmed Combat 35%, `1D8 + DM`, Medium.

**Talents:** None.

**Abilities:** None.

### Giant Octopus

**Tags:** Living, Corporeal.

An enormous marine hunter whose arms can overwhelm several enemies.

**Characteristics:** STR 42; CON 14; DEX 23; SIZ 42; INT 4; POW 11; CHA 4.

**Derived:** HP 28; MWL 14; PP 11; Movement 7 m land, 30 m swim; Combat Order 14; AP 4 skin; DM +4D6.

**Skills:** Dodge 69%; Persistence 33%; Resilience 42%; Unarmed Combat 50%.

**Attacks:** Bite — Unarmed Combat 50%, `1D8 + DM`, Huge; Arm — Unarmed Combat 50%, `1D4 + DM`, Huge.

**Talents:** None.

**Abilities:** **Many Arms (Multiattack):** Make up to four Arm attacks under the Multiattack rule.

### Giant Python

**Tags:** Living, Corporeal.

A huge constricting snake capable of crushing prey within its coils.

**Characteristics:** STR 35; CON 11; DEX 13; SIZ 11; INT 3; POW 11; CHA 3.

**Derived:** HP 11; MWL 6; PP 11; Movement 15 m; Combat Order 8; AP 3 scales; DM +2D6.

**Skills:** Dodge 39%; Persistence 33%; Resilience 33%; Unarmed Combat 50%.

**Attacks:** Bite — Unarmed Combat 50%, `1D4 + DM`, Medium; Constrict — Unarmed Combat 50%, `1D8 + DM`, Medium.

**Talents:** None.

**Abilities:** **Constrict:** Use only against a creature the python is grappling. The grapple continues whether this attack hits or misses.

### Raven

**Tags:** Living, Corporeal.

A quick and observant scavenging bird.

**Characteristics:** STR 2; CON 4; DEX 21; SIZ 2; INT 5; POW 7; CHA 4.

**Derived:** HP 3; MWL 2; PP 7; Movement 15 m ground, 25 m fly; Combat Order 13; AP 0; DM -1D6.

**Skills:** Dodge 63%; Persistence 21%; Resilience 12%; Unarmed Combat 35%.

**Attacks:** Claw — Unarmed Combat 35%, `1D6 + DM`, Light; Bite — Unarmed Combat 35%, `1D4 + DM`, Light.

**Talents:** None.

**Abilities:** None.

### Rhinoceros

**Tags:** Living, Corporeal.

A thick-skinned herbivore whose charge can tear through a battle line.

**Characteristics:** STR 26; CON 11; DEX 7; SIZ 26; INT 3; POW 11; CHA 3.

**Derived:** HP 19; MWL 10; PP 11; Movement 23 m; Combat Order 5; AP 5 hide; DM +2D6.

**Skills:** Dodge 21%; Persistence 33%; Resilience 33%; Unarmed Combat 50%.

**Attacks:** Bite — Unarmed Combat 50%, `1D6 + DM`, Heavy; Gore — Unarmed Combat 50%, `1D8 + DM`, Heavy; Trample — Unarmed Combat 50%, `1D12 + DM`, Heavy.

**Talents:** None.

**Abilities:** **Horn Charge:** Use Gore for a normal Charge attack and add the Charge's `+1D6` damage.

### Giant Spider

**Tags:** Living, Corporeal.

A horse-sized ambush predator that traps prey in venomous webs.

**Characteristics:** STR 19; CON 17; DEX 16; SIZ 26; INT 8; POW 11; CHA 2.

**Derived:** HP 22; MWL 11; PP 11; Movement 15 m ground, 23 m on web; Combat Order 12; AP 4 chitin; DM +1D6.

**Skills:** Dodge 48%; Persistence 33%; Resilience 51%; Unarmed Combat 50%.

**Attacks:** Bite — Unarmed Combat 50%, `1D6 + DM`, Heavy; Web — Unarmed Combat 50%, no damage, Heavy, 15 m.

**Talents:** None.

**Abilities:** **Web:** Spend a Combat Action and oppose Unarmed Combat against the Athletics of one target within 15 m. If the spider wins, the target cannot take Movement Actions and suffers `-1P` on physical tests until the web is destroyed. Each web has 22 HP and 0 AP.

**Giant Spider Venom:** A Bite dealing HP damage exposes the target. **Type:** Injected. **Delay:** `1D3` rounds. **Potency:** 51. **Effect:** `-6 DEX` for the Duration and `1D3` HP at each minute's end; DEX 0 causes paralysis. **Duration:** `6D10` minutes.

### Viper

**Tags:** Living, Corporeal.

A fast venomous snake whose bite can bring down much larger prey.

**Characteristics:** STR 13; CON 6; DEX 27; SIZ 7; INT 3; POW 13; CHA 3.

**Derived:** HP 7; MWL 4; PP 13; Movement 30 m; Combat Order 15; AP 1 scales; DM +0.

**Skills:** Dodge 81%; Persistence 39%; Resilience 18%; Unarmed Combat 60%.

**Attacks:** Bite — Unarmed Combat 60%, `1D6 + DM`, Medium.

**Talents:** None.

**Abilities:** **Viper Venom:** A Bite dealing HP damage exposes the target. **Type:** Injected. **Delay:** 1 round. **Potency:** 48. **Effect:** `-3 CON` for the Duration and `1D4` HP at each minute's end; CON 0 causes death. **Duration:** `6D10` minutes.

### Wolf

**Tags:** Living, Corporeal.

A swift pack predator armed with powerful jaws and claws.

**Characteristics:** STR 11; CON 14; DEX 13; SIZ 10; INT 5; POW 11; CHA 5.

**Derived:** HP 12; MWL 6; PP 11; Movement 23 m; Combat Order 9; AP 0; DM +0.

**Skills:** Dodge 39%; Persistence 33%; Resilience 42%; Unarmed Combat 50%.

**Attacks:** Bite — Unarmed Combat 50%, `1D8 + DM`, Medium; Claw — Unarmed Combat 50%, `1D6 + DM`, Medium.

**Talents:** None.

**Abilities:** None.

## Monsters

### Basilisk

**Tags:** Living, Corporeal.

A small, many-coloured reptile created by foul alchemy; its eyes and blood are deadlier than its jaws.

**Characteristics:** STR 4; CON 13; DEX 11; SIZ 2; INT 3; POW 16; CHA 3.

**Derived:** HP 8; MWL 4; PP 16; Movement 15 m; Combat Order 7; AP 2 scales; DM -1D6.

**Skills:** Dodge 40%; Persistence 50%; Resilience 70%; Athletics 65%; Deception 40%; Natural Lore 40%; Unarmed Combat 35%.

**Attacks:** Bite — Unarmed Combat 35%, `1D6 + DM`, Light; a damaging hit injects Basilisk Venom.

**Talents:** None.

**Abilities:** **Death Gaze:** Once per turn, freely choose a creature within 16 m that can see the basilisk's eyes. It may avert its gaze, preventing the Gaze; without suitable Blind Sight it then cannot attack or React against the basilisk until its next turn. If it does not avert, oppose the basilisk's Persistence with Resilience. Defeat reduces it to 0 HP and makes it Dying, subject to its type rules; victory grants immunity for this combat. Eye contact must be mutual and Blind Sight never triggers the Gaze. The basilisk may still Bite.

**Basilisk Venom:** **Type:** Injected or contact. **Delay:** Immediate. **Potency:** 65. **Effect:** `-6 CON` for the Duration and `1D4` HP at each minute's end; CON 0 causes death. **Duration:** `6D10` minutes.

**Corrosive Blood:** A mundane weapon that deals HP damage to the basilisk is destroyed after `1D4` rounds. Before the end of the wielder's next turn, a Combat Action with abundant water or a suitable neutraliser prevents this.

### Beastman

**Tags:** Living, Corporeal.

Animal-headed humanoids who fiercely resist settlement of their wild territories.

**Characteristics:** STR 13; CON 16; DEX 11; SIZ 16; INT 13; POW 11; CHA 7.

**Derived:** HP 16; MWL 8; PP 11; Movement 15 m; Combat Order 9; AP 2 leather; DM +1D4.

**Skills:** Dodge 40%; Persistence 30%; Resilience 30%; Deception 40%; Natural Lore 70%; Close Combat 50%; Unarmed Combat 60%.

**Attacks:** Club — Close Combat 50%, `1D6 + DM`, Light; Shortspear — Close Combat 50%, `1D6 + DM`, Medium; Medium Shield — Close Combat 50%, `1D6 + DM`, Heavy; Head Butt — Unarmed Combat 60%, `1D6 + DM`, Medium.

**Talents:** None.

**Abilities:** Leaders or mystics may know individual nature-themed Shaping cells.

### Dragon

**Tags:** Living, Corporeal.

An ancient, intelligent flying reptile whose magic and temperament vary widely.

**Characteristics:** STR 70; CON 35; DEX 14; SIZ 65; INT 21; POW 26; CHA 21.

**Derived:** HP 50; MWL 25; PP 26; Movement 30 m ground, 45 m fly; Combat Order 18; AP 12 scales; DM +7D6.

**Skills:** Dodge 30%; Persistence 100%; Resilience 100%; Athletics 100%; Influence 100%; Perception 100%; Culture (Local) 100%; Natural Lore 100%; Unarmed Combat 100%.

**Attacks:** Bite — Unarmed Combat 100%, `1D10 + DM`, Huge; Claw — Unarmed Combat 100%, `1D8 + DM`, Huge; Tail — Unarmed Combat 100%, `1D20 + DM`, Huge.

**Talents:** Mastery (Persistence) III; Mastery (Influence) II; Mastery (Resilience) I; Mastery (Athletics) I; Mastery (Perception) I; Mastery (Unarmed Combat) I.

**Abilities:** **Double Claw 2 (Multiattack):** Make two Claw attacks. Mastery (Unarmed Combat) I normally removes the second attack's `-1P`.

**Breathe Flame:** Spend a Combat Action. A 26 m cone, 26 m wide at its end, deals `4D6` fire damage; roll once. An aware target may use its base Reaction to Dodge at `-1P`: success halves damage, rounded down; failure takes full damage. AP applies. Afterward, another use within one hour requires Resilience, at cumulative `-1P` for each attempt that hour.

**Fire Resistance:** Reduce fire damage by 12 after other reductions.

Ancient dragons may know potent cells such as Conjure·Fire, Bend·Fire, Ward·Fire, or Scry·Fate.

### Dwarf

**Tags:** Living, Corporeal.

Stocky, long-lived underground folk renowned for craft, mining, and stonework.

**Characteristics:** STR 14; CON 19; DEX 11; SIZ 7; INT 13; POW 11; CHA 11.

**Derived:** HP 13; MWL 7; PP 11; Movement 12 m; Combat Order 5; AP 5 chainmail; DM +0.

**Skills:** Dodge 20%; Persistence 40%; Resilience 55%; Athletics 50%; Engineering 35%; Mechanisms 40%; Trade 60%; Craft 70%; Close Combat 65%; Ranged Combat 45%.

**Attacks:** War Hammer or Battleaxe — Close Combat 65%, `1D8 + DM`, Medium; Medium Shield — Close Combat 65%, `1D6 + DM`, Heavy; Light Crossbow — Ranged Combat 45%, `1D8`, 125 m.

**Talents:** None.

**Abilities:** **Blind Sight (heat):** Thermoception perceives heat-contrasting targets regardless of illumination. Solid barriers, heavy insulation, and ambient-temperature targets defeat it.

**Earth Sense:** While touching connected earth or stone, the dwarf knows approximate depth and whether the surrounding chamber is structurally unstable.

Dwarven Shapers commonly favour Bend, Alter, Ward, or Scry·Earth/Stone cells.

### Elemental

**Tags:** Corporeal, Elemental, Soulless, Mindless.

Raw elemental substance embodied as water, darkness, flame, stone, or storm.

**Characteristics:** STR —; CON —; DEX —; SIZ by rank; INT —; POW —; CHA —.

**Derived:** Use the rank table; Combat Order 10 is an explicit profile value because Elementals have no DEX or INT.

| Rank   | SIZ |  HP | MWL |  PP | Move |  CO |  AP | DM  | Damage | Area | Attack | Dodge | Persistence | Resilience |
| ------ | --: | --: | --: | --: | ---: | --: | --: | :-: | -----: | ---: | -----: | ----: | ----------: | ---------: |
| Small  |   3 |   3 |   2 |   0 | 15 m |  10 |   0 |  —  |  `1D6` |  1 m |    15% |  100% |         30% |       100% |
| Medium |   9 |   9 |   5 |   0 | 23 m |  10 |   0 |  —  |  `2D6` |  3 m |    45% |   90% |         60% |       100% |
| Large  |  21 |  21 |  11 |   0 | 30 m |  10 |   0 |  —  |  `3D6` |  7 m |   100% |   60% |         90% |       100% |
| Huge   |  50 |  50 |  25 |   0 | 45 m |  10 |   0 |  —  |  `4D6` | 16 m |      — |   30% |        100% |       100% |

**Skills:** Perception 80%; Deception 80% while merged with a substantial quantity of its own element; rank-table combat skills.

**Attacks:** Engulf — Attack by rank, rank damage, every other creature within the listed radius; subtype sets resistance and damage kind.

**Talents:** Small: Mastery (Dodge) I. Large: Mastery (Attack) I. Huge: Mastery (Persistence) I. Medium: none.

**Abilities:** **Engulf:** Spend one Combat Action, centred on the Elemental; complete barriers block it. Roll damage once. Small through Large roll Attack once, which must succeed and win against each target's listed resistance separately.

**Overwhelming Engulf:** Huge rolls no Attack. Critical resistance negates damage, Success takes half rounded down, and Failure or Fumble takes full damage.

- **Undine — Drown:** Resilience; HP damage; ignores AP.
- **Shade — Fear:** Persistence; PP damage; ignores AP; normal 0-PP unconsciousness applies.
- **Salamander — Burn:** Resilience; HP damage; AP applies.
- **Gnome — Crush:** Resilience; HP damage; AP applies.
- **Sylph — Buffet:** Resilience; HP damage; AP applies.

**Elemental Nature:** Immune to poison, disease, and its own element.

**Elemental Sense:** Perception 80% detects invisible, Spirit, and magical targets regardless of light or invisibility; a solid barrier blocks it. Ordinary darkness still affects ordinary, nonmagical targets. Oppose concealment with Deception.

**Camouflage:** Deception 80% while merged with matching water, fire, stone, darkness, or cloud.

### Elf

**Tags:** Living, Corporeal.

Ageless forest folk bound to their woodland realms and fiercely protective of them.

**Characteristics:** STR 10; CON 11; DEX 17; SIZ 10; INT 17; POW 13; CHA 11.

**Derived:** HP 11; MWL 6; PP 13; Movement 15 m; Combat Order 14; AP 2 leather; DM +0.

**Skills:** Dodge 55%; Persistence 55%; Resilience 20%; Athletics 55%; Deception 55%; Healing 50%; Perception 30%; Natural Lore 80%; Close Combat 60%; Ranged Combat 80%.

**Attacks:** Shortspear — Close Combat 60%, `1D6 + DM`, Medium; Longbow — Ranged Combat 80%, `1D10`, 150 m.

**Talents:** None.

**Abilities:** **Exceptional Archer:** Gain `+1B` with bows. The longbow's minimum STR gives this elf `-1P`, so the dice normally cancel.

**Night Sight:** Partial Darkness counts as Illuminated and Darkness as Partial Darkness. Pitch Black and obscurity are unchanged.

Elf Shapers often favour Alter·Flesh, Scry·Flesh, Bend·Earth/Stone, and protective nature cells.

### Gargoyle

**Tags:** Living, Corporeal.

A grey, winged humanoid predator often mistaken for a grotesque stone statue.

**Characteristics:** STR 29; CON 11; DEX 11; SIZ 17; INT 4; POW 11; CHA 4.

**Derived:** HP 14; MWL 7; PP 11; Movement 15 m ground, 23 m fly; Combat Order 8; AP 6 hide; DM +2D6.

**Skills:** Dodge 25%; Persistence 40%; Resilience 40%; Athletics 40%; Deception 30%; Perception 40%; Natural Lore 40%; Unarmed Combat 50%.

**Attacks:** Claw — Unarmed Combat 50%, `1D6 + DM`, Medium.

**Talents:** None.

**Abilities:** Trained individuals may know a few scouting or warfare Shaping cells.

### Giant

**Tags:** Living, Corporeal.

A six-metre humanoid who adopts nearby cultures or lives in an isolated mountain clan.

**Characteristics:** STR 49; CON 39; DEX 10; SIZ 49; INT 11; POW 11; CHA 7.

**Derived:** HP 44; MWL 22; PP 11; Movement 30 m; Combat Order 11; AP 3 hide; DM +5D6.

**Skills:** Dodge 10%; Persistence 25%; Resilience 80%; Athletics 50%; Deception 5%; Perception 40%; Natural Lore 20%; Close Combat 90%; Ranged Combat 35%; Unarmed Combat 75%.

**Attacks:** Huge Club — Close Combat 90%, `2D6 + DM`, Huge; Thrown Boulder — Ranged Combat 35%, `2D6 + DM`, Huge, 49 m; Stomp — Unarmed Combat 75%, `1D6 + DM`, Huge.

**Talents:** None.

**Abilities:** Giants may learn cultural Shaping; isolated ones favour Earth/Stone, Air/Storm, or Spirit cells.

### Goblin

**Tags:** Living, Corporeal.

A small, agile humanoid accustomed to surviving through cunning and numbers.

**Characteristics:** STR 10; CON 10; DEX 17; SIZ 7; INT 11; POW 10; CHA 7.

**Derived:** HP 9; MWL 5; PP 10; Movement 15 m; Combat Order 11; AP 2 leather; DM +0.

**Skills:** Dodge 50%; Persistence 20%; Resilience 35%; Athletics 50%; Deception 75%; Mechanisms 50%; Perception 35%; Natural Lore 50%; Close Combat 40%; Ranged Combat 50%.

**Attacks:** Shortspear — Close Combat 40%, `1D6 + DM`, Medium; Small Shield — Close Combat 40%, `1D4 + DM`, Medium; Sling — Ranged Combat 50%, `1D6`, 50 m.

**Talents:** None.

**Abilities:** **Blind Sight (heat):** Thermoception perceives heat-contrasting targets regardless of illumination. Solid barriers, heavy insulation, and ambient-temperature targets defeat it.

Leaders and shamans may know combat, trickery, or survival-themed Shaping cells.

### Golem

**Tags:** Corporeal, Construct, Soulless, Mindless; a free-willed Golem loses Mindless.

A clay construct animated to execute a sacred command with literal, tireless precision.

**Characteristics:** STR 39; CON 29; DEX 7; SIZ 29; INT 4 or 7 free-willed; POW 4 or 11 free-willed; CHA 4 or 7 free-willed.

**Derived:** HP 29; MWL 15; PP 4 or 11 free-willed; Movement 15 m; Combat Order 6 or 7 free-willed; AP 8, or 4 against crushing harm; DM +3D6.

**Skills:** Dodge 0%; Persistence 90%; Resilience 100%; Lore (Allocated Task) 50%; one programmed skill 100%; Unarmed Combat 30%. Free-willed Golems develop other skills normally.

**Attacks:** Fist — Unarmed Combat 30%, `1D8 + DM`, Light.

**Talents:** None.

**Abilities:** **Programmed Task:** A programmed Golem pursues only its stated task and obeys literally. A free-willed Golem is not bound by this rule.

**Construct Body:** It does not breathe, eat, sleep, bleed, or suffer poison or disease. At 0 HP it is disabled or destroyed; 0 PP does not incapacitate it.

**Slow:** It cannot Sprint. Free-willed Golems may learn Shaping.

### Griffin

**Tags:** Living, Corporeal.

A proud mountain predator with a lion's body, an eagle's head, and immense wings.

**Characteristics:** STR 28; CON 22; DEX 22; SIZ 28; INT 6; POW 13; CHA 7.

**Derived:** HP 25; MWL 13; PP 13; Movement 23 m ground, 30 m fly; Combat Order 14; AP 3 hide; DM +2D6.

**Skills:** Dodge 40%; Persistence 80%; Resilience 70%; Athletics 80%; Deception 28%; Perception 50%; Natural Lore 60%; Unarmed Combat 70%.

**Attacks:** Bite — Unarmed Combat 70%, `1D8 + DM`, Heavy; Claw — Unarmed Combat 70%, `1D6 + DM`, Heavy.

**Talents:** None.

**Abilities:** **Raking Dive (Multiattack):** Spend the Combat and Movement Actions to fly at least 10 m straight and then make two Claw attacks. This replaces Charge, grants no Charge damage, and retains the base Reaction.

### Harpy

**Tags:** Living, Corporeal.

A filthy, winged scavenger whose claws and missiles spread disease.

**Characteristics:** STR 11; CON 11; DEX 18; SIZ 7; INT 11; POW 11; CHA 4.

**Derived:** HP 9; MWL 5; PP 11; Movement 15 m ground, 30 m fly; Combat Order 15; AP 0; DM +0.

**Skills:** Dodge 50%; Persistence 25%; Resilience 60%; Athletics 60%; Deception 60%; Perception 75%; Natural Lore 60%; Ranged Combat 40%; Unarmed Combat 75%.

**Attacks:** Claw — Unarmed Combat 75%, `1D6 + DM`, Medium; Dropped Stone — Ranged Combat 40%, `1D6` per full 3 m fallen, maximum `10D6`, Light, directly below; Dung — Ranged Combat 40%, no damage, Light, directly below.

**Talents:** None.

**Abilities:** **Dropped Missile:** Choose a target directly below the Harpy, no more than 30 m down. Dropping a stone or dung is a Ranged Combat attack; an aware target may React normally.

**Filth:** A damaging Claw, dung hit, or dung-coated stone exposes the victim to the Shakes. **Type:** Touch. **Delay:** `1D2` days. **Potency:** 50. **Effect:** DEX remains halved while active; lose `1D6` HP after each Delay. **Duration:** Until the victim wins a repeated Resilience-versus-Potency test.

**Stench:** A dung hit gives `-1P` to Influence and Deception until the victim and equipment are washed for one hour. Harpies are immune to disease. Some know Bend·Force/Motion or Alter·Flesh.

### Merfolk

**Tags:** Living, Corporeal.

A territorial sea-dweller whose undersea society mirrors kingdoms above.

**Characteristics:** STR 14; CON 11; DEX 13; SIZ 17; INT 11; POW 11; CHA 11.

**Derived:** HP 14; MWL 7; PP 11; Movement 23 m swim, 7 m crawl; Combat Order 12; AP 0; DM +1D6.

**Skills:** Dodge 30%; Persistence 30%; Resilience 30%; Athletics 60%; Deception 30%; Perception 50%; Natural Lore 80%; Close Combat 35%.

**Attacks:** Longspear — Close Combat 35%, `1D8+1 + DM`, Medium; Dagger — Close Combat 35%, `1D4+1 + DM`, Light.

**Talents:** None.

**Abilities:** **Aquatic:** Breathes air and can hold its breath underwater for 11 minutes. Merfolk Shapers commonly know Water/Ice cells.

### Sea Serpent

**Tags:** Living, Corporeal.

An enormous aquatic serpent that drags prey to caverns beneath the sea.

**Characteristics:** STR 58; CON 35; DEX 7; SIZ 36; INT 3; POW 21; CHA 3.

**Derived:** HP 36; MWL 18; PP 21; Movement 23 m swim, 0 m land; Combat Order 5; AP 5 scales; DM +5D6.

**Skills:** Dodge 40%; Persistence 40%; Resilience 80%; Athletics 60%; Deception 25%; Unarmed Combat 60%.

**Attacks:** Bite — Unarmed Combat 60%, `1D6 + DM`, Heavy.

**Talents:** None.

**Abilities:** **Aquatic:** Breathes water and cannot move under its own power on land.

### Holy Steed

**Tags:** Living, Corporeal.

A deity's otherworldly mount, manifesting as a sacred eagle, kraken, iron horse, or similar form.

**Characteristics:** STR 30; CON 20; DEX 18; SIZ 30; INT 18; POW 18; CHA 18.

**Derived:** HP 25; MWL 13; PP 18; Movement 20 m; Combat Order 18; AP 6; DM +2D6.

**Skills:** Dodge 100%; Persistence 100%; Resilience 100%; Unarmed Combat 80%.

**Attacks:** Fist or Kick — Unarmed Combat 80%, `1D10 + DM`, Light.

**Talents:** Mastery (Dodge) I; Mastery (Persistence) I; Mastery (Resilience) I.

**Abilities:** **Divine Form:** Choose land, swim, or flight as its 20 m movement mode when creating it.

### Holy Warrior

**Tags:** Living, Corporeal.

An otherworldly champion whose form and weapon reflect its deity.

**Characteristics:** STR 20; CON 18; DEX 15; SIZ 18; INT 15; POW 18; CHA 18.

**Derived:** HP 18; MWL 9; PP 18; Movement 12 m; Combat Order 15; AP 6; DM +1D6.

**Skills:** Dodge 100%; Persistence 100%; Resilience 100%; Athletics 100%; choose Close Combat, Ranged Combat, or Unarmed Combat 100%.

**Attacks:** Choose a current weapon or natural attack; use its base damage and Size, adding DM only when that attack normally does.

**Talents:** Mastery (Dodge) II; Mastery (chosen combat skill) II; Mastery (Resilience) I; Mastery (Athletics) I.

**Abilities:** Appearance, weapon, and optional Shaping cells express its patron without changing these values.

### Lizardman

**Tags:** Living, Corporeal.

A tool-using reptilian person adapted to deserts, swamps, and other hot regions.

**Characteristics:** STR 17; CON 11; DEX 10; SIZ 11; INT 13; POW 11; CHA 7.

**Derived:** HP 11; MWL 6; PP 11; Movement 15 m; Combat Order 12; AP 2 scales; DM +1D4.

**Skills:** Dodge 45%; Persistence 25%; Resilience 30%; Athletics 45%; Deception 30%; Perception 35%; Natural Lore 45%; Close Combat 45%; Ranged Combat 35%; Unarmed Combat 25%.

**Attacks:** Battleaxe — Close Combat 45%, `1D8 + DM`, Medium; Sling — Ranged Combat 35%, `1D6`, 50 m; Bite — Unarmed Combat 25%, `1D6 + DM`, Medium.

**Talents:** None.

**Abilities:** Lizardman cultures may teach any appropriate Shaping cells.

### Ogre

**Tags:** Living, Corporeal.

A massive, warty humanoid who dominates weaker creatures through brute force.

**Characteristics:** STR 23; CON 13; DEX 11; SIZ 23; INT 10; POW 10; CHA 3.

**Derived:** HP 18; MWL 9; PP 10; Movement 15 m; Combat Order 11; AP 2 skin; DM +2D6.

**Skills:** Dodge 35%; Persistence 45%; Resilience 35%; Athletics 35%; Deception 50%; Perception 50%; Natural Lore 35%; Close Combat 60%; Ranged Combat 40%; Unarmed Combat 60%.

**Attacks:** Great Axe — Close Combat 60%, `2D8 + DM`, Heavy; Improvised Rock — Ranged Combat 40%, `1D4 + DM`, Light, 23 m; Fist — Unarmed Combat 60%, `1D6 + DM`, Light; Bite — Unarmed Combat 60%, `1D8 + DM`, Heavy.

**Talents:** None.

**Abilities:** Ogre mystics commonly favour destructive Fire, Flesh, Mind, or Spirit cells.

### Orc

**Tags:** Living, Corporeal.

A violent clan-based humanoid whose warband is ruled by strength and ambition.

**Characteristics:** STR 14; CON 11; DEX 14; SIZ 10; INT 11; POW 10; CHA 7.

**Derived:** HP 11; MWL 6; PP 10; Movement 15 m; Combat Order 10; AP 2 leather; DM +0.

**Skills:** Dodge 35%; Persistence 35%; Resilience 35%; Athletics 35%; Deception 45%; Perception 45%; Craft 40%; Close Combat 40%; Ranged Combat 50%.

**Attacks:** Scimitar — Close Combat 40%, `1D8 + DM`, Medium; Medium Shield — Close Combat 40%, `1D6 + DM`, Heavy; Shortbow — Ranged Combat 50%, `1D8`, 75 m.

**Talents:** None.

**Abilities:** War leaders and shamans may know aggressive or protective Shaping cells.

### Pixie

**Tags:** Living, Corporeal.

A tiny, winged forest person known for curiosity, mischief, and subtle magic.

**Characteristics:** STR 4; CON 11; DEX 14; SIZ 4; INT 11; POW 13; CHA 11.

**Derived:** HP 8; MWL 4; PP 13; Movement 15 m ground, 30 m fly; Combat Order 13; AP 0; DM -1D6.

**Skills:** Dodge 60%; Persistence 60%; Resilience 20%; Athletics 60%; Deception 60%; Perception 60%; Natural Lore 80%; Close Combat 10%; Ranged Combat 25%.

**Attacks:** Dagger — Close Combat 10%, `1D4+1 + DM`, Light; Sling — Ranged Combat 25%, `1D6`, 50 m.

**Talents:** None.

**Abilities:** Magical Pixies may know cells such as Conjure·Mind, Bend·Air/Storm, or Bend·Paths; set Shaping to suit the individual.

### Troll

**Tags:** Living, Corporeal.

A large, solitary predator whose body repairs wounds with terrifying speed.

**Characteristics:** STR 26; CON 20; DEX 7; SIZ 26; INT 6; POW 11; CHA 7.

**Derived:** HP 23; MWL 12; PP 11; Movement 23 m; Combat Order 7; AP 3 hide; DM +2D6.

**Skills:** Dodge 25%; Persistence 25%; Resilience 60%; Athletics 20%; Deception 20%; Perception 20%; Natural Lore 40%; Close Combat 40%; Unarmed Combat 40%.

**Attacks:** Club — Close Combat 40%, `1D6 + DM`, Light; Claw — Unarmed Combat 40%, `1D6 + DM`, Heavy.

**Talents:** None.

**Abilities:** **Regeneration:** At the start of its turn, even at 0 HP, recover `1D6` HP unless it has taken fire damage since the start of its previous turn. This bypasses Wounded's recovery lock and removes Bleeding and Dying; Wounded remains. If HP rises above 0, the Troll wakes and may act that turn.

**Blind Sight (heat):** Thermoception perceives heat-contrasting targets regardless of illumination. Solid barriers, heavy insulation, and ambient-temperature targets defeat it.

### Werewolf

**Tags:** Living, Corporeal.

A person who can become a giant wolf willingly—or involuntarily beneath the full moon.

**Characteristics:** STR 11/22; CON 11; DEX 11; SIZ 13; INT 13/6; POW 11; CHA 11, human/wolf.

**Derived:** HP 12; MWL 6; PP 11; Movement 15/30 m; Combat Order 12/9; AP 0/1; DM +0/+1D6, human/wolf.

**Skills:** Dodge 60%; Persistence 60%; Resilience 60%; Athletics 60%; Deception 60%; Perception 60%; Natural Lore 80%; human Close Combat 35%; human Ranged Combat 25%; wolf Unarmed Combat 60%.

**Attacks:** Human Arming Sword — Close Combat 35%, `1D8 + DM`, Medium; Human Shortbow — Ranged Combat 25%, `1D8`, 75 m; Wolf Bite — Unarmed Combat 60%, `1D8 + DM`, Medium; Wolf Claw — Unarmed Combat 60%, `1D6 + DM`, Medium.

**Talents:** None.

**Abilities:** **Shapeshift:** Spend a Combat Action on two consecutive turns; transformation completes after the second. A full moon forces wolf form.

**Night Vision:** In either form, natural surface night counts as Illuminated. It does not overcome sealed, underground, or supernatural darkness or obscurity.

**Wolf Immunity:** In wolf form, mundane attacks deal no damage unless silver, fire, or magical; a qualifying source deals normal damage. Poison, suffocation, and drowning still work. Mystics favour Alter·Flesh, Scry·Flesh, or Earth/Stone cells.

### Wyvern

**Tags:** Living, Corporeal.

A lean, two-legged draconic predator armed with jaws, claws, and a venomous tail.

**Characteristics:** STR 26; CON 19; DEX 13; SIZ 26; INT 7; POW 11; CHA 6.

**Derived:** HP 23; MWL 12; PP 11; Movement 23 m ground, 30 m fly; Combat Order 10; AP 5 scales; DM +2D6.

**Skills:** Dodge 50%; Persistence 35%; Resilience 50%; Athletics 50%; Deception 10%; Perception 60%; Unarmed Combat 60%.

**Attacks:** Bite — Unarmed Combat 60%, `1D10 + DM`, Heavy; Claw — Unarmed Combat 60%, `1D6 + DM`, Heavy; Sting — Unarmed Combat 60%, `1D6 + DM`, Heavy; a damaging Sting injects venom.

**Talents:** None.

**Abilities:** **Bite/Claw/Sting 3 (Multiattack):** Make all three attacks; Bite is normal, while Claw and Sting each suffer `-1P` under Multiattack.

**Wyvern Venom:** **Type:** Injected. **Delay:** `1D2` rounds. **Potency:** 60. **Effect:** `1D6` HP and `-4 CON`. **Duration:** `6D10` minutes.

## Nymphs

### Dryad

**Tags:** Corporeal, Spirit, Anchored.

A woodland spirit whose body grows from one tree and whose grove extends 44 m from it.

**Characteristics:** STR 7; CON 11; DEX 14; SIZ 10; INT 17; POW 22; CHA 19.

**Derived:** HP 11; MWL 6; PP 22; Movement 15 m; Combat Order 16; AP 0; DM +0.

**Skills:** Close Combat 40%; Dodge 50%; Persistence 60%; Resilience 40%; Natural Lore 60%; Deception 50%; Perception 50%; Performance 50%; Shaping 60%.

**Attacks:** Quarterstaff — Close Combat 40%, `1D8 + DM`, Medium.

**Talents:** None.

**Abilities:** **Shaping cells:** Bend·Mind, Alter·Mind, Conjure·Fire, Bend·Paths.

**Grove Anchor:** The Dryad cannot leave its grove; doing so dissolves its body and returns its Spirit to the tree. If the tree is destroyed, it cannot reform.

**Tree Passage:** While touching its tree, spend a Movement Action to dissolve the body or emerge beside the tree.

**One with the Grove:** As a Combat Action, choose one 3 m-radius patch of vegetation in the grove. Until this ability is used again, movement through it costs double, or existing vegetation opens to permit normal movement. The Dryad may instead cause harmless growth, flowers, or fruit. Damage and restraint require Shaping.

### Hag

**Tags:** Corporeal, Spirit, Anchored.

A cave or darkness spirit that hunts beyond its domain only between sunset and dawn.

**Characteristics:** STR 21; CON 11; DEX 11; SIZ 11; INT 19; POW 28; CHA 3.

**Derived:** HP 11; MWL 6; PP 28; Movement 15 m; Combat Order 15; AP 0; DM +1D6.

**Skills:** Unarmed Combat 55%; Dodge 50%; Persistence 60%; Resilience 40%; Lore (Magic) 40%; Lore (Undead) 40%; Natural Lore 40%; Deception 100%; Perception 50%; Shaping 75%.

**Attacks:** Claw — Unarmed Combat 55%, `1D6 + DM`, Medium.

**Talents:** Mastery (Deception) I.

**Abilities:** **Shaping cells:** Bend·Mind, Alter·Mind, Unmake·Fire, Unmake·Flesh.

**Nightbound:** The Hag may leave its domain only at night. Dawn outside the domain or direct natural sunlight destroys its body and returns its Spirit home.

**Create Shade:** In Darkness within its domain, spend a Combat Action and 3 PP to create one Small Shade using the Elemental profile. Give it one simple standing order; it follows literally and otherwise protects the Hag. Changing the order costs the Hag a Combat Action. It acts immediately after the Hag and remains within the domain until destroyed or dismissed. Only one may exist at a time.

### Naiad

**Tags:** Corporeal, Spirit, Anchored.

A water spirit anchored to one stream, lake, swamp, or coastal reach.

**Characteristics:** STR 14; CON 11; DEX 14; SIZ 10; INT 17; POW 25; CHA 19.

**Derived:** HP 11; MWL 6; PP 25; Movement 15 m; Combat Order 16; AP 0; DM +0.

**Skills:** Close Combat 40%; Ranged Combat 40%; Dodge 80%; Persistence 70%; Resilience 60%; Natural Lore 40%; Deception 65%; Perception 40%; Performance 40%; Shaping 60%.

**Attacks:** Shortspear — Close Combat 40%, `1D6 + DM`, Medium; Javelin — Ranged Combat 40%, `1D6 + DM`, Medium, 28 m.

**Talents:** None.

**Abilities:** **Shaping cells:** Bend·Water/Ice, Alter·Water/Ice, Ward·Water/Ice, Alter·Flesh, Bend·Mind.

**Water Anchor:** Each complete 10 m band travelled away from its water costs 1 PP; returning restores none. The Naiad recovers PP only while submerged. At 0 PP, its body collapses into water and its Spirit returns home.

**Undine Transformation:** Spend a Combat Action and 9 PP to adopt a Medium Undine shell under the shared rule. A Combat Action restores normal form.

### Oread

**Tags:** Corporeal, Spirit, Anchored.

A stone spirit anchored to one hill, mountain, valley, or similar landform.

**Characteristics:** STR 7; CON 12; DEX 17; SIZ 10; INT 14; POW 22; CHA 15.

**Derived:** HP 11; MWL 6; PP 22; Movement 15 m; Combat Order 16; AP 0; DM +0.

**Skills:** Unarmed Combat 35%; Ranged Combat 40%; Dodge 40%; Persistence 30%; Resilience 50%; Natural Lore 40%; Deception 80%; Perception 50%; Performance 50%; Shaping 70%.

**Attacks:** Stone Fist — Unarmed Combat 35%, `1D6 + DM`, Medium; Thrown Rock — Ranged Combat 40%, `1D4 + DM`, Light, 7 m.

**Talents:** None.

**Abilities:** **Shaping cells:** Bend·Earth/Stone, Alter·Earth/Stone, Ward·Earth/Stone, Unmake·Earth/Stone, Scry·Earth/Stone.

**Earth Anchor:** Each complete 10 m band travelled away from its domain costs 1 PP; returning restores none. The Oread recovers PP only within its domain. At 0 PP, its body petrifies and its Spirit returns home.

**Gnome Transformation:** Spend a Combat Action and 9 PP to adopt a Medium Gnome shell under the shared rule. A Combat Action restores normal form.

## Spirits

### Ancestor Spirit

**Tags:** Incorporeal, Spirit.

A deceased relative who preserves family memory, craft, and counsel.

**Characteristics:** INT 11; POW 17; CHA 11; physical characteristics —.

**Derived:** HP —; MWL —; PP 17; Movement 30 m; Combat Order 11; AP —; DM —.

**Skills:** Dodge 40%; Persistence 50%; Lore (Spirit World) 40%; Spirit Combat 40%.

**Attacks:** Spectral Blast — Spirit Combat 40%, `1D6` PP.

**Talents:** None.

**Abilities:** **Helpful Possession:** The Ancestor and a willing Living relative each spend a Combat Action while Close; no Spirit Combat is required. Choose `1D6` appropriate inherited skills when creating it. During possession, the host gains `+1B` with them and normally chooses the shared actions.

### Disease Spirit

**Tags:** Incorporeal, Spirit.

A predatory spirit embodying one disease.

**Characteristics:** INT 7; POW 17; CHA 11; physical characteristics —.

**Derived:** HP —; MWL —; PP 17; Movement 30 m; Combat Order 7; AP —; DM —.

**Skills:** Dodge 40%; Persistence 50%; Lore (Disease) 100%; Lore (Spirit World) 40%; Deception 30%; Spirit Combat 50%.

**Attacks:** Spectral Claw — Spirit Combat 50%, `1D6` PP.

**Talents:** None.

**Abilities:** **Disease Possession:** Choose one disease when creating the Spirit. The host chooses shared actions, immediately contracts the disease, and suffers `-1P` on Resilience against disease. A successful recovery test prevents that interval's effect, but the disease remains and tests again after its Delay until the Spirit is expelled. Expulsion permits normal recovery but removes no accumulated effect.

### Ghost

**Tags:** Incorporeal, Spirit.

A dead soul held in the world by obsession, violence, or unfinished duty; it is neither Undead nor Soulless.

**Characteristics:** INT 11; POW 11; CHA 11; physical characteristics —.

**Derived:** HP —; MWL —; PP 11; Movement 23 m; Combat Order 11; AP —; DM —.

**Skills:** Dodge 40%; Persistence 50%; Lore (Spirit World) 30%; Deception 50%; Perception 40%; Spirit Combat 40%.

**Attacks:** Spectral Grasp — Spirit Combat 40%, `1D6` PP.

**Talents:** None.

**Abilities:** **Dominant Possession:** The Ghost normally chooses shared actions. At each turn's start, the host opposes Persistence with the Ghost's Persistence. A host win lets it choose that turn; a Critical win by the host also ends possession.

**Echoes of Life:** A particular Ghost may retain appropriate mundane skills or Shaping cells known while alive.

### Guardian Spirit

**Tags:** Incorporeal, Spirit, Anchored.

A bound spirit that protects a place, object, tomb, or treasure according to stated conditions.

**Characteristics:** INT 7; POW 17; CHA 11; physical characteristics —.

**Derived:** HP —; MWL —; PP 17; Movement 30 m; Combat Order 7; AP —; DM —.

**Skills:** Dodge 40%; Persistence 60%; Lore (Spirit World) 40%; Spirit Combat 70%.

**Attacks:** Spectral Claw — Spirit Combat 70%, `1D6` PP.

**Talents:** None.

**Abilities:** **Binding:** Define the anchor and conduct that triggers the Guardian. It cannot move more than 17 m from the anchor.

**Alarm:** When its condition is broken, it howls audibly to 170 m and identifies the intruders. On its next turn it spends its Combat Action to manifest, then acts according to its binding.

### Healing Spirit

**Tags:** Incorporeal, Spirit.

A luminous restorative spirit and natural enemy of Disease Spirits.

**Characteristics:** INT 7; POW 14; CHA 11; physical characteristics —.

**Derived:** HP —; MWL —; PP 14; Movement 30 m; Combat Order 7; AP —; DM —.

**Skills:** Dodge 40%; Persistence 50%; Lore (Disease) 100%; Lore (Spirit World) 60%; Spirit Combat 50%; Shaping 100%.

**Attacks:** Spectral Blast — Spirit Combat 50%, `1D6` PP.

**Talents:** None.

**Abilities:** **Shaping cells:** Alter·Flesh, Scry·Flesh.

**Disease Hunter:** It may initiate Spirit Combat with a Disease Spirit possessing a creature it touches. The host suffers no PP damage from that combat. Banishment ends the disease possession. A Healing Spirit cannot possess.

### Magic Spirit

**Tags:** Incorporeal, Spirit.

A constellation of coloured lights gathered around one coherent magical theme.

**Characteristics:** INT 11; POW 14; CHA 4; physical characteristics —.

**Derived:** HP —; MWL —; PP 14; Movement 30 m; Combat Order 11; AP —; DM —.

**Skills:** Dodge 40%; Persistence 50%; Lore (Spirit World) 60%; Spirit Combat 50%; Shaping 70%.

**Attacks:** Spectral Blast — Spirit Combat 50%, `1D6` PP.

**Talents:** None.

**Abilities:** **Shaping Cells:** Choose `1D6` cells sharing one Form or coherent theme. Shaping is `min(POW × 5, 100)%`. The Spirit casts and spends its own PP; it cannot lend PP, active capacity, or cells.

**Defensive Spirit:** It cannot initiate Spirit Combat but may defend when another creature initiates it.

### Passion Spirit

**Tags:** Incorporeal, Spirit.

A predatory embodiment of fear, madness, or pain; choose one passion when creating it.

**Characteristics:** INT 10; POW 17; CHA 14; physical characteristics —.

**Derived:** HP —; MWL —; PP 17; Movement 30 m; Combat Order 10; AP —; DM —.

**Skills:** Dodge 40%; Persistence 50%; Lore (Spirit World) 60%; Spirit Combat 55%.

**Attacks:** Spectral Claw — Spirit Combat 55%, `1D6` PP.

**Talents:** None.

**Abilities:** The host chooses shared actions except when Madness incapacitates it.

**Fear Possession:** The host suffers `-1P` on attacks and Reactions.

**Pain Possession:** The host suffers `-1P` on every skill test.

**Madness Possession:** At each stressful scene's start, oppose the Spirit's Persistence with the host's Resilience. If the Spirit wins, the host is Incapacitated—no Actions or Reactions—for `1D6 × 10` minutes. A host win prevents another fit that scene.

## Undead

### Ghoul

**Tags:** Corporeal, Undead, Soulless.

An intelligent corpse-eater driven by endless hunger.

**Characteristics:** STR 14; CON 11; DEX 11; SIZ 13; INT 11; POW 11; CHA 4.

**Derived:** HP 12; MWL 6; PP 11; Movement 15 m; Combat Order 11; AP 0; DM +1D4.

**Skills:** Unarmed Combat 60%; Dodge 40%; Persistence 30%; Resilience 40%; Lore (Undead) 75%; Athletics 40%; Deception 60%; Perception 30%.

**Attacks:** Claw — Unarmed Combat 60%, `1D4 + DM`, Medium; Bite — Unarmed Combat 60%, `1D6 + DM`, Medium; a damaging Bite exposes the target to Ghoul Venom.

**Talents:** None.

**Abilities:** **Ghoul Howl:** Freely at the start of its turn, affect every Living listener within 11 m. A howl remains audible until the Ghoul's next turn. Oppose the highest-Persistence audible Ghoul with each listener's Persistence. Defeat gives `-1P` on attacks and Reactions while any howl is audible; victory grants immunity for this combat. A listener tests once per round and multiple howls do not stack. The Ghoul retains its normal actions.

**Ghoul Venom:** **Type:** Injected, ingested, or smeared. **Delay:** `1D3` rounds. **Potency:** 22. **Effect:** Paralysed. **Duration:** `1D10` hours or until healing restores at least 1 HP.

### Mummy

**Tags:** Corporeal, Undead, Soulless.

An intelligent, ritually preserved ruler or guardian with no Shaping by default.

**Characteristics:** STR 23; CON 23; DEX 4; SIZ 13; INT 13; POW 0; CHA 1.

**Derived:** HP 18; MWL 9; PP 0; Movement 15 m; Combat Order 9; AP 2 natural; DM +1D6.

**Skills:** Close Combat 80%; Unarmed Combat 60%; Dodge 30%; Persistence 80%; Resilience 50%; Lore (Undead) 65%; Athletics 10%; Deception 10%; Perception 40%.

**Attacks:** Great Hammer — Close Combat 80%, `2D8 + DM`, Heavy; Fist — Unarmed Combat 60%, `1D6 + DM`, Light.

**Talents:** None.

**Abilities:** **Flammable:** Fire that deals HP damage ignites the Mummy. At each round's end it suffers that damage again without reapplying AP. Extinguishing costs its Combat Action, Movement Action, and all Reactions while it rolls, smothers the flames, or enters water.

**Preserved Flesh:** Alter·Flesh repairs it at normal Intensity. Mind affects it normally; Soulless protects only against Spirit.

### Skeleton

**Tags:** Corporeal, Undead, Soulless, Mindless.

Animated bones following simple commands.

**Characteristics:** STR 13; CON 4; DEX 11; SIZ 11; INT 0; POW 0; CHA 0.

**Derived:** HP 8; MWL 4; PP 0; Movement 15 m; Combat Order 3; AP 2 leather; DM +0.

**Skills:** Close Combat 35%; Dodge 10%; Persistence 100%; Resilience 100%.

**Attacks:** Arming Sword — Close Combat 35%, `1D8 + DM`, Medium; Medium Shield — Close Combat 35%, `1D6 + DM`, Heavy.

**Talents:** None.

**Abilities:** **Pierce Resistance:** After Parry and AP, halve damage from piercing weapons, rounded down.

### Vampire

**Tags:** Corporeal, Undead, Soulless.

An intelligent undead predator sustained by stolen blood and life force.

**Characteristics:** STR 23; CON 23; DEX 11; SIZ 13; INT 13; POW 0; CHA 11.

**Derived:** HP 18; MWL 9; PP 0; Blood Reserve 0/18; Movement 15 m; Combat Order 5 in chainmail or 3 in platemail; AP 5/6; DM +1D6.

**Skills:** Close Combat 50%; Unarmed Combat 60%; Dodge 40%; Persistence 80%; Resilience 80%; Culture (Local) 80%; Athletics 50%; Deception 80%; Perception 80%.

**Attacks:** Arming Sword — Close Combat 50%, `1D8 + DM`, Medium; Medium Shield — Close Combat 50%, `1D6 + DM`, Heavy; Bite — Unarmed Combat 60%, `1D6 + DM`, Medium.

**Talents:** None.

**Abilities:** **Senses:** Night Vision; Blind Sight (living beings), blocked by walls and complete solid cover.

**Blood Reserve:** Maximum 18, current 0. Use current Reserve as PP and maximum Reserve instead of POW for the active Shaping limit. It pays costs, Counter, rituals, and commitments, but never recovers naturally; 0 does not incapacitate the Vampire. It also recovers no HP naturally.

**Clinging Bite:** If Bite deals HP damage, establish a grapple with that target without another Action or test.

**Drain:** While grappling a Living target, spend a Combat Action and roll `1D6`. If the target began above 0 PP, drain actual PP up to its current PP; only if it began at 0 PP, drain HP instead. Drain ignores AP and never spills from PP to HP. Allocate the actual amount between Vampire HP and Blood Reserve within their maxima; excess is lost.

**Mist Form:** Spend a Combat Action to become mist with carried nonliving equipment. It is immune to mundane physical attacks and can only use its Movement Action or a Combat Action to reform. Magic and sunlight work normally.

**Death Mist:** At 0 HP, the Vampire is disabled until the start of its next turn, then enters Mist Form at 1 HP. Before then, an adjacent creature can spend a full round to stake and decapitate it, destroying it permanently.

**Sunlight:** Direct natural sunlight deals 2 HP at each round's end, ignoring AP; complete opaque covering prevents exposure.

**Holy Aversion:** Choose a sacred symbol. Presenting it within sight spends a Combat Action and opposes the bearer's Persistence with the Vampire's Resilience. If the bearer wins, the Vampire loses `1D4` HP ignoring AP and cannot attack the bearer until the bearer's next turn while the symbol remains visible.

Individual Vampires may learn Shaping cells and pay for them from Blood Reserve.

### Zombie

**Tags:** Corporeal, Undead, Soulless, Mindless.

A rotting corpse animated to obey simple commands or attack the living.

**Characteristics:** STR 23; CON 4; DEX 7; SIZ 10; INT 0; POW 0; CHA 2.

**Derived:** HP 7; MWL 4; PP 0; Movement 7 m; Combat Order 4; AP 0; DM +1D6.

**Skills:** Unarmed Combat 50%; Dodge 0%; Persistence 100%; Resilience 100%.

**Attacks:** Fist — Unarmed Combat 50%, `1D3 + DM`, Light.

**Talents:** None.

**Abilities:** None.
