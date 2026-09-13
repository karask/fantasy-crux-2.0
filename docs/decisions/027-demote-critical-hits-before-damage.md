# ADR-027: Demote critical hits before damage

## Status

Accepted — 2026-09-13.

## Decision

An ordinary successful Dodge or Parry demotes a critical attack to an ordinary
hit. It neither stops nor reduces that hit. Roll normal damage, apply eligible
Action and Talent bonuses and normal Damage Modifier, then armour. Do not
resolve defence again or grant an extra attack or manoeuvre.

Hits that remain critical use maximum weapon damage and maximum positive
Damage Modifier when normally applicable, ignore armour and negative Damage
Modifier, and receive no additional Action or Talent damage.

Favoured Weapon and Signature Weapon retain their bonus on demoted hits.
Killing Angle and Master Assassin also apply to a demoted hit if their normal
positional conditions and once-per-round limit permit. Their exclusion now
explicitly applies only to hits that remain critical.

Critical Dodge or Parry still prevents damage. These weapon damage rules do
not change Shaping's opposed-defence procedure or magical critical effects.

## Rationale

The earlier wording allowed Favoured/Signature bonuses against an ordinary
successful Reaction but excluded Killing Angle/Master Assassin from every
critical roll. Expressing the matrix result as a demoted ordinary hit makes
the damage-bonus treatment consistent. This is a benefit to conditional
assassination damage when an ordinary successful defence demotes the hit;
it does not add that damage to an undefended Ambusher critical.
