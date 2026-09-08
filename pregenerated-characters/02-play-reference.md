# Shared play reference

Keep this with any of the [eight complete sheets](README.md). Their percentages are the values used in play; already-included armour, Damage Modifier, Quick Reflexes, and Favoured Weapon bonuses must not be applied a second time.

## Skill tests

Test when uncertainty matters. Roll D100 at or below the skill to succeed; 00 is 100. The sheet gives the critical range. At every skill below 100%, 99–00 fumbles; a fumble overrides success.

Bonus and Penalty dice change the roll, not the skill. Cancel them one for one, apply any specifically timed Talent adjustment, then cap at +3B or -3P. Roll one units die and the normal tens die plus the remaining extra tens dice. Build each possible D100 result with the same units die.

Compare **Critical > Success > Failure > Fumble**. Within the same successful grade, the higher result is better; within matching failures or fumbles, the lower result is better. Bonus dice keep the better result; Penalty dice keep the worse. This is not simply “always take the lowest with a Bonus die.”

Opposed tests use that same result order. Exact ties then favour the higher unmodified skill, then the defender or status quo. Ordinary physical attacks use the combat matrix below; Shaping defences use an opposed test against the original Shaping result.

Each foreign Culture, Language, Lore field, and Craft subject is a separate skill. A Language score of 50% or more means fluent everyday speech; lower scores allow simpler communication in proportion to the score. A printed base grants no impossible knowledge. A successful, relevant Lore test can grant +1B to one directly related test soon afterwards when recognition or preparation plausibly helps.

Sources: [Basic tests](../src/content/rules/skills/basic-tests.md), [Bonus and Penalty dice](../src/content/rules/skills/bonus-and-penalty-dice.md), [Opposed tests](../src/content/rules/skills/opposed-tests.md), [Knowledge skills](../src/content/rules/skills/knowledge-skills.md).

## A combat round

Each round is five seconds. At combat's start, roll **1D10 + the sheet's final Combat Order**; highest acts first. Ties favour higher DEX, then a D10 reroll.

Normally receive one Combat Action, one Movement Action, and one base Reaction each round. Each is spent once; unused actions do not carry forward. Close means within 2 metres.

| Option                | Cost and effect                                                                                                                                                                                                                          |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Attack or cast        | One Combat Action; casting also needs its Practice, Tell, and PP.                                                                                                                                                                        |
| Move                  | One Movement Action, up to the sheet's Movement.                                                                                                                                                                                         |
| Ready                 | Ready one item or nock an arrow while moving no more than half Movement. Stowing one item and drawing another, or readying two, uses the whole Movement Action.                                                                          |
| Withdraw              | Combat and Movement Actions: move up to Movement without movement-triggered Opportunity Attacks; retain the base Reaction.                                                                                                               |
| Sprint                | Combat and Movement Actions: move up to twice Movement; only the base Reaction remains, and only for Dodge.                                                                                                                              |
| Charge                | Combat and Movement Actions, all Reactions forfeited: move 5 m to twice Movement straight to an adjacent target, then one Close Combat attack; a hit adds 1D6. No extra off-hand attack.                                                 |
| Aim                   | Combat Action: +1B to the next ranged attack against one visible target. Lose it after any Reaction, loss of sight, or failing to make that attack with the next Combat Action. Ilen's Steady Aim removes only the Reaction restriction. |
| Reload light crossbow | Movement Action and base Reaction. A generic Ready action cannot shorten this.                                                                                                                                                           |
| Battlefield treatment | The entire round: Combat Action, Movement Action, and all Reactions. Helper and adjacent patient stay stationary.                                                                                                                        |

An incompatible action cannot be chosen after its cost has already been spent. Changing equipment takes the normal time; descriptions of ready equipment do not create free swaps. A two-handed ranged weapon prevents a strapped small shield from attacking, Parrying, or providing Active Guard until the ranged weapon is no longer wielded.

At a ranged weapon's listed Range, attack normally. Beyond Range and up to twice Range, take -2P; farther is impossible. Partial terrain cover imposes -1P, substantial cover -2P, and complete cover prevents the attack without another route. Arrows must be readied normally. A ranged weapon without a Close tag used within 2 m becomes an improvised Light club (1D6 + DM) at -1P. Its ordinary ranged Talent damage bonus does not apply to that improvised use.

Sources: [Rounds and Actions](../src/content/rules/combat/rounds-and-actions.md), [Ranged Combat](../src/content/rules/combat/ranged-combat.md), [Weapons](../src/content/rules/equipment/weapons.md).

## Defence and off-hand options

Dodge spends the base Reaction and is available once per round. Against ranged attacks, Dodge takes -1P. Parry normally uses Close Combat with a ready weapon or shield; an empty hand uses Unarmed Combat.

A ready shield can Active Guard a thrown weapon without a penalty, or a physical missile / individually targeted Projected Shaping at -1P. A ready weapon can guard a thrown weapon at -1P. Only Mara has passive Shield Cover; the other shields need an eligible Reaction to defend. Use only the better of Shield Cover or terrain cover.

With two ready one-handed items, choose **one** of these per round:

- After a standard Close or Unarmed attack, one extra attack with the other item at -1P; or
- One additional off-hand Parry or Opportunity Reaction at -1P.

An empty hand counts; two bare hands qualify. A two-handed weapon does not. The extra Reaction cannot Dodge or activate Protector. Using either option prevents the other that round. Nobody in this roster has Off-Hand Mastery.

On an ordinary successful Parry, compare the parrying item's Size with the incoming weapon:

| Parrying item             | Damage blocked            |
| ------------------------- | ------------------------- |
| Same Size or larger       | All                       |
| One Size smaller          | Half                      |
| Two or more Sizes smaller | None                      |
| Critical Parry            | All, irrespective of Size |

Mundane arrows, bolts, and sling projectiles are Light. Nerin's listed I2 force bolts are Medium Impact Size. Against Projected Shaping, the shield must first win its opposed test against the original casting result; apply magical Impact Size only if it wins.

Sources: [Active Guard](../src/content/rules/combat/active-guard.md), [Off-hand options](../src/content/rules/combat/off-hand-options.md), [Casting and Defence](../src/content/rules/magic/casting-and-defence.md).

## Physical attack results

| Attack           | Reaction                 | Result                                                                                          |
| ---------------- | ------------------------ | ----------------------------------------------------------------------------------------------- |
| Ordinary success | None, failure, or fumble | Roll damage, then apply armour.                                                                 |
| Ordinary success | Ordinary Dodge           | No damage.                                                                                      |
| Ordinary success | Ordinary Parry           | Reduce damage by Size, then apply armour.                                                       |
| Ordinary success | Critical Dodge or Parry  | No damage.                                                                                      |
| Critical         | None, failure, or fumble | Maximum listed weapon damage plus maximum positive DM where normally applicable; ignore armour. |
| Critical         | Ordinary Dodge or Parry  | Roll ordinary damage and apply armour; the Reaction does not stop or reduce it.                 |
| Critical         | Critical Dodge or Parry  | No damage; a critical Parry ignores Size.                                                       |

For the unopposed Critical result, ignore negative DM and all additional Talent/action damage bonuses: it replaces ordinary damage. For example, Mara's arming sword ordinarily deals **1D8 + 1D4 + 1**, but this Critical deals **12**, not 13. A Critical opposed by an ordinary Reaction still rolls ordinary damage, including her +1.

If a declared Talent replaces normal damage, follow that Talent; a Critical adds no free effect. Shaping uses its own opposed defence and payment rules. A magical Critical never maximises damage or healing dice and does not grant the physical weapon Critical's armour bypass.

Sources: [Critical Hits and Fumbles](../src/content/rules/combat/critical-hits-and-fumbles.md), [Damage and Wounds](../src/content/rules/combat/damage-and-wounds.md).

## Grappling and Orren's capture options

To establish a grapple, spend a Combat Action and commit at least one usable grasping limb. An aware target may spend one eligible Reaction before opposing Unarmed Combat with Dodge or Parry. Dodge uses the base Reaction and counts toward the once-per-round limit; an extra off-hand Parry keeps its normal item restrictions and -1P. Without a defence Reaction, the attacker must succeed at an unopposed Unarmed Combat test to establish the hold. A successful weapon Parry that wins also deals the attacker 1 HP ignoring AP; a shield or unarmed Parry does not.

If the attacker wins the contest or succeeds unopposed, they become controller. While grappling, both participants cannot use Movement Actions, take -1P to all tests, and may attack or Parry only unarmed or with a ready Light one-handed weapon. Committed limbs cannot attack, Parry, or count for off-hand options. A second committed limb grants +1B on grapple tests, including Wrestler, but stays occupied.

The held participant spends a Combat Action and wins an opposed Unarmed Combat test to escape. Opposing an escape or Wrestler test within the hold costs no Reaction. The controller may release freely on their turn. Orren's Wrestler works only after a grapple exists; its complete options are on his sheet. Subdue is an alternative blunt attack whose threshold and fallback damage are also printed there, not a guarantee that all his attacks are nonlethal.

Source: [Grappling](../src/content/rules/combat/grappling.md).

## Wounds, treatment, and Hero Points

One post-armour hit at or above maximum-HP-based MWL causes **Wounded** (-1P to every test) and **Bleeding** (lose 1 HP at each round's end). These conditions do not stack. At 0 HP, fall unconscious and become **Dying**; death follows after three rounds unless stabilised.

| Treatment                        | Result on success                                                                                                                                                                       |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Battlefield Healing              | Full round, adjacent and stationary: remove Bleeding and Dying; no HP restored. At 0 HP, the patient remains unconscious.                                                               |
| Ordinary after-encounter Healing | Patient must not be Wounded; one attempt before the patient's next full rest, whether it succeeds or fails; restore 1D4 HP.                                                             |
| Surgery                          | Healing outside combat in safe working conditions: restore 1 HP and unlock a Major Wound's natural recovery. Wounded ends once HP exceeds MWL.                                          |
| Tamsin's magical healing         | Restores its listed HP once and removes Bleeding/Dying. Intensity 3+ also counts as Surgery. Wounded still requires HP above MWL. A living subject raised above 0 HP can act next turn. |

Each ordinary Healing/Surgery attempt consumes one Healing Kit use, successful or not. Shaping pays PP and does not consume a kit use. Without a kit, Healing takes -2P. No PC has Practised Hands, Field Surgeon, or Physician; those Talents' improved treatment rules do not apply.

Everyone begins with **2 Hero Points**. Spend one when declaring its effect:

- **Reroll:** reroll a failed test (including a fumble), before consequences, costs, or Backlash. Keep the new result. At most one reroll per test from any source.
- **Downgrade a Major Wound:** keep all HP loss but avoid Wounded and Bleeding from that hit; that hit needs no Surgery.
- **Avoid Death:** at 0 HP become stable and unconscious rather than Dying or Bleeding; awaken after the scene with 1 HP. Pre-existing Wounded remains.
- **Story benefit:** with the GM's agreement, establish a plausible favourable detail; larger changes can cost more points.

Downgrading a Major Wound does not also prevent the 0-HP rule. If both effects are needed, Avoid Death costs another Hero Point.

Sources: [Healing and Recovery](../src/content/rules/adventuring/healing-and-recovery.md), [Character creation and Hero Points](../src/content/rules/characters/character-creation.md), [Magical healing](../src/content/rules/magic/effects.md).
