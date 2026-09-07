---
page: 3
title: Bonus & Penalty Dice
section: Foundations
objective: Choose a modified D100 result by grade before comparing its number.
layout: illustrated-sequence
sources:
  - src/content/rules/skills/bonus-and-penalty-dice.md
---

# Bonus & Penalty Dice

**Bonus dice keep the better result. Penalty dice keep the worse result.**
They change your roll, never your skill or Critical range.

## Build the roll

1. Total your Bonus (`+B`) and Penalty (`-P`) dice.
2. Cancel them one for one: `+2B` and `-1P` leave `+1B`.
3. Cap the remainder at `+3B` or `-3P`.
4. Roll one units die and one tens die, plus an extra tens die for each remaining
   Bonus or Penalty die.
5. Pair every tens die with the **same units die**. Two zeros still mean 100.

## Choose by grade, then number

Better to worse: **Critical → Success → Failure → Fumble**.

Within the same Critical or Success grade, **higher is better**.
Within the same Failure or Fumble grade, **lower is better**.
With Penalty dice, reverse that choice and keep the worse candidate.

Use this order even when nobody opposes you. Choose your final result before
comparing it with an opponent's roll.

## Same dice, different skill

Units `5`; tens `2` and `6`: the candidates are **25** and **65**.

- **Skill 70%:** both succeed. `+1B` keeps **65**; `-1P` keeps **25**.
- **Skill 60%:** 25 succeeds; 65 fails. `+1B` keeps **25**; `-1P` keeps **65**.

## Editorial notes

**Source:** Bonus and Penalty dice → numbered procedure and selection order.

**Visual:** Shared units die with two joining lines to candidate results. Repeat
the same dice under skill 70 and skill 60; show the changed selection clearly.
Use the result-grade order as a ladder, not a table.

**Exact labels:** `ONE SHARED UNITS DIE`, `GRADE FIRST`, `+1B KEEPS`, `-1P KEEPS`.

**Must retain:** Bonus does not always mean lowest roll. Skill and defender
tiebreakers never decide between candidates belonging to one roller.
