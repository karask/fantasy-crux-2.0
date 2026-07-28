---
type: rule
id: adventuring-healing-recovery
chapter: adventuring
title: Healing and Recovery
slug: healing-and-recovery
order: 40
summary: 'Healing stops Bleeding and Dying; a Wounded patient needs successful Surgery before natural recovery can begin.'
aliases:
  - wounded
  - bleeding
  - dying
  - surgery
  - natural healing
---

A post-armour hit that deals damage equal to or greater than the target's Major Wound Level makes the target **Wounded** and **Bleeding** after damage is applied.

- **Wounded:** `-1P` to every skill test.
- **Bleeding:** Lose 1 HP at the end of every round.
- **Dying:** At 0 HP, fall unconscious and die at the end of the third round unless stabilised.

Further Major Wounds apply damage normally. An active Wounded or Bleeding condition
does not stack with itself; a later Major Wound can restart Bleeding after it was
stopped.

## Battlefield Healing {#adventuring-battlefield-healing}

A helper can spend their entire round and make a Healing test while adjacent to the patient. Both remain stationary. Success removes Bleeding and Dying, but restores no HP. At 0 HP, a stable patient remains unconscious until restored to at least 1 HP.

Healing requires a Healing Kit or suitable improvised bandages and supplies. Without a kit, the test suffers `-2P`.

## Treating ordinary damage {#adventuring-ordinary-healing}

After an encounter, a character who is not Wounded may receive one Healing attempt before their next full rest. Success restores `1D4` HP. The limit is one attempt per patient, not one success.

## Surgery and natural recovery {#adventuring-surgery-recovery}

A Wounded character cannot recover HP naturally until successful Surgery or equivalent treatment. Surgery:

- uses Healing and cannot be attempted during combat;
- requires safe working conditions and suitable medical supplies;
- suffers `-2P` without a Healing Kit;
- restores 1 HP on a success.

After treatment, a character performing no more than light activity recovers a quarter of CON in HP per 24 hours, up to maximum HP. Wounded ends once current HP is greater than Major Wound Level.

[Alter·Flesh healing](/rules/magic/#effects--magic-healing) at Intensity 3+ counts as equivalent treatment.
