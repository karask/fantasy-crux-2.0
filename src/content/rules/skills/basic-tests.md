---
type: rule
id: skills.basic-tests
chapter: skills
title: Basic skill tests
slug: basic-tests
order: 10
summary:
  - Roll D100 at or below the skill to succeed; 00 counts as 100.
  - The critical range is 01 through the skill's integer tens digit; fumbles are 99–00 below 100%, and 00 at 100%.
quickReference:
  group: skills
  order: 10
aliases:
  - roll under
  - critical success
  - fumble
  - D100 test
---

State the intended action, then roll `D100` against the relevant skill.
Roll two ten-sided dice: one is the tens digit and one is the units digit.
`00` means 100.

Do not roll for routine work when the character has enough time, suitable tools, and relevant competence.
Roll when pressure, danger, limited time, or meaningful uncertainty makes both success and failure interesting.

## Result grades {#skills-result-grades}

Check fumbles first; a fumble overrides success.

| Grade    | Result                                                   |
| -------- | -------------------------------------------------------- |
| Critical | Roll from 01 through `floor(skill / 10)`.                |
| Success  | Roll at or below the skill without a Critical or Fumble. |
| Failure  | Roll above the skill without a Fumble.                   |
| Fumble   | Roll 99 or 00 with a skill below 100%; at 100%, only 00. |

Skills cannot exceed 100%.
At 100%, rolls 01–10 are Critical, 11–99 are Success, and 00 is a Fumble.

## Exact critical ranges {#skills-critical-ranges}

Use the integer tens digit, not rounding.

|  Skill | Critical range |
| -----: | -------------: |
|   0–9% |           none |
| 10–19% |             01 |
|    59% |          01–05 |
|    60% |          01–06 |
|    99% |          01–09 |
|   100% |          01–10 |

## Interpreting exceptional results {#skills-exceptional-results}

A Critical achieves the stated intent especially quickly, thoroughly, or effectively and may reveal an extra benefit or useful information.

A Fumble fails and introduces a serious consequence appropriate to the declared action, such as lost time, damaged equipment, danger, or a worse position.
It should follow from the risk already present rather than invent an unrelated disaster.
