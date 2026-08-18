# ADR-007: Distinguish Projected and Direct Harm

## Status

Accepted

## Date

2026-08-18

## Context

Shaping previously made mundane armour interact with physical magic, then used
the Piercing Talent to exempt selected effects. Flesh acquired an additional
"Internal Flesh" category because an internal description otherwise appeared
to bypass armour for free. That solution made narration carry hidden mechanical
weight: the same damage changed cost and protection according to how a player
described its point of origin. Padding interference existed mainly to justify
the distinction.

The design needs to preserve three separate questions:

- Does the effect cross intervening space or arise within its target?
- Which single defence answers it?
- Which protection applies after that defence?

It must also give every projected Form the same shield interaction. A shard of
ice should not become weaker than flame merely because one description is
solid. Spirit damage needs an equally explicit path because it attacks PP rather
than HP.

## Decision

Immediate Unmake damage declares one of two mutually exclusive deliveries
before Magnitude is calculated.

- **Projected Harm** crosses space, adds no Magnitude, and is answered by Dodge
  or shield Active Guard. Cover and nonmagical AP apply.
- **Direct Harm** arises within the target and adds `+1` Magnitude. Bodily or
  material Harm uses opposed Resilience; mental or spiritual Harm uses opposed
  Persistence. A winning resistance negates the outcome rather than reducing
  damage. Direct Harm ignores nonmagical worn, natural, and object AP. Magical
  Wards and named resistances remain effective against creatures; unattended
  objects retain magical protection only.

Dodge, shield Active Guard, Resilience, and Persistence all oppose the
Shaper's original Shaping result. That result is the attacker's skill roll; the
Shaper must succeed and win against Dodge, Resilience, or Persistence for that
subject to be affected. A winning shield guard instead applies Parry Size.

Direct Harm uses selected targets, never a radius. Every target still needs a
valid Range route, with Indirect required to cross a complete barrier.
Subsequent hazards, summoned attacks, falling objects, and other mundane
consequences follow their ordinary armour rules.

An individually targeted Projected Shaping may be Active Guarded only with a
ready shield, at `-1P`. Weapons never Active Guard magical projections. Missile
Guard removes the penalty; Shield Cover is a separate passive penalty and does
not stack with terrain cover. Areas, Direct Harm, and Spirit Harm cannot be
Active Guarded.

Projected Shapings use Intensity as Impact Size: Intensity 1 is Light, 2 Medium,
3 Heavy, 4 Huge, and 5 Beyond Huge. If shield Active Guard wins the opposed
test, ordinary Parry Size rules govern full, half, or ineffective blocks. A full
block stops the projected outcome as well as its damage. A winning Critical
shield Parry blocks everything. If Shaping wins, the guard has no effect;
magical Criticals still use normal effect dice and armour. Guarding alone never
damages the shield.

Unmake·Spirit damage is Direct-only, uses Persistence, costs the Direct `+1`
Magnitude, and deals `Intensity D6` PP. It causes no HP damage, Major Wound, or
Bleeding. At 0 PP it knocks out a living target, banishes a Spirit, and ends
possession. Soulless creatures remain invalid targets. A spectral projectile is
only cosmetic Tell and never changes this procedure.

Piercing, Internal Flesh, and padding interference are removed. No replacement
Talent is introduced; the published catalogue contains 49 Talents.

## Alternatives considered

### Let an internal description bypass armour freely

Rejected because narration would grant the mechanical benefits of the former
Piercing Talent without its Magnitude or investment cost, making Flesh
disproportionately efficient against armoured living creatures.

### Make all Shaping damage ignore mundane armour

Rejected because it would sharply increase ordinary Projected Harm against
heavy armour and erase an important distinction between an attack crossing
space and an effect arising within its target.

### Reduce armour-bypassing damage to D4s

Rejected because the delivery surcharge already prices Direct Harm and the
system should retain the established `Intensity D6` damage benchmark.

### Permit weapons to guard solid magical projectiles

Rejected because the visual substance of a Form would create unequal defensive
paths. Shield-only Active Guard gives ice, stone, flame, lightning, bone, and
Force the same offensive procedure.

### Make Spirit projection a mechanical projectile

Rejected because Spirit attacks PP through Persistence. Dodge, physical armour,
and shields would add a second defence model without a corresponding physical
attack.

## Consequences

- Delivery is a declared mechanical choice, not an advantage inferred from
  narration.
- Direct Harm pays the former armour-bypass surcharge without requiring a
  Talent or privileging Flesh.
- Projected Harm preserves the value of cover, shields, Dodge, and mundane
  armour.
- Form identity remains in valid subjects, fictional permissions, resistances,
  and secondary outcomes rather than hidden armour exceptions.
- Non-damaging restraint, control, alteration, and influence keep their existing
  defence and do not inherit the Direct Harm surcharge.
- A physical object attacking separately uses its ordinary weapon Size; an
  attack resolved as Shaping uses Impact Size.
- Tests contract delivery cost, defence exclusivity, shield results, Spirit PP
  damage, and the 49-Talent catalogue.
