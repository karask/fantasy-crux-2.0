---
type: rule
id: combat.damage-and-wounds
chapter: combat
title: Damage and Wounds
slug: damage-and-wounds
order: 80
summary: A post-armour hit at least equal to Major Wound Level causes Wounded and Bleeding; at 0 HP the victim is unconscious and Dying.
aliases:
  - Major Wound
  - Bleeding
  - Dying
  - Surgery
---

On a hit, roll weapon damage, add Damage Modifier when applicable, then add any extra dice or fixed damage from the declared action or Talent. Resolve any successful Parry, subtract Armour Points, and reduce current HP by the remaining damage, to a minimum of 0 damage. Current HP cannot fall below 0. [Critical hits](/rules/combat/#critical-hits-and-fumbles) change this procedure as stated in their result matrix.

Damage Modifier applies to Close Combat, Unarmed Combat, and thrown attacks. Bows, crossbows, and slings use only listed damage unless a Talent says otherwise.

## Major Wounds

When one post-armour hit deals damage equal to or greater than the target's Major Wound Level (`MWL`), apply the HP loss and both conditions:

- **Wounded:** `-1P` on every test.
- **Bleeding:** lose 1 HP at the end of every Combat Round.

These conditions do not stack. Further Major Wounds still deal damage and can restart Bleeding after it was removed, but do not create wounds that must be tracked separately.

## Dying

At 0 HP, a character falls unconscious and becomes **Dying**. If still Dying at the end of the third Combat Round after reaching 0 HP, the character dies.

To stabilise a patient, an adjacent helper spends a full round—Combat Action, Movement Action, and all Reactions—and succeeds at a Healing test while both remain stationary. Success removes Bleeding and Dying but restores no HP; a patient at 0 HP remains unconscious. The test requires a Healing Kit or suitable improvised supplies and suffers `-2P` without them.

After stabilisation, successful Surgery or equivalent treatment restores 1 HP and unlocks natural recovery. Wounded ends after that treatment once current HP is greater than MWL. See [healing and recovery](/rules/adventuring/#healing-and-recovery) for recovery time and equipment.

Do not make a Resilience test or roll on an injury table for a Major Wound.

## Hero Points

When a hit would cause a Major Wound, spend 1 Hero Point to keep the full HP loss but prevent Wounded and Bleeding from that hit. Treat it as ordinary damage: it creates no Major Wound that requires Surgery.

At 0 HP, spend 1 Hero Point to Avoid Death. The character becomes stable and unconscious rather than Bleeding or Dying, awakens after the scene at 1 HP, and remains Wounded if that condition already applied. Preventing a Major Wound does not also Avoid Death; if the retained damage reaches 0 HP, that costs another Hero Point.
